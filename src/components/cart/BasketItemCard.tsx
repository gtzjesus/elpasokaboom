'use client';

import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import { useRouter } from 'next/navigation';
import { BasketItem } from '@/types'; // You can define this in a shared types file
import React from 'react';

interface Props {
  item: BasketItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const BasketItemCard = ({ item, onQuantityChange, onRemove }: Props) => {
  const router = useRouter();
  const { _id, name, price, stock, slug, image } = item.product;

  const getStockStatus = (stock?: number) =>
    stock && stock > 0 ? (
      <span className="font-semibold">Available</span>
    ) : (
      <span className="font-semibold">Out of stock</span>
    );

  return (
    <div className="p-2 border-b">
      {/* Image + Link */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/product/${slug?.current}`)}
      >
        <div className="flex justify-center items-center w-50 h-50">
          {image && (
            <Image
              src={imageUrl(image).url()}
              alt={name ?? 'Product Image'}
              width={200}
              height={200}
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          )}
        </div>
      </div>

      {/* Name, Price, Stock */}
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

      {/* Quantity Dropdown */}
      <div className="flex justify-center mb-4">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(_id, +e.target.value)}
          className="border py-1 text-sm rounded-md w-full max-w-[50px] bg-white text-center text-gray-800"
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
          className="uppercase text-xs underline font-light text-gray-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BasketItemCard;
