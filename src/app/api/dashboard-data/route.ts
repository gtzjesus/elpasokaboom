import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalOrders = await client.fetch(
      `count(*[_type == "order" && status == "paid"])`
    );

    const activeProducts = await client.fetch(`count(*[_type == "product"])`);

    const totalRevenue = await client.fetch(
      `count(*[_type == "order" && status == "paid"].totalPrice)`
    );

    return NextResponse.json({
      totalOrders,
      activeProducts,
      totalRevenue,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data.', err },
      { status: 500 }
    );
  }
}
