'use server';

import { redirect } from 'next/navigation';
import { sendMailWithNodemailer, type EmailPayload } from '@/lib/email';

export async function sendEmail(data: EmailPayload) {
  try {
    return await sendMailWithNodemailer(data);
  } catch (error) {
    console.error('Error in sendEmail action:', error);
    throw new Error('Failed to send email');
  }
} 