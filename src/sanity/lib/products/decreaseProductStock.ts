import { backendClient } from '@/sanity/lib/backendClient';

/**
 * Decrease product stock in Sanity after purchase.
 * Ensures stock does not drop below zero.
 *
 * @param productId - Sanity document ID for the product
 * @param quantity - Quantity to subtract from current stock
 */
export async function decreaseProductStock(
  productId: string,
  quantity: number
) {
  try {
    // Fetch current stock
    const product = await backendClient.fetch<{ stock: number }>(
      `*[_type == "product" && _id == $id][0]{stock}`,
      { id: productId }
    );

    if (!product) {
      console.warn(`⚠️ Product not found in Sanity: ${productId}`);
      return;
    }

    const currentStock = product.stock ?? 0;
    const newStock = Math.max(currentStock - quantity, 0); // Prevent negative stock

    // Update product document in Sanity
    await backendClient.patch(productId).set({ stock: newStock }).commit();

    console.log(
      `📦 Stock updated for ${productId}: ${currentStock} → ${newStock}`
    );
  } catch (err) {
    console.error(`❌ Error updating stock for ${productId}:`, err);
  }
}
