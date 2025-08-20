import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import ContactFormEmail from '@/emails/ContactFormEmail';

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: EmailPayload) {
  const { name, email, message } = data;

  try {
    // Render the React email template to HTML
    const html = await renderAsync(ContactFormEmail({ name, email, message }));

    // For testing, we'll use the resend.dev domain which is allowed for testing
    const { data: resData, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['vuday23@gmail.com'],
      bcc: ['niharjreddy@gmail.com'],
      subject: `New Contact Form Message from ${name}`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', resData); // Added for testing
    return { success: true, data: resData };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw new Error('Failed to send email');
  }
}