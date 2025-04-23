import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { backendClient } from '@/sanity/lib/backendClient';
import stripe from '@/lib/stripe'; // Make sure your stripe instance is correctly imported
import { Metadata } from '../../../../actions/createCheckoutSession';
import { headers } from 'next/headers';

// POST method for webhook handler
export async function POST(req: NextRequest) {
  try {
    // Read the request body and signature from headers
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature provided');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Fetch webhook secret from env variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not set');
      return NextResponse.json(
        { error: 'Webhook secret missing' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook verified');
    } catch (err) {
      console.error('🚫 Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: `Webhook verification failed: ${err}` },
        { status: 400 }
      );
    }

    // Process checkout.session.completed events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Checkout session completed:', session.id);

      try {
        // Attempt to create an order in Sanity
        const order = await createOrderInSanity(session);
        console.log('✅ Order created in Sanity:', order);
      } catch (err) {
        console.error('💥 Error creating order in Sanity:', err);
        return NextResponse.json(
          { error: 'Error creating order' },
          { status: 500 }
        );
      }
    } else {
      console.warn('⚠️ Event type not handled:', event.type);
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('🚨 Error processing the webhook:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to create an order in Sanity
async function createOrderInSanity(session: Stripe.Checkout.Session) {
  try {
    // Extract relevant session data
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

    // Fetch the line items from the Stripe session
    const lineItems = await stripe.checkout.sessions.listLineItems(id, {
      expand: ['data.price.product'],
    });

    console.log(`🔢 Number of items in checkout: ${lineItems.data.length}`);

    // Map line items to Sanity products
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

    // Prepare the payload for Sanity
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

    // Log the payload for debugging
    console.log(
      '🧾 Payload being sent to Sanity:',
      JSON.stringify(sanityPayload, null, 2)
    );

    // Create the order in Sanity
    const order = await backendClient.create(sanityPayload);
    console.log('✅ Sanity order creation successful:', order);

    return order;
  } catch (err) {
    console.error('💥 Error in creating Sanity order:', err);
    throw err; // Re-throw the error to be handled by the webhook handler
  }
}
