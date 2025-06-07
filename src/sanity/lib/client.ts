// sanity/lib/client.ts
import { createClient } from 'next-sanity';

// Ensure these are set up in your .env.local
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || '2023-09-01'; // Use a default version if not set

// console.log('Sanity Client Configuration', {
//   projectId,
//   dataset,
//   apiVersion,
// }); // Log the values

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl:
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}/studio` // Use your custom domain for production
        : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },
});
