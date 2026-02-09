import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Authorized admin emails
const AUTHORIZED_EMAILS = [
  process.env.ADMIN_EMAIL || "nihar@niharjreddy.com",
  "vuday23@gmail.com",
  "niharjreddy@gmail.com",
  "anushaventrapragada93@gmail.com"
]

// Function to check if user is authorized
function validateAdminAccess(email: string): boolean {
  return AUTHORIZED_EMAILS.includes(email.toLowerCase())
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        // Validate if user is authorized to access the CMS
        const isAuthorized = validateAdminAccess(user.email)
        
        if (!isAuthorized) {
          console.log(`Unauthorized access attempt by: ${user.email}`)
          return false // This will prevent sign-in
        }
        
        return true
      }
      return false
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin" // All authorized users get admin role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Extend the session user object with additional properties
        (session.user as any).id = token.sub!
        ;(session.user as any).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
