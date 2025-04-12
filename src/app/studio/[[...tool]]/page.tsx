/**
 * Studio Catch-All Route Handler
 *
 * This file is responsible for rendering the built-in authoring environment (Sanity Studio).
 * It uses Next.js' **catch-all route** functionality to handle any sub-routes under `/studio`.
 *
 * 📚 More on Catch-All Routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * 📚 More on Sanity + Next.js Integration:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// ⏱️ Ensure the Studio route is statically rendered at build-time (no SSR)
export const dynamic = 'force-static';

// ✅ Re-export default Studio metadata and viewport settings from next-sanity
export { metadata, viewport } from 'next-sanity/studio';

/**
 * StudioPage
 *
 * This component is responsible for rendering the full Sanity Studio application.
 * It uses the configuration exported from your `sanity.config.ts` file and leverages
 * the `NextStudio` wrapper provided by `next-sanity` to embed the Studio in-app.
 *
 * @returns {JSX.Element} Rendered Sanity Studio interface
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
