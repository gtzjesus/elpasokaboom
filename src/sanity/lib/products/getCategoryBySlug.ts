// src/sanity/lib/products/getCategoryBySlug.ts
import { client } from '@/sanity/lib/client';

export async function getCategoryBySlug(slug: string) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      title,
      description,
      "slug": slug.current
    }`,
    { slug }
  );
}
