import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// The verified email domain
const VERIFIED_EMAIL = "nihar@niharjreddy.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
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
                Email: nihar@niharjreddy.com<br>
                Website: www.niharjreddy.com
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
Email: nihar@niharjreddy.com
Website: www.niharjreddy.com
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
                Email: nihar@niharjreddy.com<br>
                Website: www.niharjreddy.com
              </p>
            </body>
          </html>
        `,
      });

      if (userEmailError) {
        console.error("Error sending confirmation email:", userEmailError);
        return res.status(500).json({ error: "Failed to send confirmation email" });
      }

      return res.status(200).json({
        message: "Form submitted successfully",
        adminEmail: "Sent",
        userEmail: "Sent",
      });

    } catch (emailError) {
      console.error("Resend API error:", emailError);
      return res.status(500).json({ error: "Failed to send email" });
    }
  } catch (error) {
    console.error("Error processing form submission:", error);
    return res.status(500).json({ error: "An error occurred while processing your request" });
  }
}