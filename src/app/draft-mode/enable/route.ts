// app/api/preview/route.ts

// This file is an API route used to allow Sanity Studio to enable Draft Mode.
// It allows visual editing and live-preview of unpublished content directly in your frontend.

import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { client } from '@/sanity/lib/client';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * GET /api/preview
 *
 * This route is triggered when Sanity Studio enables **Live Preview Mode**.
 * It securely validates the request via a secret, enables Next.js draft mode,
 * and redirects the user to the appropriate page (e.g. the page being edited).
 *
 * Security:
 * - Uses `@sanity/preview-url-secret` to validate the request using a shared secret.
 * - Requires a `SANITY_API_READ_TOKEN` environment variable for validation.
 *
 * Behavior:
 * - If the secret is invalid, responds with 401 Unauthorized.
 * - If valid, enables Draft Mode and redirects to the desired preview URL.
 *
 * Environment Variable Required:
 * - `SANITY_API_READ_TOKEN`: A read token from your Sanity project.
 *
 * @param {Request} request - The incoming request (with preview URL and secret).
 * @returns {Response | Redirect} Redirects to preview page or returns error response.
 */
export async function GET(request: Request) {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    client.withConfig({ token }),
    request.url
  );

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  // Enable Next.js Draft Mode (Preview Mode)
  (await draftMode()).enable();

  // Redirect user to the desired preview page
  redirect(redirectTo);
}
