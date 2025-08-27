# 🔐 Authentication Setup Guide

Your CMS now includes **secure authentication** to protect your admin routes. Only authorized users can access and edit your content.

## 🚀 Quick Setup

Add these environment variables to your `.env.local` file:

```bash
# Sanity CMS (existing - keep these)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here

# Authentication (NEW - add these)
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=nihar@niharjreddy.com
ADMIN_PASSWORD=your_secure_password

# Email (existing - keep these)
RESEND_API_KEY=your_resend_key
```

## 🔑 Setting Up Your Credentials

### 1. Generate a Secret Key
```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Use online generator
# Visit: https://generate-secret.vercel.app/32
```

### 2. Set Your Admin Credentials
Replace these with your preferred login details:
- **ADMIN_EMAIL**: Your email address for logging in
- **ADMIN_PASSWORD**: A secure password (at least 12 characters)

### 3. Update Production URL
When deploying to production, change:
```bash
NEXTAUTH_URL=https://your-domain.com
```

## 🎯 How Authentication Works

1. **Protected Routes**: All `/admin/*` routes require authentication
2. **Login Page**: Visitors are redirected to `/admin/login`
3. **Session Management**: Sessions last 24 hours by default
4. **Secure Design**: Matches your website's aesthetic perfectly

## 🔐 Login Information

### Demo Credentials (Change These!)
- **Email**: nihar@niharjreddy.com
- **Password**: admin123

### Your Login Flow
1. Visit: `http://localhost:3000/admin`
2. Redirected to: `http://localhost:3000/admin/login`
3. Enter your credentials
4. Access granted to CMS

## ⚡ Testing Authentication

1. **Access Admin** (without login): http://localhost:3000/admin
   - Should redirect to login page

2. **Login Page**: http://localhost:3000/admin/login
   - Beautiful design matching your site
   - Shows demo credentials for testing

3. **After Login**: Full access to Portfolio Editor

## 🚀 Restart Required

After adding environment variables:
```bash
# Stop your development server (Ctrl+C)
npm run dev
```

## 🔒 Security Features

- ✅ **Secure Sessions**: JWT-based authentication
- ✅ **Route Protection**: Middleware protects all admin routes
- ✅ **Logout Functionality**: Easy sign out from any admin page
- ✅ **Session Expiry**: Automatic logout after 24 hours
- ✅ **Clean Redirects**: Seamless login/logout experience

## 🎨 Beautiful Login Experience

Your login page features:
- Clean, minimalist design matching your portfolio
- Mobile-responsive layout
- Professional typography
- Elegant form styling
- Demo credentials display for easy testing

## 🔧 Customization Options

### Change Session Duration
In `src/lib/auth.ts`:
```typescript
session: {
  maxAge: 24 * 60 * 60, // 24 hours (change this value)
}
```

### Add Multiple Users
Later, you can extend the authentication to use Sanity documents for user management, allowing multiple editors with different roles.

### Add OAuth Providers
NextAuth.js supports Google, GitHub, Twitter, and many other OAuth providers if you prefer social login.

---

🎉 **Your CMS is now secured!** Only authorized users can access and edit your content while maintaining the beautiful, professional design of your photography portfolio.
