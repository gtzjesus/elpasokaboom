import Header from '@/components/common/header';
import ReadMore from '@/components/common/ReadMore';
import ProductClient from '@/components/products/ProductClient';
import { imageUrl } from '@/lib/imageUrl';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Force static rendering and set revalidation
export const dynamic = 'force-static';
export const revalidate = 60;

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Resolve promise

  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="">
      <Header />
      <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
        {product.name}
      </h1>
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ">
          <div className="flex flex-col space-y-0">
            {/* Loop through the extraImages and display them */}
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

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between fixed bottom-0 left-0 right-0 bg-white px-4 py-2">
            <div className="flex flex-col justify-center items-center gap-1 ">
              <h1 className="uppercase text-lg font-semibold text-center text-gray-800">
                {product.name}
              </h1>
              <h1 className="uppercase text-md font-light text-center text-gray-800">
                ${product.price?.toFixed(0)}
              </h1>
              <ReadMore description={product.description} />
            </div>
            <ProductClient product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
