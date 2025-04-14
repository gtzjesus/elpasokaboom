import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import { Product } from '@/types';

/**
 * Props for the ProductImages component.
 *
 * @param product - The product object containing the images.
 * @param isOutOfStock - A flag to indicate if the product is out of stock.
 */
type ProductImagesProps = {
  product: Product;
  isOutOfStock: boolean;
};

/**
 * ProductImages component displays the images of a product. It showcases the
 * main image and any extra images if available. Additionally, it applies a
 * visual effect (opacity reduction) if the product is out of stock.
 *
 * The images are rendered with a hover effect, and the component ensures that
 * out-of-stock products have a distinct visual cue (lower opacity).
 *
 * @component
 * @example
 * <ProductImages product={product} isOutOfStock={true} />
 */
const ProductImages = ({ product, isOutOfStock }: ProductImagesProps) => {
  return (
    <div className="flex-grow overflow-y-auto ">
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
