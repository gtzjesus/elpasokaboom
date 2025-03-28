import Header from '@/components/common/header';
import InfoDropdown from '@/components/common/InfoDropdown';
import ProductClient from '@/components/products/ProductClient';
import { imageUrl } from '@/lib/imageUrl';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Force static rendering and set revalidation interval
export const dynamic = 'force-static';
export const revalidate = 60;

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

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left section: Product images and information */}
        <div className="flex-grow overflow-y-auto pb-40 lg:pb-0">
          {/* Display extra images if available */}
          {product.extraImages?.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? 'opacity-50' : ''}`}
            >
              <Image
                src={imageUrl(image).url()}
                alt={`${product.name} extra image ${index + 1}`}
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}

          {/* Description dropdown */}
          <InfoDropdown title="Details" info={product.description ?? ''} />

          {/* Care instructions dropdown */}
          {product.care && <InfoDropdown title="Care" info={product.care} />}

          {/* Size information dropdown */}
          {product.size && <InfoDropdown title="Size" info={product.size} />}

          {/* Shipping information dropdown */}
          {product.shipping && (
            <InfoDropdown title="Shipping" info={product.shipping} />
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Right section: Product summary (price, name, and add-to-cart) */}
        <div className="w-full lg:w-90 lg:sticky h-fit bg-white p-6 border order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <div className="flex justify-center items-center gap-1">
            <h1 className="uppercase text-md font-semibold text-center text-gray-800">
              {product.name}
            </h1>
            <h1 className="uppercase text-xs font-light text-center text-gray-800">
              |
            </h1>
            <h1 className="uppercase text-md font-light text-center text-gray-800">
              ${product.price?.toFixed(0)}
            </h1>
          </div>

          {/* Product add-to-cart and other actions */}
          <ProductClient product={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
