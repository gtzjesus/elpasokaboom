// app/api/exit-preview/route.ts

import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/exit-preview
 *
 * API Route to **exit Sanity's Draft Mode (Preview Mode)**.
 *
 * When a user accesses preview content (e.g. unpublished content in Sanity),
 * draft mode is enabled to show the latest edits. This route disables that mode,
 * clears preview cookies, and redirects the user back to the homepage or origin.
 *
 * Usage:
 * - This is typically linked to a "Exit Preview" button or UI element.
 * - Triggers when users want to leave draft/preview mode.
 *
 * Behavior:
 * - Calls `draftMode().disable()` to clear preview session.
 * - Redirects to the homepage (`'/'`) using the current request's base URL.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @returns {NextResponse} A redirect response to the homepage.
 */
export async function GET(request: NextRequest) {
  await (await draftMode()).disable();

  return NextResponse.redirect(new URL('/', request.url));
}
