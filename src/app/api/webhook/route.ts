import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

import stripe from '@/lib/stripe';
import { handleCheckoutSessionCompleted } from '@/lib/stripe/handleCheckoutSession';

/**
 * Stripe webhook handler route
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('🚫 Missing Stripe signature or webhook secret');
    return NextResponse.json(
      { error: 'Unauthorized webhook call' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  // ✅ Verify Stripe signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ✅ Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Check if session.customer is null
    if (!session.customer) {
      console.error('❌ Stripe Checkout session has no associated customer');
      return NextResponse.json(
        { error: 'No associated customer found' },
        { status: 400 }
      );
    }

    try {
      const order = await handleCheckoutSessionCompleted(session);
      console.log('✅ Order synced to Sanity:', order);
    } catch (err) {
      console.error('🔥 Error creating order in Sanity:', err);
      return NextResponse.json(
        { error: 'Order processing failed' },
        { status: 500 }
      );
    }
  }

  // ✅ Return success response to Stripe
  return NextResponse.json({ received: true }, { status: 200 });
}
