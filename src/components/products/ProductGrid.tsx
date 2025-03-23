'use client';

import { Product } from '../../../sanity.types';
import { motion, AnimatePresence } from 'framer-motion';
import ProductThumb from './ProductThumb';

/**
 * ProductGrid Component
 *
 * Renders a responsive grid of product items with animations.
 *
 * @param {Object} props - Component properties.
 * @param {Product[]} props.products - Array of product objects to display.
 *
 * @returns {JSX.Element} The rendered ProductGrid component.
 */
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-screen grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y bg-white ">
      {products?.map((product) => (
        <AnimatePresence key={product._id}>
          <motion.div
            layout
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
          >
            <ProductThumb key={product._id} product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}

export default ProductGrid;
