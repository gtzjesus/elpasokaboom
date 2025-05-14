import stripe from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Metadata } from '../../../../actions/createCheckoutSession';
import { headers } from 'next/headers';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature'); // to verify if it came from stripe

  if (!signature) {
    return NextResponse.json({ error: 'no signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json(
      { error: 'webhook secret missing' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('🚫 Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: `webhook error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log('✅ Order created in Sanity:', order);
    } catch (err) {
      console.error('💥 Error creating order in Sanity:', err);
      return NextResponse.json(
        { error: 'error creating order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, clerkUserId } = metadata as Metadata;

  // 👇 Fetch customer info directly from Stripe
  const stripeCustomer = await stripe.customers.retrieve(customer as string);

  const customerName = (stripeCustomer as Stripe.Customer).name ?? 'Unknown';

  const customerEmail = (stripeCustomer as Stripe.Customer).email ?? 'Unknown';

  // Fetch line items and map to Sanity references
  const lineItems = await stripe.checkout.sessions.listLineItems(id, {
    expand: ['data.price.product'],
  });

  const sanityProducts = lineItems.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  // Create order in Sanity
  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    clerkUserId,
    customerName,
    email: customerEmail,
    currency,
    amountDiscount: (total_details?.amount_discount || 0) / 100,
    products: sanityProducts,
    totalPrice: (amount_total || 0) / 100,
    status: 'paid',
    orderDate: new Date().toISOString(),
  });

  return order;
}
