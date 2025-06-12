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
  interval: 'daily' | 'weekly' | 'monthly';
}) {
  const formatLabel = (label: string) => {
    if (interval === 'monthly') {
      const [year, month] = label.split('-');
      return `${new Date(+year, +month - 1).toLocaleString('default', { month: 'short' })}`;
    }
    if (interval === 'weekly') {
      return `Week of ${label.slice(5)}`; // e.g., "Week of 06-03"
    }
    return label.slice(5); // daily – show MM-DD
  };

  return (
    <div className="w-full">
      <h2
        className="uppercase text-sm font-extrabold py-3 tracking-widest"
        style={{
          color: '#F1F0E1',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        {interval} earnings
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatLabel}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={45}
          />
          <YAxis tick={false} axisLine={false} tickLine={false} width={0} />
          <Bar dataKey="revenue" fill="#2E8B57" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="revenue"
              position="top"
              content={({ value, x, y, width }) => {
                const revenue =
                  typeof value === 'number' ? Math.round(value) : 0;

                const xPos = typeof x === 'number' ? x : parseFloat(x || '0');
                const yPos = typeof y === 'number' ? y : parseFloat(y || '0');
                const w =
                  typeof width === 'number' ? width : parseFloat(width || '0');

                return (
                  <text
                    x={xPos + w / 2}
                    y={yPos - 5}
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ${revenue}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
