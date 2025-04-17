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
  try {
    const {
      id,
      amount_total,
      currency,
      metadata,
      payment_intent,
      customer,
      total_details,
    } = session;

    const { orderNumber, customerName, customerEmail, clerkUserId } =
      metadata as Metadata;

    const lineItems = await stripe.checkout.sessions.listLineItems(id, {
      expand: ['data.price.product'],
    });

    const sanityProducts = lineItems.data.map((item) => {
      const stripeProduct = item.price?.product as Stripe.Product;
      const sanityId = stripeProduct?.metadata?.id;

      if (!sanityId) {
        console.error('🚨 Missing Sanity ID in Stripe product metadata:', {
          stripeProductName: stripeProduct?.name,
          stripeProductId: stripeProduct?.id,
          metadata: stripeProduct?.metadata,
        });
        throw new Error('Missing Sanity product ID in Stripe metadata');
      }

      return {
        _key: crypto.randomUUID(),
        product: {
          _type: 'reference',
          _ref: sanityId,
        },
        quantity: item.quantity || 0,
      };
    });

    const sanityPayload = {
      _type: 'order',
      orderNumber,
      stripeCheckoutSessionId: id,
      stripePaymentIntentId: payment_intent,
      customerName,
      stripeCustomerId: customer,
      clerkUserId,
      email: customerEmail,
      currency,
      amountDiscount: (total_details?.amount_discount || 0) / 100,
      products: sanityProducts,
      totalPrice: (amount_total || 0) / 100,
      status: 'paid',
      orderDate: new Date().toISOString(),
    };

    console.log(
      '🧾 Payload being sent to Sanity:\n',
      JSON.stringify(sanityPayload, null, 2)
    );

    const order = await backendClient.create(sanityPayload);

    return order;
  } catch (err) {
    console.error('💥 Real Sanity error:', err);
    throw err;
  }
}
