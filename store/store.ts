// store/store.ts

import { Product, BasketItem } from '@/types'; // ✅ Centralized types
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Zustand store state and actions for managing the shopping basket.
 */
interface BasketState {
  items: BasketItem[];

  /** Adds a product to the basket, or increments quantity if it already exists */
  addItem: (product: Product) => void;

  /** Removes one unit of a product, or removes the item if quantity becomes zero */
  removeItem: (productId: string) => void;

  /** Sets a product's quantity explicitly (min. 1) */
  updateItemQuantity: (productId: string, quantity: number) => void;

  /** Empties the entire basket */
  clearBasket: () => void;

  /** Calculates the total cost of all items */
  getTotalPrice: () => number;

  /** Returns quantity of a specific item by productId */
  getItemCount: (productId: string) => number;

  /** Returns all items in the basket */
  getGroupedItems: () => BasketItem[];
}

/**
 * Zustand store hook for the shopping basket.
 * Includes localStorage persistence via Zustand middleware.
 */
const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
              // Skip if quantity is 1 (removes item)
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as BasketItem[]),
        })),

      updateItemQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearBasket: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,
    }),
    {
      name: 'basket-store', // 🧠 Key used in localStorage
    }
  )
);

export default useBasketStore;
