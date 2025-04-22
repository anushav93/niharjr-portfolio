import nodemailer from 'nodemailer';
import './server'; // Import the server marker

// Add a server-only directive
export const dynamic = 'force-dynamic';

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendMailWithNodemailer(data: EmailPayload) {
  const { name, email, message } = data;
  
  // Configure nodemailer with your email provider
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'vuday23@gmail.com',
    subject: `Contact Form: Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      
      Message: 
      ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${message}</p>
        </div>
      </div>
    `,
    // Send a copy to the sender
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
} 