// middleware.ts

import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk middleware for protecting routes in a Next.js app.
 *
 * This middleware ensures that authenticated sessions are enforced
 * across dynamic pages and API routes while skipping static assets.
 *
 * @see https://clerk.com/docs/references/nextjs/clerk-middleware
 */
export default clerkMiddleware();

/**
 * Configuration for Next.js Middleware route matching.
 *
 * - Skips internal Next.js files (`_next`) and static file extensions.
 * - Always runs on API routes (`/api` and `/trpc`) to secure backend endpoints.
 */
export const config = {
  matcher: [
    // Exclude static assets and internal files (e.g. _next/, *.css, *.js, *.png, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always include API and tRPC routes for authentication
    '/(api|trpc)(.*)',
  ],
};
