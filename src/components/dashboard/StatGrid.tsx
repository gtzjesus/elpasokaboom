'use client';

import Link from 'next/link';

interface StatBlock {
  title: string;
  value: string | number;
  href: string;
  color: string;
  loading?: boolean;
}

export default function StatGrid({ data }: { data: StatBlock[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
      {data.map(({ title, value, href, color, loading }) => (
        <Link key={title} href={href}>
          <div
            className="px-4 py-8 text-black cursor-pointer"
            style={{ backgroundColor: color }}
          >
            <div className="uppercase text-xs font-light text-gray-800">
              {title}
            </div>
            <div className="uppercase text-6xl font-light text-gray-800 pt-10">
              {loading ? '—' : value}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
