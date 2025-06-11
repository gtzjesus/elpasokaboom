'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

type RevenuePoint = {
  date: string;
  revenue: number;
};

export default function RevenueBarChart({
  data,
  interval,
}: {
  data: RevenuePoint[];
  interval: 'daily' | 'weekly';
}) {
  return (
    <div className="w-full">
      <h2
        className="uppercase text-sm font-extrabold py-3 tracking-widest"
        style={{
          color: '#F1F0E1',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        {interval === 'weekly' ? 'weekly earnings' : 'daily earnings'}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
        >
          {/* Remove grid for clean look */}
          {/* <CartesianGrid strokeDasharray="3 3" /> */}

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={45}
          />

          {/* Y Axis – hide numbers if minimal */}
          <YAxis tick={false} axisLine={false} tickLine={false} width={0} />

          {/* Optional tooltip (can remove if too cluttered) */}
          {/* <Tooltip /> */}

          <Bar dataKey="revenue" fill="#2E8B57" radius={[4, 4, 0, 0]}>
            {/* Show value always on top of bars */}
            <LabelList
              dataKey="revenue"
              position="top"
              style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
