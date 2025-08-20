import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import ContactFormEmail from '@/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate the request body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Render the React email template to HTML
    const html = await renderAsync(ContactFormEmail({ name, email, message }));

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['vuday23@gmail.com'],
      bcc: ['niharjreddy@gmail.com'],
      subject: `New Contact Form Message from ${name}`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in email API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
