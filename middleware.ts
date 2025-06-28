// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes here
// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/about',
//   '/auth/:path*',   // ✅ Properly matches /auth/sign-in, /auth/callback, etc.
//   '/blog/:path*',
//   '/api/:path*',// e.g., blog posts
// ]);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)',"/"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
})

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
 