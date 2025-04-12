import Link from 'next/link';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import PropTypes from 'prop-types';
import { Product } from '@/types';

/**
 * PropTypes definition for validating the product props passed to ProductThumb component.
 */
ProductThumb.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.shape({
      current: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number,
    stock: PropTypes.number,
    image: PropTypes.object,
  }).isRequired,
};

/**
 * ProductThumb component displays a thumbnail of a product with its image, name, price,
 * and a link to the product page. It includes checks for availability and rendering of a fallback
 * when an image is unavailable.
 *
 * @param {Object} props
 * @param {Product} props.product - The product object containing the product details.
 *
 * @returns {JSX.Element | null} The rendered component or null if product data is invalid.
 */
function ProductThumb({ product }: { product: Product }) {
  // Validate required fields and ensure the product is a valid object
  if (!product || typeof product !== 'object') {
    console.error('Invalid product data:', product);
    return null;
  }

  // Safely extract product properties
  const productName = product.name || 'Unnamed Product';
  const productSlug = product.slug?.current || '';
  const productPrice = product.price || 0;
  const isOutOfStock = product.stock != null && product.stock <= 0;

  // Safely generate image URL
  let imageUrlString = '';
  try {
    imageUrlString = product.image ? imageUrl(product.image).url() : '';
  } catch (error) {
    console.error('Error generating image URL:', error);
  }

  // Don't render if crucial product data (like slug) is missing
  if (!productSlug) {
    return null;
  }

  console.log('Rendering product:', JSON.stringify(product, null, 2));

  return (
    <Link
      href={`/product/${productSlug}`}
      className={`group flex flex-col overflow-hidden ${isOutOfStock ? 'opacity-50' : ''}`}
      prefetch={false}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full h-full overflow-hidden">
        {imageUrlString ? (
          <Image
            className="object-contain w-full h-full"
            src={imageUrlString}
            alt={productName}
            fill
            sizes="(max-width: 728px) 90vw, (max-width: 1200px) 40vw, 23vw"
            priority
            onError={(e) => {
              console.error('Image load error:', e);
              // Consider adding a fallback image here
            }}
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-light text-xs">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-2 text-center py-4">
        <h2 className="uppercase text-sm font-semibold text-center text-gray-800">
          {productName}
        </h2>

        <p className="uppercase text-xs font-light text-center text-gray-800">
          ${productPrice.toFixed(0)}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
