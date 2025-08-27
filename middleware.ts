import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    // This will run after authentication check passes
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If trying to access admin routes, require authentication
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Allow access to login page without authentication
          if (req.nextUrl.pathname === '/admin/login') {
            return true
          }
          // For all other admin routes, require valid token
          if (!token) {
            // Redirect to login page if no token
            return false
          }
          return true
        }
        // Allow access to all non-admin routes
        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
