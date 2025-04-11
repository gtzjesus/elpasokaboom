import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import { Product } from '@/types';

type ProductImagesProps = {
  product: Product;
  isOutOfStock: boolean;
};

const ProductImages = ({ product, isOutOfStock }: ProductImagesProps) => {
  return (
    <div className="flex-grow overflow-y-auto pb-40 ">
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
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ProductImages;
