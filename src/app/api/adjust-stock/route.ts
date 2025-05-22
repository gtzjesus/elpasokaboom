// lib/sanity/decreaseStock.ts
import { client } from '@/sanity/lib/client';
import { GroupedBasketItem } from 'actions/createCheckoutSession';

export async function decreaseProductStock(items: GroupedBasketItem[]) {
  const mutations = items.map((item) => {
    const productId = item.product._id;
    const quantityToDeduct = item.quantity;

    return {
      patch: {
        id: productId,
        dec: { stock: quantityToDeduct }, // 👈 this subtracts from the stock field
      },
    };
  });

  try {
    const result = await client
      .withConfig({ token: process.env.SANITY_API_WRITE_TOKEN }) // 👈 required for mutations
      .transaction(mutations)
      .commit();

    return result;
  } catch (error) {
    console.error('❌ Failed to decrease stock:', error);
    throw error;
  }
}
