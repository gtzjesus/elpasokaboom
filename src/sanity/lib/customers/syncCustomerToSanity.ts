// lib/sanity/syncCustomerToSanity.ts
import stripe from '@/lib/stripe';
import { backendClient } from '@/sanity/lib/backendClient';

export async function syncCustomerToSanity(stripeCustomerId: string) {
  // Retrieve the customer from Stripe by ID
  const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);

  if (!('email' in stripeCustomer)) {
    throw new Error('Invalid customer data from Stripe');
  }

  // Check if the customer already exists in Sanity
  const existing = await backendClient.fetch(
    `*[_type == "customer" && stripeCustomerId == $id][0]`,
    { id: stripeCustomerId }
  );

  // Prepare customer data to store/update in Sanity
  const customerData = {
    _type: 'customer',
    stripeCustomerId,
    name: stripeCustomer.name ?? 'Unknown',
    email: stripeCustomer.email!,
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    console.log(`✏️ Updating existing customer ${existing._id} in Sanity`);

    // Just patch using existing._id and set the new data — no need to destructure or exclude anything
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
