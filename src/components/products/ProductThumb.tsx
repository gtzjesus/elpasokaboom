import Link from 'next/link';
import { Product } from '../../../sanity.types';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';

/**
 * ProductThumb Component
 *
 * Displays a thumbnail for a product, including the image, name, price,
 * and an optional "Out of Stock" label if the product is unavailable.
 *
 * @param {Object} props - Component properties.
 * @param {Product} props.product - The product object to display.
 *
 * @returns {JSX.Element} The rendered ProductThumb component.
 */
function ProductThumb({ product }: { product: Product }) {
  // Check if the product is out of stock
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col overflow-hidden ${isOutOfStock ? 'opacity-50' : ''}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full h-full overflow-hidden">
        {product.image && (
          <Image
            className="object-contain w-full h-full"
            src={imageUrl(product.image).url()}
            alt={product.name || 'product image'}
            fill
            sizes="(max-width: 728px) 90vw, (max-width: 1200px) 40vw, 23vw"
          />
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
            <span className="text-white font-light text-xs">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-2 text-center py-4">
        <h2 className="uppercase text-sm font-semibold text-center text-gray-800">
          {product.name}
        </h2>

        <p className="uppercase text-xs font-light text-center text-gray-800">
          ${product.price?.toFixed(0)}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
