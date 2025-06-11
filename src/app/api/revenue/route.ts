import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { currentUser } from '@clerk/nextjs/server';

const ADMIN_EMAILS = ['gtz.jesus@outlook.com'];

export async function GET() {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!user || !email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch revenue per day from paid orders
    const result = await client.fetch(`
      *[_type == "order" && status == "paid"] {
        orderDate,
        totalPrice
      }
    `);

    // Group by day and sum revenue
    const revenueMap: Record<string, number> = {};

    result.forEach((order: { orderDate: string; totalPrice: number }) => {
      const date = new Date(order.orderDate).toISOString().split('T')[0]; // e.g. '2025-06-10'
      if (!revenueMap[date]) revenueMap[date] = 0;
      revenueMap[date] += order.totalPrice || 0;
    });

    // Convert map to array sorted by date ascending
    const data = Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(data);
  } catch (err) {
    console.error('Revenue API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
