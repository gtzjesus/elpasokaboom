// Sanity Image Type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

// Category Type
export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image?: SanityImage; // Optional image field
}
