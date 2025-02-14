import Link from 'next/link';
import { Product } from '../../sanity.types';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col overflow-hidden ${isOutOfStock ? 'opacity-65' : ''}`}
    >
      <div className="relative aspect-square w-full h-full overflow-hidden">
        {product.image && (
          <Image
            className="object-contain w-full h-full"
            src={imageUrl(product.image).url()}
            alt={product.name || 'product image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">out of stock</span>
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h2 className="text-xs font-extrabold text-transform: uppercase text-gray-700 truncate">
          {product.name}
        </h2>

        <p className="mt-2 text-xs font-light text-gray-500">
          ${product.price?.toFixed(0)}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
