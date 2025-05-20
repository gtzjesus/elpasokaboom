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
    // Validate item prices
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error('Some items do not have a price.');
    }

    // Get or create customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Calculate subtotal (in dollars)
    const subtotal = items.reduce((total, item) => {
      return total + item.product.price! * item.quantity;
    }, 0);

    // Build base URL
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`;

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    // Create dynamic shipping options
    const shippingOptions = [];

    // Standard shipping ($5)
    const standardShipping = await stripe.shippingRates.create({
      display_name: 'Standard Shipping',
      type: 'fixed_amount',
      fixed_amount: {
        amount: 500,
        currency: 'usd',
      },
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 3 },
        maximum: { unit: 'business_day', value: 5 },
      },
      tax_behavior: 'inclusive',
    });
    shippingOptions.push({ shipping_rate: standardShipping.id });

    // Free shipping if subtotal >= $50
    if (subtotal >= 50) {
      const freeShipping = await stripe.shippingRates.create({
        display_name: 'Free Shipping',
        type: 'fixed_amount',
        fixed_amount: {
          amount: 0,
          currency: 'usd',
        },
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 5 },
          maximum: { unit: 'business_day', value: 7 },
        },
        tax_behavior: 'inclusive',
      });
      shippingOptions.push({ shipping_rate: freeShipping.id });
    }

    // Express shipping ($15)
    const expressShipping = await stripe.shippingRates.create({
      display_name: 'Express Shipping',
      type: 'fixed_amount',
      fixed_amount: {
        amount: 1500,
        currency: 'usd',
      },
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 1 },
        maximum: { unit: 'business_day', value: 2 },
      },
      tax_behavior: 'inclusive',
    });
    shippingOptions.push({ shipping_rate: expressShipping.id });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },

      customer_update: {
        shipping: 'auto',
      },

      shipping_address_collection: {
        allowed_countries: ['US'], // Add more if needed
      },
      billing_address_collection: 'required',

      shipping_options: shippingOptions,

      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || 'unnamed product',
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
            tax_code: 'txcd_99999999', // generic goods tax code
          },
        },
        quantity: item.quantity,
      })),
    });

    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
