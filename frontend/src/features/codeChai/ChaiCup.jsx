import React from "react";
import Steam from "./Steam";
import BubbleField from "./BubbleField";

/**
 * ChaiCup Component
 * Procedurally rendered SVG/CSS Chai Cup based on user recipe:
 * - Liquid color shifts from dark kadak amber to pale milk shade
 * - Spice particles float when ginger/cardamom are added
 * - Steam intensity scales with boil level
 * - Procedural foam bubbles scale with foam profile
 */
export default function ChaiCup({ recipe }) {
  const {
    tea = 2,
    milk = 120,
    sugar = 3,
    ginger = false,
    cardamom = false,
    foam = { type: "medium", density: 50 },
    boil = 50,
    stirred = false,
  } = recipe;

  // Calculate dynamic liquid color shade based on tea vs milk ratio
  const totalVolume = Math.max(1, tea * 30 + milk);
  const teaRatio = (tea * 30) / totalVolume; // 0.0 (all milk) to 1.0 (all tea)

  // Interpolate hex shade
  let liquidColor = "#7A3B18"; // default kadak brown
  if (teaRatio < 0.25) {
    liquidColor = "#DDBA95"; // milky pale
  } else if (teaRatio < 0.45) {
    liquidColor = "#BA7A48"; // light tea
  } else if (teaRatio < 0.65) {
    liquidColor = "#8C461F"; // classic dhaba
  } else {
    liquidColor = "#50200C"; // dark kadak strong
  }

  return (
    <div className="relative flex flex-col items-center justify-center my-4">
      {/* Procedural Animated Steam */}
      <Steam boil={boil} />

      {/* Main Cup & Plate Composition */}
      <div className="relative w-[260px] h-[220px] flex items-center justify-center">
        <svg
          width="260"
          height="220"
          viewBox="0 0 260 220"
          fill="none"
          className="overflow-visible"
        >
          {/* Saucer / Plate */}
          <ellipse
            cx="130"
            cy="190"
            rx="105"
            ry="22"
            fill="#FAF6EE"
            stroke="#1E1610"
            strokeWidth="3"
          />
          <ellipse
            cx="130"
            cy="188"
            rx="85"
            ry="14"
            fill="#F3EBDD"
            stroke="#1E1610"
            strokeWidth="1.5"
          />

          {/* Cup Handle */}
          <path
            d="M 185 85 C 235 85, 235 155, 175 160"
            fill="none"
            stroke="#FAF6EE"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 185 85 C 235 85, 235 155, 175 160"
            fill="none"
            stroke="#1E1610"
            strokeWidth="22"
            strokeLinecap="round"
            style={{ zIndex: -1 }}
          />

          {/* Cup Outer Body */}
          <path
            d="M 70 70 L 85 175 C 85 183, 175 183, 175 175 L 190 70 Z"
            fill="#C85A32"
            stroke="#1E1610"
            strokeWidth="3.5"
          />

          {/* Cup Rim Outline */}
          <ellipse
            cx="130"
            cy="70"
            rx="60"
            ry="18"
            fill="#FAF6EE"
            stroke="#1E1610"
            strokeWidth="3.5"
          />

          {/* Chai Liquid Surface */}
          <ellipse
            cx="130"
            cy="70"
            rx="56"
            ry="15"
            fill={liquidColor}
            className={stirred ? "animate-pulse" : ""}
          />

          {/* Floating Spices */}
          {ginger && (
            <g className="animate-bounce" style={{ animationDuration: "3s" }}>
              <path d="M 105 68 Q 112 65 110 72" stroke="#E89635" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {cardamom && (
            <g className="animate-bounce" style={{ animationDuration: "2.5s" }}>
              <ellipse cx="148" cy="67" rx="3.5" ry="2" fill="#52A054" stroke="#1E1610" strokeWidth="1" />
            </g>
          )}
        </svg>

        {/* Procedural Foam Bubbles Overlay on Liquid Surface */}
        <div className="absolute top-[52px] left-[74px] w-[112px] h-[30px] rounded-full overflow-hidden">
          <BubbleField foam={foam} width={112} height={30} />
        </div>
      </div>
    </div>
  );
}
