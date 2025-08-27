import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { client } from "@/lib/sanity"

// Function to check if user is a Sanity project member
async function validateSanityMembership(email: string): Promise<boolean> {
  try {
    // List of authorized emails - you can expand this or use Sanity's project members API
    const authorizedEmails = [
      process.env.ADMIN_EMAIL || "nihar@niharjreddy.com",
      "vuday23@gmail.com",
      "niharjreddy@gmail.com",
      "anushaventrapragada93@gmail.com"
    ]
    
    return authorizedEmails.includes(email.toLowerCase())
  } catch (error) {
    console.error("Error validating Sanity membership:", error)
    return false
  }
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user?.email) {
        // Validate if user is authorized to access the CMS
        const isAuthorized = await validateSanityMembership(user.email)
        
        if (!isAuthorized) {
          console.log(`Unauthorized access attempt by: ${user.email}`)
          return false // This will prevent sign-in
        }
        
        return true
      }
      return false
    },
    async jwt({ token, user, account }) {
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
