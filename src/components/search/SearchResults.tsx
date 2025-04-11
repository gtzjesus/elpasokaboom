// components/search/SearchResults.tsx
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import Header from '../common/header';

const SearchResults = ({
  query,
  resultCount,
  products,
}: {
  query: string;
  resultCount: number;
  products: Product[];
}) => {
  return (
    <div className="container bg-white">
      <Header />
      <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
        &ldquo;{query}&rdquo; ({resultCount})
      </h1>
      <ProductGrid products={products} />
    </div>
  );
};

export default SearchResults;
