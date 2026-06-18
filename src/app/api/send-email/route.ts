import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSiteSettingsEmail } from '@/lib/contentful';

const resend = new Resend(process.env.RESEND_API_KEY);
const VERIFIED_SENDER = 'nihar@negativereel.com';
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// ---------------------------------------------------------------------------
// Rate limiting — 3 submissions per IP per 10 minutes (in-memory)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

// ---------------------------------------------------------------------------
// Spam content analysis
// ---------------------------------------------------------------------------
interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}

function detectSpam(name: string, email: string, message: string): SpamCheckResult {
  // Minimum meaningful message length
  if (message.trim().length < 10) {
    return { isSpam: true, reason: "Message too short" };
  }

  // Detect random high-entropy strings (like "YUXupGKIyQZTnaERP")
  // A word is suspicious if it has no vowels and is longer than 6 chars, or
  // alternates case randomly with no spaces.
  const words = message.split(/\s+/);
  const gibberishWords = words.filter((word) => {
    const clean = word.replace(/[^a-zA-Z]/g, "");
    if (clean.length < 6) return false;
    const hasVowel = /[aeiouAEIOU]/.test(clean);
    const upperCount = (clean.match(/[A-Z]/g) || []).length;
    const lowerCount = (clean.match(/[a-z]/g) || []).length;
    // Mixed case with no vowels = gibberish
    if (!hasVowel && clean.length > 5) return true;
    // Random camelCase-like pattern in a single "word" (alternating caps in no pattern)
    if (upperCount > 2 && lowerCount > 2 && clean.length > 8) {
      const transitions = [...clean].filter(
        (c, i) => i > 0 && /[A-Z]/.test(c) !== /[A-Z]/.test(clean[i - 1])
      ).length;
      if (transitions > clean.length * 0.4) return true;
    }
    return false;
  });

  if (gibberishWords.length >= 2) {
    return { isSpam: true, reason: "Message contains gibberish content" };
  }

  // Excessive URLs (more than 2 links = likely spam)
  const urlCount = (message.match(/https?:\/\/\S+/gi) || []).length;
  if (urlCount > 2) {
    return { isSpam: true, reason: "Too many URLs in message" };
  }

  // All-caps message (shouting / spam)
  const letters = message.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const capsRatio = (letters.match(/[A-Z]/g) || []).length / letters.length;
    if (capsRatio > 0.7) {
      return { isSpam: true, reason: "Message is mostly uppercase" };
    }
  }

  // Name looks like a random string
  const nameCleaned = name.replace(/[^a-zA-Z]/g, "");
  if (nameCleaned.length > 6 && !/[aeiouAEIOU]/.test(nameCleaned)) {
    return { isSpam: true, reason: "Name appears to be invalid" };
  }

  // Disposable / known spam email domains
  const spamDomains = ["mailinator.com", "guerrillamail.com", "trashmail.com", "tempmail.com", "throwam.com", "yopmail.com"];
  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain && spamDomains.includes(emailDomain)) {
    return { isSpam: true, reason: "Disposable email address" };
  }

  return { isSpam: false };
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile verification
// ---------------------------------------------------------------------------
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const formData = new URLSearchParams();
  formData.append("secret", process.env.CLOUDFLARE_SECRET_KEY!);
  formData.append("response", token);

  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: formData });
  const data = await res.json() as { success: boolean };
  return data.success;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, turnstileToken } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security check token is missing' },
        { status: 400 }
      );
    }

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 }
      );
    }

    // Spam content analysis
    const spamCheck = detectSpam(name, email, message);
    if (spamCheck.isSpam) {
      console.warn(`Spam submission blocked [${ip}]: ${spamCheck.reason}`);
      // Return success to the sender so spammers don't know they were blocked
      return NextResponse.json({
        message: "Form submitted successfully",
        adminEmail: "Sent",
        userEmail: "Sent",
      });
    }

    try {
      const cmsEmail = await getSiteSettingsEmail();
      if (!cmsEmail) {
        return NextResponse.json({ error: 'Contact email not configured' }, { status: 503 });
      }

      // First send the admin notification
      const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
        from: `Nihar J Reddy Photography <${VERIFIED_SENDER}>`,
        to: cmsEmail,
        bcc: ["vuday23@gmail.com"],
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h1 style="color: #333;">New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Message:</strong></p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                <strong>Nihar J Reddy Photography</strong><br>
                Email: nihar@negativereel.com<br>
                Website: www.negativereel.com
              </p>
              <p style="font-size: 12px; color: #666;">
                This is an automated email sent from your contact form.
              </p>
            </body>
          </html>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}

Message:
${message}

---
Nihar J Reddy Photography
Email: nihar@negativereel.com
Website: www.negativereel.com
        `,
      });

      if (adminEmailError) {
        console.error("Error sending admin email:", adminEmailError);
        console.error("Admin email error details:", JSON.stringify(adminEmailError));
      } else {
        console.log("Admin email sent successfully:", adminEmailData);
      }

      // Wait a moment before sending the user confirmation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Send confirmation email to user
      const { data: userEmailData, error: userEmailError } = await resend.emails.send({
        from: `Nihar J Reddy Photography <${VERIFIED_SENDER}>`,
        to: email,
        bcc: ["hello@negativereel.com", "vuday23@gmail.com"],
        subject: "Thank you for contacting Nihar J Reddy Photography",
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h1 style="color: #333;">Thank you for your message, ${name}</h1>
              <p>Thank you for reaching out! I've received your message and appreciate your interest in my photography services. 
                I'll review your inquiry and get back to you as soon as possible.</p>
              <p>I look forward to discussing how we can capture your special moments together.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                <strong>Nihar J Reddy Photography</strong><br>
                Email: nihar@negativereel.com<br>
                Website: www.negativereel.com
              </p>
            </body>
          </html>
        `,
      });

      if (userEmailError) {
        console.error("Error sending confirmation email:", userEmailError);
        return NextResponse.json(
          { error: "Failed to send confirmation email" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Form submitted successfully",
        adminEmail: "Sent",
        userEmail: "Sent",
      });

    } catch (emailError) {
      console.error("Resend API error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
