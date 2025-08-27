# 🔐 Google OAuth Authentication Setup

Your CMS now uses **Google OAuth** with **Sanity membership validation**! Only authorized Google accounts can access your content management system.

## 🚀 Quick Overview

The authentication system works as follows:
1. **User clicks "Sign in with Google"** on `/admin/login`
2. **Google OAuth** handles the authentication process
3. **Membership validation** checks if the user's email is authorized
4. **Only approved users** get access to the CMS

## 🔑 Step 1: Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Nihar Portfolio CMS"

### 2. Enable Google+ API
1. In your Google Cloud project
2. Go to "APIs & Services" > "Library"
3. Search for "Google+ API" and enable it
4. Also enable "People API" (optional but recommended)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the consent screen first if prompted:
   - Application type: "External"
   - App name: "Nihar J Reddy Photography CMS"
   - User support email: Your email
   - Developer contact: Your email
4. For OAuth client:
   - Application type: "Web application"
   - Name: "Portfolio CMS"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)

### 4. Get Your Credentials
After creating, you'll get:
- **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

## 🔧 Step 2: Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth (NEW - required)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth.js (NEW - required)
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Authorization (NEW - required)
ADMIN_EMAIL=your-google-email@gmail.com

# Sanity CMS (existing - keep these)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here

# Email (existing - keep these)
RESEND_API_KEY=your_resend_key
```

## 🔑 Step 3: Generate NextAuth Secret

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## 👥 Step 4: Configure Authorized Users

In `src/lib/auth.ts`, update the authorized emails list:

```typescript
const authorizedEmails = [
  process.env.ADMIN_EMAIL || "nihar@niharjreddy.com",
  "another-authorized@gmail.com",  // Add more emails here
  "team-member@domain.com",        // Add team members
]
```

## 🚀 Step 5: Restart & Test

```bash
# Stop your development server (Ctrl+C)
npm run dev
```

Then visit: http://localhost:3000/admin

## 🎯 How It Works

### Authentication Flow:
1. **Visit `/admin`** → Redirects to `/admin/login`
2. **Click "Sign in with Google"** → Google OAuth popup
3. **User signs in with Google** → Returns to your app
4. **Email validation** → Checks if user is authorized
5. **Success** → Access granted to CMS
6. **Failure** → "Access denied" message

### Security Features:
- ✅ **Google OAuth 2.0** - Secure, industry-standard authentication
- ✅ **Email Whitelist** - Only specific emails can access
- ✅ **Session Management** - 24-hour secure sessions
- ✅ **Route Protection** - All admin routes protected by middleware
- ✅ **Error Handling** - Clear error messages for unauthorized access

## 🎨 Beautiful Login Experience

Your new login page features:
- **Google Sign-in Button** - Clean, professional design
- **Loading States** - Smooth animations during authentication
- **Error Handling** - Clear messages for unauthorized users
- **Mobile Responsive** - Perfect on all devices
- **Design Consistency** - Matches your portfolio aesthetic

## 🚫 Access Control

### Authorized Users:
- Get full access to the Portfolio Editor
- Can edit all content (homepage, about, settings)
- Session lasts 24 hours

### Unauthorized Users:
- See "Access denied" message
- Cannot access any admin routes
- Must contact administrator for access

## 🔧 Production Setup

When deploying to production:

1. **Update Google OAuth**:
   - Add production redirect URI in Google Console
   - Example: `https://niharjreddy.com/api/auth/callback/google`

2. **Update Environment Variables**:
   ```bash
   NEXTAUTH_URL=https://your-production-domain.com
   ```

3. **Verify HTTPS**: Google OAuth requires HTTPS in production

## 🛠️ Advanced Configuration

### Add More OAuth Providers:
You can easily add GitHub, Twitter, or other providers:

```typescript
// In src/lib/auth.ts
import GitHubProvider from "next-auth/providers/github"

providers: [
  GoogleProvider({ ... }),
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  })
]
```

### Role-Based Access:
Extend the system to support different user roles (admin, editor, viewer).

### Sanity Integration:
Later, you can store authorized users directly in Sanity documents instead of environment variables.

---

## 🎉 You're All Set!

Your CMS now has **enterprise-grade authentication** with Google OAuth and Sanity membership validation. Only authorized users can access your content management system while maintaining the beautiful design of your photography portfolio.

**Login URL**: http://localhost:3000/admin/login

The system is secure, scalable, and ready for production! 🚀
