import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

type Order = {
  totalPrice?: number;
};

const ADMIN_EMAILS = ['gtz.jesus@outlook.com'];

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: User is not signed in.' },
        { status: 401 }
      );
    }

    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: 'Forbidden: User does not have admin access.' },
        { status: 403 }
      );
    }

    const [totalOrders, activeProducts, paidOrders, activeCustomers] =
      await Promise.all([
        client.fetch<number>(`count(*[_type == "order" && status == "paid"])`),
        client.fetch<number>(`count(*[_type == "product"])`),
        client.fetch<Order[]>(
          `*[_type == "order" && status == "paid"]{ totalPrice }`
        ),
        client.fetch<number>(`count(*[_type == "customer"])`), // 💡 All customers
        // To only count customers *with orders*, use the GROQ in comment below
      ]);

    // Optional: Filter for only customers that are referenced by at least 1 order
    // const activeCustomers = await client.fetch<number>(`
    //   count(*[_type == "customer" && count(*[_type == "order" && references(^._id)]) > 0])
    // `);

    const totalRevenue = paidOrders.reduce((acc: number, order: Order) => {
      return acc + (order.totalPrice ?? 0);
    }, 0);

    return NextResponse.json({
      totalOrders,
      activeProducts,
      totalRevenue,
      activeCustomers,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Dashboard API error:', err);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data.', message: err.message },
        { status: 500 }
      );
    }

    console.error('Unknown error in dashboard API:', err);
    return NextResponse.json(
      { error: 'Unknown error occurred in dashboard API.' },
      { status: 500 }
    );
  }
}
