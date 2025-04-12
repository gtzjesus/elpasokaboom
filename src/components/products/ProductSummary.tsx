import { Product } from '@/types';
import ProductClient from './ProductClient';

/**
 * Props for the ProductSummary component.
 *
 * @param product - The product object containing product details like name and price.
 * @param isOutOfStock - A boolean flag indicating if the product is out of stock.
 */
type ProductSummaryProps = {
  product: Product;
  isOutOfStock: boolean;
};

/**
 * ProductSummary component displays a summary of the product, including its name,
 * price, and the option to add it to the cart. If the product is out of stock,
 * a blur effect is applied to indicate its unavailability.
 *
 * The component ensures a responsive design, showing the summary at the bottom
 * of the screen on smaller devices and positioning it to the side on larger screens.
 *
 * @component
 * @example
 * <ProductSummary product={product} isOutOfStock={false} />
 */
const ProductSummary = ({ product, isOutOfStock }: ProductSummaryProps) => {
  return (
    <div
      className={`w-full lg:w-50 lg:fixed h-fit bg-white p-6 lg:p-12 order-first lg:order-last fixed bottom-0 left-0 lg:bottom-0 lg:left-auto ${
        isOutOfStock ? 'filter blur-sm' : '' // Apply blur effect if the product is out of stock
      }`}
    >
      {/* Product Name and Price */}
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
  );
};

export default ProductSummary;
