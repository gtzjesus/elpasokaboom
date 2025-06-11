'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

type RevenuePoint = {
  date: string;
  revenue: number;
};

export default function RevenueBarChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="">
      <h2
        className="uppercase text-sm font-extrabold py-3 tracking-widest"
        style={{
          color: '#F1F0E1',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        daily earnings
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />
          <Bar dataKey="revenue" fill="#2E8B57" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
