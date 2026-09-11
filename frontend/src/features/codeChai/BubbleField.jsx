import React, { useMemo } from "react";

/**
 * BubbleField Component
 * Procedurally generates foam bubbles based on recipe foam configuration.
 * - small: radius 3-7px, dense packing
 * - medium: radius 7-13px
 * - large: radius 13-25px, lower count
 * - chaotic: randomized radii (3-25px) and spacing
 */
export default function BubbleField({ foam = { type: "medium", density: 50 }, width = 220, height = 50 }) {
  const { type = "medium", density = 50 } = foam;

  const bubbles = useMemo(() => {
    const list = [];
    const countFactor = density / 100.0;
    
    let baseCount = type === "small" ? 45 : type === "medium" ? 24 : type === "large" ? 12 : 35;
    const totalBubbles = Math.max(5, Math.round(baseCount * (0.3 + countFactor * 0.9)));

    const padding = 12;
    const effectiveW = width - padding * 2;
    const effectiveH = height - 6;

    for (let i = 0; i < totalBubbles; i++) {
      const cx = padding + Math.random() * effectiveW;
      const cy = 4 + Math.random() * effectiveH;

      let r = 6;
      if (type === "small") {
        r = 3 + Math.random() * 4;
      } else if (type === "medium") {
        r = 7 + Math.random() * 6;
      } else if (type === "large") {
        r = 13 + Math.random() * 10;
      } else {
        // chaotic
        r = 3 + Math.random() * 20;
      }

      list.push({
        cx: Math.round(cx),
        cy: Math.round(cy),
        r: Math.round(r * 10) / 10,
        opacity: +(0.65 + Math.random() * 0.3).toFixed(2),
      });
    }
    return list;
  }, [type, density, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    >
      {bubbles.map((b, idx) => (
        <g key={idx} className="animate-pulse" style={{ animationDuration: `${(2 + (idx % 3) * 0.5).toFixed(1)}s` }}>
          <circle
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill="#FAF6EE"
            fillOpacity={b.opacity * 0.85}
            stroke="#1E1610"
            strokeWidth="1.2"
          />
          {/* Bubble reflection highlight */}
          <circle
            cx={b.cx - b.r * 0.3}
            cy={b.cy - b.r * 0.3}
            r={Math.max(1, b.r * 0.35)}
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </g>
      ))}
    </svg>
  );
}
