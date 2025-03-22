import { Category, Product } from '../../../sanity.types';
import ProductGrid from './ProductGrid';
// import { CategorySelector } from './ui/category-selector';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

/**
 * ProductsView Component
 *
 * Displays a list of products within a responsive layout.
 *
 * @param {Object} props - Component properties.
 * @param {Product[]} props.products - Array of product objects to display.
 * @param {Category[]} props.categories - Array of category objects for filtering products.
 *
 * @returns {JSX.Element} The rendered ProductsView component.
 */
const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <div>
      <ProductGrid products={products} />
      {/* <hr className="w-1/2 sm:w-3/4" /> */}
    </div>
  );
};

export default ProductsView;
