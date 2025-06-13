import Header from '@/components/common/header';
import InfoDropdown from '@/components/common/InfoDropdown';
// import ProductClient from '@/components/products/ProductClient';
import ProductImages from '@/components/products/ProductImages';
import ProductSummary from '@/components/products/ProductSummary';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl'; // ✅ Make sure this generates URLs from Sanity image objects
import type { Metadata } from 'next';

// Force static rendering and set revalidation interval
export const dynamic = 'force-static';
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // <--- params is a Promise now
}): Promise<Metadata> {
  // Await params before accessing slug
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | ElPasoKaBoom',
      description: 'Sorry, this product does not exist.',
    };
  }

  const fallbackDescription =
    product.description?.slice(0, 150) ||
    'High-quality fireworks available now.';

  const productImageUrl = product.image
    ? imageUrl(product.image).width(1200).height(630).url()
    : '/default-og.jpg';

  return {
    title: `${product.name} | ElPasoKaBoom`,
    description: fallbackDescription,
    openGraph: {
      title: `${product.name} | ElPasoKaBoom`,
      description: fallbackDescription,
      images: [
        {
          url: productImageUrl,
          width: 1200,
          height: 630,
          alt: product.name || 'Fireworks Product',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ElPasoKaBoom`,
      description: fallbackDescription,
      images: [productImageUrl],
    },
    alternates: {
      canonical: `https://elpasokaboom.com/products/${product.slug?.current}`,
    },
  };
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Resolve the slug from the URL parameters
  const { slug } = await params;

  // Fetch the product by slug
  const product = await getProductBySlug(slug);

  // Return a 404 page if no product is found
  if (!product) {
    return notFound();
  }

  // Determine if the product is out of stock
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header section */}
      <Header />

      {/* Product title */}
      <div className="container mx-auto max-w-3xl bg-white">
        <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
          {product.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {/* Left section: Product images and information */}
        <div className="relative flex-grow overflow-y-auto pb-40 ">
          {/* Display extra images if available */}
          <ProductImages
            product={product as Product}
            isOutOfStock={isOutOfStock}
          />

          {/* InfoDropdown Components */}
          <InfoDropdown title="Details" info={product.description ?? ''} />
          {product.care && <InfoDropdown title="Care" info={product.care} />}
          {product.size && <InfoDropdown title="Size" info={product.size} />}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="fixed  inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40">
              <span className="text-white font-mono text-sm uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Bottom section: Product summary (price, name, and add-to-cart) */}
        <ProductSummary
          product={product as Product}
          isOutOfStock={isOutOfStock}
        />

        {/* Product add-to-cart and other actions */}
        {/* <ProductClient product={product as Product} /> */}
      </div>
    </div>
  );
}

export default ProductPage;
