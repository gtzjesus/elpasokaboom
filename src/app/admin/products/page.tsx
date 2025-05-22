// src/app/admin/products/page.tsx
import React from 'react';

const ProductsPage = () => {
  // For demonstration purposes, we will mock a list of products
  const products = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ];

  return (
    <div>
      <h1>Manage Products</h1>
      <button>Add New Product</button>
      <div>
        <h2>Existing Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <span>
                {product.name} - ${product.price}
              </span>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductsPage;
