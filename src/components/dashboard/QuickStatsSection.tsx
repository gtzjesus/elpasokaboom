'use client';

import StatGrid from './StatGrid';

type StatBlock = {
  title: string;
  value: string | number;
  href: string;
  color: string;
  loading?: boolean;
};

export default function QuickStatsSection({ data }: { data: StatBlock[] }) {
  return (
    <section>
      <h2
        className="uppercase text-sm font-extrabold pb-2 tracking-widest"
        style={{
          color: '#F1F0E1',

          textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        store metrics
      </h2>
      <StatGrid data={data} />
    </section>
  );
}
