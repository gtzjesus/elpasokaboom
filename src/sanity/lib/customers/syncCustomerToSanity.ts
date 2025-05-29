// lib/sanity/syncCustomerToSanity.ts

import stripe from '@/lib/stripe';
import { backendClient } from '@/sanity/lib/backendClient';

/**
 * Syncs a Stripe customer to Sanity.
 * - If the customer exists in Sanity, updates their details.
 * - If not, creates a new customer document.
 *
 * @param stripeCustomerId - The ID of the Stripe customer
 * @returns The synced Sanity customer document
 */
export async function syncCustomerToSanity(stripeCustomerId: string) {
  // Fetch the customer data from Stripe
  const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);

  // Ensure we got a valid customer with an email
  if (!('email' in stripeCustomer)) {
    throw new Error('Invalid customer data from Stripe');
  }

  // Look for an existing Sanity customer with the same Stripe ID
  const existing = await backendClient.fetch(
    `*[_type == "customer" && stripeCustomerId == $id][0]`,
    { id: stripeCustomerId }
  );

  // Build customer data for Sanity
  const customerData = {
    _type: 'customer',
    stripeCustomerId,
    name: stripeCustomer.name ?? 'Unknown',
    email: stripeCustomer.email!,
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    console.log(`✏️ Updating existing customer ${existing._id} in Sanity`);

    const updated = await backendClient
      .patch(existing._id)
      .set(customerData)
      .commit();

    console.log('✅ Customer updated:', updated._id);
    return updated;
  } else {
    console.log('🆕 Creating new customer in Sanity');

    const created = await backendClient.create(customerData);

    console.log('✅ Customer created:', created._id);
    return created;
  }
}
