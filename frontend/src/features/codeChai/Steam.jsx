import React from "react";

/**
 * Steam Component
 * Procedural animated steam lines whose height, density, and animation speed scale with boil level (0-100%).
 */
export default function Steam({ boil = 50 }) {
  const intensity = Math.max(0.1, Math.min(1.0, boil / 100.0));
  const numWisps = Math.max(2, Math.round(intensity * 6));

  return (
    <div className="absolute -top-12 left-0 right-0 h-16 pointer-events-none flex justify-center items-end gap-3 overflow-visible z-20">
      {Array.from({ length: numWisps }).map((_, i) => {
        const height = Math.round(30 + intensity * 35 + (i % 3) * 10);
        const duration = (2.2 - intensity * 1.0 + (i % 2) * 0.4).toFixed(2);
        const opacity = (0.35 + intensity * 0.45).toFixed(2);

        return (
          <svg
            key={i}
            width="24"
            height={height}
            viewBox="0 0 24 60"
            className="animate-steam-rise"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
              opacity,
            }}
          >
            <path
              d="M 12 60 C 4 45, 20 30, 12 15 C 6 5, 18 0, 12 0"
              fill="none"
              stroke="#F7EEDF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
          </svg>
        );
      })}
    </div>
  );
}
