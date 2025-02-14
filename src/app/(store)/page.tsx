import { getAllProducts } from '@/sanity/lib/products/getAllProducts';
import ProductsView from '@/components/ProductsView';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import BlackFridayBanner from '@/components/BlackFridayBanner';

export const dynamic = 'force-static';
export const revalidate = 60;

async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  return (
    <div>
      <BlackFridayBanner />
      <div className="flex flex-col items-center justify-top min-h-screen bg-pearl">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

export default Home;
