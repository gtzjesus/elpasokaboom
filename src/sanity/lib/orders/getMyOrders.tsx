import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error('user ID is required');
  }

  // define the query to get orders based on user'sID
  const MY_ORDERS_QUERY = defineQuery(`
    *[_type == 'order' && clerkUserId == $userId] | order(orderDate desc) {
        ...,
        products[]{
            ...,
            product->
        }
    }
  `);

  try {
    // use sanity to send the query
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });

    // return list of orders, or empty array if none found
    return orders.data || [];
  } catch (error) {
    console.error('error fetching orders', error);
    throw new Error('error fetching orders');
  }
}
