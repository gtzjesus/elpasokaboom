import Stripe from 'stripe';
import { backendClient } from '@/sanity/lib/backendClient';
import { Metadata } from 'actions/createCheckoutSession';
import { syncCustomerToSanity } from '@/sanity/lib/customers/syncCustomerToSanity';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock';
import stripe from '@/lib/stripe';

/**
 * Handles a completed Stripe Checkout Session.
 * - Syncs customer to Sanity
 * - Records order in Sanity
 * - Updates product stock levels
 *
 * @param session Stripe Checkout Session object
 * @returns The created Sanity order document
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  // Ensure metadata is properly typed
  const { orderNumber, clerkUserId } = metadata as Metadata;

  // Sync or create the customer in Sanity
  const stripeCustomer = await syncCustomerToSanity(customer as string);

  // Fetch product line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(id, {
    expand: ['data.price.product'],
  });

  // Transform line items into Sanity product references
  const sanityProducts = lineItems.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  // Create the order document in Sanity
  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    clerkUserId,
    customerName: stripeCustomer.name,
    email: stripeCustomer.email,
    currency,
    amountDiscount: (total_details?.amount_discount || 0) / 100,
    products: sanityProducts,
    totalPrice: (amount_total || 0) / 100,
    status: 'paid',
    orderDate: new Date().toISOString(),
  });

  // Update stock for each product
  const items: Array<{ id: string; quantity: number }> = JSON.parse(
    session.metadata?.items || '[]'
  );

  for (const item of items) {
    await decreaseProductStock(item.id, item.quantity);
  }

  return order;
}
