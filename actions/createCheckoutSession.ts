'use server';

import { imageUrl } from '@/lib/imageUrl';
import stripe from '@/lib/stripe';
import { BasketItem } from '@/types';

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem['product'];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error('Some items do not have a price.');
    }

    // 🔍 Try to find an existing Stripe customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    const customerExists = customers.data.length > 0;

    if (customerExists) {
      customerId = customers.data[0].id;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    // 🧾 Create the checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: { enabled: true },

      ...(customerExists
        ? {
            customer: customerId,
            customer_update: {
              name: 'auto',
              address: 'auto',
            },
          }
        : {
            customer_creation: 'always',
            customer_email: metadata.customerEmail,
            customer_update: {
              name: 'auto',
              address: 'auto',
            },
          }),

      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || 'Unnamed Product',
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
            tax_code: 'txcd_99999999',
          },
        },
        quantity: item.quantity,
      })),

      metadata: {
        ...metadata,
        items: JSON.stringify(
          items.map((item) => ({
            id: item.product._id,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return session.url;
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    throw error;
  }
}
