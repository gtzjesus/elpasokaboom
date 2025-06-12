// /app/api/recent-orders/route.ts
import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

const ADMIN_EMAILS = ['gtz.jesus@outlook.com'];

export async function GET() {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!user || !email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const orders =
      (await client.fetch(`
        *[_type == "order" && status == "paid"] | order(orderDate desc)[0...5] {
          _id,
          orderNumber,
          customerName,
          orderDate,
          totalPrice
        }
      `)) || [];

    // 🛡️ Ensure it's an array
    if (!Array.isArray(orders)) {
      return NextResponse.json([], { status: 200 });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const formatted = orders.map((order: any) => ({
      id: order._id,
      orderNumber: order.orderNumber ?? '—',
      customerName: order.customerName ?? 'Unknown',
      date: order.orderDate ?? null,
      totalPrice: order.totalPrice ?? 0,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Recent orders API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
