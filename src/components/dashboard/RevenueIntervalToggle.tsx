'use client';
import { RefObject } from 'react';
type Interval = 'daily' | 'weekly' | 'monthly';

interface RevenueIntervalToggleProps {
  onChangeAction: (interval: Interval) => void;
  active: Interval;
  scrollToRef?: RefObject<HTMLElement>;
}

export default function RevenueIntervalToggle({
  onChangeAction,
  active,
  scrollToRef,
}: RevenueIntervalToggleProps) {
  const intervals: Interval[] = ['daily', 'weekly', 'monthly'];

  const handleClick = (interval: Interval) => {
    onChangeAction(interval);
    if (scrollToRef?.current) {
      scrollToRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-2 mt-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white">
        Revenue
      </h2>
      <div className="space-x-2">
        {intervals.map((interval) => (
          <button
            key={interval}
            type="button"
            onClick={() => handleClick(interval)}
            className={`px-2 py-1 uppercase text-xs font-semibold text-center ${
              active === interval
                ? 'bg-green-700 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {interval}
          </button>
        ))}
      </div>
    </div>
  );
}
