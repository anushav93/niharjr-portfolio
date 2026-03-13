import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// The verified email domain
const VERIFIED_EMAIL = "nihar@negativereel.com";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const formData = new URLSearchParams();
  formData.append("secret", process.env.CLOUDFLARE_SECRET_KEY!);
  formData.append("response", token);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json() as { success: boolean };
  return data.success;
}

export async function POST(request: NextRequest) {
  try {
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

    try {
      // First send the admin notification
      const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
        from: `Nihar J Reddy Photography <${VERIFIED_EMAIL}>`,
        to: "niharjreddy@gmail.com", // Admin email
        cc: ["vuday23@gmail.com"], // Add additional CC
        replyTo: email, // Make reply-to the customer's email
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
        from: `Nihar J Reddy Photography <${VERIFIED_EMAIL}>`,
        to: email,
        bcc: ["niharjreddy@gmail.com"], // BCC the admin as a backup
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
