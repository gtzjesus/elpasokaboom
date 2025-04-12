'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import { BasketItem } from '@/types';

interface BasketItemCardProps {
  /**
   * Item in the basket, includes product details and quantity.
   */
  item: BasketItem;

  /**
   * Callback when the quantity of the item is changed.
   */
  onQuantityChange: (productId: string, quantity: number) => void;

  /**
   * Callback to remove the item from the basket.
   */
  onRemove: (productId: string) => void;
}

/**
 * BasketItemCard displays a single product added to the basket,
 * allowing the user to view details, change quantity, or remove the item.
 *
 * @component
 * @example
 * <BasketItemCard
 *   item={item}
 *   onQuantityChange={handleQuantityChange}
 *   onRemove={handleRemove}
 * />
 */
const BasketItemCard: React.FC<BasketItemCardProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const router = useRouter();
  const { _id, name, price, stock, slug, image } = item.product;

  /**
   * Returns a stock status element based on product availability.
   */
  const getStockStatus = (stock?: number) =>
    stock && stock > 0 ? (
      <span className="font-semibold text-green-600">Available</span>
    ) : (
      <span className="font-semibold text-red-500">Out of stock</span>
    );

  return (
    <div className="p-4 border-b">
      {/* Product Image + Link */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/product/${slug?.current}`)}
      >
        <div className="flex justify-center items-center w-full h-[200px]">
          {image && (
            <Image
              src={imageUrl(image).url()}
              alt={name ?? 'Product Image'}
              width={200}
              height={200}
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center p-3 gap-4">
        <h2 className="uppercase text-md font-semibold text-gray-800">
          {name}
        </h2>
        <p className="text-sm font-light text-gray-800">
          ${(price! * item.quantity).toFixed(0)}
        </p>
        <p className="text-xs font-light text-gray-600 my-2">
          {getStockStatus(stock)}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex justify-center mb-4">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(_id, +e.target.value)}
          className="border py-1 text-sm rounded-md w-full max-w-[60px] bg-white text-center text-gray-800"
          disabled={stock === 0}
        >
          <option value="" disabled>
            QTY
          </option>
          {Array.from({ length: stock ?? 0 }, (_, i) => i + 1).map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* Remove Button */}
      <div className="flex justify-center">
        <button
          onClick={() => onRemove(_id)}
          className="uppercase text-xs underline font-light text-gray-800 hover:text-red-600 transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BasketItemCard;
