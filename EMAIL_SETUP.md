# Email Configuration Setup

This portfolio website uses Next.js server actions and Nodemailer to send emails from the contact form to the specified email address.

## Environment Variables

The following environment variables are required for the email functionality to work:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Using Gmail

If you're using Gmail as your email provider, follow these steps:

1. Set EMAIL_USER to your Gmail address
2. For EMAIL_PASSWORD, you need to use an App Password, not your regular Gmail password
3. To generate an App Password:
   - Go to your Google Account at https://myaccount.google.com/
   - Navigate to Security
   - Under "Signing in to Google," select "2-Step Verification" (You need to have this enabled)
   - At the bottom of the page, select "App passwords"
   - Select "Mail" as the app and "Other" as the device
   - Enter a custom name (e.g., "Portfolio Website")
   - Click "Generate"
   - Copy the 16-character password and use it as your EMAIL_PASSWORD

## Using Other Email Providers

If you're using a different email provider, adjust the EMAIL_HOST, EMAIL_PORT, and EMAIL_SECURE values accordingly.

## Testing

After setting up the environment variables, test your contact form to ensure emails are being sent properly.

## Troubleshooting

If emails are not being sent:

1. Check your email provider's settings to ensure that less secure apps are allowed
2. Verify that your credentials are correct
3. Check the server logs for any error messages
4. Make sure your email provider allows SMTP connections 