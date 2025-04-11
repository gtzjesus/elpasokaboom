// types/index.d.ts

// 🧱 Base Sanity Document
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// 🖼️ Sanity Image
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
}

// 🔗 Sanity Slug
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// 🏷️ Category
export interface Category extends SanityDocument {
  title: string;
  slug: SanitySlug;
  description: string;
  image?: SanityImage;
}

// 🛍️ Product
export interface Product extends SanityDocument {
  name: string; // Must be required
  slug: SanitySlug;
  price: number;
  stock?: number;
  image?: SanityImage;
  description?: string;
  care?: string;
  size?: string;
  shipping?: string;
  extraImages?: SanityImage[]; // optional extra product images
}

// 🧠 Basket Item
export interface BasketItem {
  product: Product;
  quantity: number;
}

// 🔎 Search Suggestions
export interface SearchSuggestionsResponse {
  suggestions: Product[];
}

// 🔍 Query Params
export interface SanityQueryParams {
  [key: string]: string | number | boolean | string[];
}

export interface ProductSearchParams extends SanityQueryParams {
  query: string;
}

export interface DefaultSuggestionsParams extends SanityQueryParams {
  default: boolean;
}

// 💳 Stripe Checkout Metadata
export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}
