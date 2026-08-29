// FloraFarm — Circular Health / Confidence Gauge
import React from 'react';

interface HealthScoreProps {
  value: number;        // 0–100
  size?: number;        // px
  label?: string;
  sublabel?: string;
  color?: string;
}

const HealthScore: React.FC<HealthScoreProps> = ({
  value,
  size = 120,
  label,
  sublabel,
  color = '#39FF88',
}) => {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#D1FAE5"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-flora-forest leading-none">
            {value.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-flora-forest/60">%</span>
        </div>
      </div>

      {label && (
        <div className="text-center">
          <p className="text-sm font-semibold text-flora-forest">{label}</p>
          {sublabel && <p className="text-xs text-flora-text/60">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};

export default HealthScore;
