import { Product } from '@/types';
import ProductClient from '../products/ProductClient';

type ProductSummaryProps = {
  product: Product;
  isOutOfStock: boolean;
};

const ProductSummary = ({ product, isOutOfStock }: ProductSummaryProps) => {
  return (
    <div
      className={`w-full lg:w-50 lg:fixed h-fit bg-white p-6 lg:p-12 order-first lg:order-last fixed bottom-0 left-0 lg:bottom-0 lg:left-auto ${
        isOutOfStock ? 'filter blur-sm' : '' // Apply blur effect if the product is out of stock
      }`}
    >
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
      <ProductClient product={product as Product} />
    </div>
  );
};

export default ProductSummary;
