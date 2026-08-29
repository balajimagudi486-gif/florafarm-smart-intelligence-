// FloraFarm — Confidence Bar Component
import React, { useEffect, useRef } from 'react';

interface ConfidenceBarProps {
  value: number; // 0–100
  label?: string;
  showLabel?: boolean;
  color?: 'green' | 'emerald' | 'amber';
  height?: 'sm' | 'md' | 'lg';
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value,
  label,
  showLabel = true,
  color = 'green',
  height = 'md',
}) => {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fillRef.current) {
      setTimeout(() => {
        if (fillRef.current) {
          fillRef.current.style.width = `${Math.min(100, Math.max(0, value))}%`;
        }
      }, 100);
    }
  }, [value]);

  const colorClass =
    color === 'green'
      ? 'from-flora-emerald to-flora-green'
      : color === 'amber'
      ? 'from-amber-400 to-amber-500'
      : 'from-emerald-500 to-emerald-400';

  const heightClass =
    height === 'sm' ? 'h-1.5' : height === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-flora-text/80 truncate pr-2">{label}</span>
          <span className="text-sm font-bold text-flora-forest tabular-nums">{value.toFixed(1)}%</span>
        </div>
      )}
      <div className={`${heightClass} w-full rounded-full bg-emerald-100 overflow-hidden`}>
        <div
          ref={fillRef}
          className={`${heightClass} rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: '0%' }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
