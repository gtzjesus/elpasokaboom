import { client } from '@/sanity/lib/client'; // ✅ Sanity client import
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalOrders = await client.fetch(
      `count(*[_type == "order" && status == "paid"])`
    );
    const activeProducts = await client.fetch(`count(*[_type == "product"])`);

    return NextResponse.json({
      totalOrders,
      activeProducts,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data.', err },
      { status: 500 }
    );
  }
}
