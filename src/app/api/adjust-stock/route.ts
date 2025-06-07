// src/app/api/adjust-stock/route.ts
import { NextResponse } from 'next/server';
import { decreaseProductStock } from '@/sanity/lib/products/decreaseProductStock'; // or wherever it's located

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { items } = body as {
      items: { productId: string; quantity: number }[];
    };

    // Decrease stock for each item
    for (const item of items) {
      await decreaseProductStock(item.productId, item.quantity);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API error adjusting stock:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
