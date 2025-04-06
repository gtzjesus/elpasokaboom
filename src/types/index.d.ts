// types/index.d.ts

// Base Sanity Document Type
interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// Sanity Image Type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string; // Added url for direct access
  };
}

// Slug Type
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// Category Type
export interface Category extends SanityDocument {
  title: string;
  slug: SanitySlug;
  description: string;
  image?: SanityImage;
}

// Product Type (for your search functionality)
export interface Product extends SanityDocument {
  name: string;
  slug: SanitySlug;
  price: number;
  stock?: number;
  image?: SanityImage;
  // Add other product fields as needed
}

// Search Suggestions Response Type
export interface SearchSuggestionsResponse {
  suggestions: Product[];
}

// Query Parameters for Sanity Client
export interface SanityQueryParams {
  [key: string]: string | number | boolean | string[];
}

// Product Search Parameters (specific to your search)
export interface ProductSearchParams extends SanityQueryParams {
  query: string;
}

// Default Suggestions Parameters
export interface DefaultSuggestionsParams extends SanityQueryParams {
  default: boolean;
}
