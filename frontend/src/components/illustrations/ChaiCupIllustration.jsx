import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useBubbleStore from "../../store/useBubbleStore";

/**
 * Hand-drawn Indian Cutting Chai Glass / Cup
 * Features:
 * - Hand-sketched glass rim and fluted cutting lines
 * - Warm chai tea liquid with subtle surface undulation
 * - Creamy froth / foam cap with individual illustrated bubbles
 * - Animated steam wisps rising with GSAP sine waves
 * - Interactive pointer repulsion on steam
 * - Interactive clickable bubbles that pop
 */
export default function ChaiCupIllustration({ className = "", isHero = true, onBubbleClick }) {
  const containerRef = useRef(null);
  const steam1Ref = useRef(null);
  const steam2Ref = useRef(null);
  const steam3Ref = useRef(null);
  const teaSurfaceRef = useRef(null);
  const [bubbles, setBubbles] = useState([
    { id: 1, cx: 165, cy: 152, r: 7, popped: false },
    { id: 2, cx: 185, cy: 146, r: 5, popped: false },
    { id: 3, cx: 205, cy: 154, r: 9, popped: false },
    { id: 4, cx: 228, cy: 148, r: 6, popped: false },
    { id: 5, cx: 150, cy: 156, r: 4.5, popped: false },
    { id: 6, cx: 245, cy: 155, r: 8, popped: false },
    { id: 7, cx: 195, cy: 140, r: 5.5, popped: false },
    { id: 8, cx: 172, cy: 142, r: 4, popped: false },
    { id: 9, cx: 218, cy: 141, r: 6.5, popped: false },
  ]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // GSAP animation for steam wisps and gentle tea liquid breathing
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Steam 1 gentle rise & drift
      if (steam1Ref.current) {
        gsap.to(steam1Ref.current, {
          y: -28,
          x: 6,
          opacity: 0.85,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Steam 2
      if (steam2Ref.current) {
        gsap.to(steam2Ref.current, {
          y: -36,
          x: -8,
          opacity: 0.9,
          duration: 4,
          repeat: -1,
          yoyo: true,
          delay: 0.5,
          ease: "sine.inOut",
        });
      }

      // Steam 3
      if (steam3Ref.current) {
        gsap.to(steam3Ref.current, {
          y: -24,
          x: 10,
          opacity: 0.75,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          delay: 1,
          ease: "sine.inOut",
        });
      }

      // Gentle tea surface breathing
      if (teaSurfaceRef.current) {
        gsap.to(teaSurfaceRef.current, {
          scaleY: 1.04,
          transformOrigin: "center top",
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Steam reacts subtly to mouse hover over the cup
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMouseOffset({ x, y });
  };

  const popBubble = (id, e) => {
    e.stopPropagation();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    if (onBubbleClick) onBubbleClick(id);
    useBubbleStore.getState().registerBubblePop(1);

    // Respawn bubble after 2.5 seconds
    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: false } : b))
      );
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative select-none flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 400 440"
        className="w-full h-auto max-w-[420px] filter drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Chai Tea Liquid Gradient */}
          <linearGradient id="chaiTeaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C26D3B" />
            <stop offset="25%" stopColor="#8F431E" />
            <stop offset="70%" stopColor="#632B13" />
            <stop offset="100%" stopColor="#441C0C" />
          </linearGradient>

          {/* Froth & Foam Gradient */}
          <linearGradient id="foamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F7EEDF" />
            <stop offset="40%" stopColor="#FFF9F0" />
            <stop offset="80%" stopColor="#EED9BF" />
            <stop offset="100%" stopColor="#F5E4CE" />
          </linearGradient>

          {/* Glass reflection gradient */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* ── SAUCER / BASE PLATE ────────────────────────────────────────── */}
        <ellipse
          cx="200"
          cy="385"
          rx="145"
          ry="24"
          fill="#FAF6EE"
          stroke="#1E1610"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        {/* Saucer inner groove */}
        <ellipse
          cx="200"
          cy="384"
          rx="110"
          ry="15"
          fill="none"
          stroke="#7A685A"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />
        {/* Subtle shadow beneath cup */}
        <ellipse
          cx="200"
          cy="374"
          rx="70"
          ry="10"
          fill="#1E1610"
          opacity="0.18"
        />

        {/* ── STEAM PATHS (ORGANIC WOBBLY PATHS) ────────────────────────── */}
        <g
          style={{
            transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.2}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          {/* Steam Wisp 1 */}
          <path
            ref={steam1Ref}
            d="M 185 125 C 175 95, 200 65, 180 35 C 172 20, 185 8, 178 0"
            stroke="#C85A32"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* Steam Wisp 2 (Center-Right) */}
          <path
            ref={steam2Ref}
            d="M 210 120 C 228 85, 202 55, 222 25 C 230 12, 220 2, 225 -8"
            stroke="#E89635"
            strokeWidth="3.8"
            strokeLinecap="round"
            opacity="0.8"
            fill="none"
          />

          {/* Steam Wisp 3 (Left wisp) */}
          <path
            ref={steam3Ref}
            d="M 160 130 C 150 100, 168 70, 155 45 C 148 30, 158 15, 150 5"
            stroke="#7A685A"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
            strokeDasharray="6 3"
            fill="none"
          />
        </g>

        {/* ── CUP BODY / LIQUID BASE ─────────────────────────────────────── */}
        {/* Liquid clipping mask */}
        <clipPath id="cupLiquidClip">
          <path d="M 132 152 L 152 360 C 152 368, 248 368, 248 360 L 268 152 Z" />
        </clipPath>

        {/* Liquid fill with rich chai gradient */}
        <g clipPath="url(#cupLiquidClip)">
          <rect x="110" y="140" width="180" height="235" fill="url(#chaiTeaGradient)" />
          
          {/* Tea depth shadow layers */}
          <path
            d="M 148 200 Q 200 230 252 200 L 248 360 Q 200 370 152 360 Z"
            fill="#3D1B0B"
            opacity="0.4"
          />

          {/* Hand-sketched cutting flutes (characteristic of Indian cutting glasses) */}
          <line x1="162" y1="165" x2="170" y2="350" stroke="#FAF6EE" strokeWidth="2.2" opacity="0.35" strokeDasharray="12 4" />
          <line x1="184" y1="165" x2="188" y2="355" stroke="#FAF6EE" strokeWidth="2.8" opacity="0.45" />
          <line x1="216" y1="165" x2="212" y2="355" stroke="#FAF6EE" strokeWidth="2.8" opacity="0.45" />
          <line x1="238" y1="165" x2="230" y2="350" stroke="#FAF6EE" strokeWidth="2.2" opacity="0.35" strokeDasharray="12 4" />

          {/* Ambient bubbles floating inside tea */}
          <circle cx="175" cy="240" r="3.5" fill="#FAF6EE" opacity="0.45" />
          <circle cx="225" cy="280" r="4" fill="#FAF6EE" opacity="0.35" />
          <circle cx="190" cy="320" r="3" fill="#FAF6EE" opacity="0.4" />
          <circle cx="210" cy="210" r="5" fill="#FAF6EE" opacity="0.3" />
        </g>

        {/* ── FOAM LAYER (TOP MENISCUS) ──────────────────────────────────── */}
        <g ref={teaSurfaceRef}>
          {/* Foam pill / ellipse */}
          <path
            d="M 129 152 C 128 135, 272 135, 271 152 C 270 168, 130 168, 129 152 Z"
            fill="url(#foamGradient)"
            stroke="#1E1610"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Secondary organic foam froth contour */}
          <path
            d="M 136 150 C 150 144, 175 146, 195 142 C 215 138, 245 143, 264 150 C 255 158, 220 162, 200 160 C 170 162, 145 156, 136 150 Z"
            fill="#FFFBF2"
            opacity="0.9"
          />

          {/* Foam texture speckles */}
          <circle cx="152" cy="148" r="1.5" fill="#C85A32" opacity="0.6" />
          <circle cx="160" cy="154" r="1.2" fill="#8A4B29" opacity="0.7" />
          <circle cx="180" cy="145" r="1.8" fill="#5C2C16" opacity="0.6" />
          <circle cx="205" cy="146" r="1.4" fill="#8A4B29" opacity="0.7" />
          <circle cx="225" cy="152" r="1.6" fill="#C85A32" opacity="0.6" />
          <circle cx="242" cy="148" r="1.3" fill="#5C2C16" opacity="0.7" />
        </g>

        {/* ── BUBBLE SPECIMENS (CLICKABLE & POPPABLE) ────────────────────── */}
        <g className="cursor-pointer">
          {bubbles.map((b) => {
            if (b.popped) {
              return (
                <g key={b.id}>
                  {/* Popped splash ring */}
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={b.r * 1.6}
                    stroke="#C85A32"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    fill="none"
                    opacity="0.6"
                  />
                  <line x1={b.cx - 6} y1={b.cy - 6} x2={b.cx - 10} y2={b.cy - 10} stroke="#C85A32" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1={b.cx + 6} y1={b.cy - 6} x2={b.cx + 10} y2={b.cy - 10} stroke="#C85A32" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              );
            }

            return (
              <g
                key={b.id}
                onClick={(e) => popBubble(b.id, e)}
                className="group transition-transform hover:scale-125 origin-center"
                style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
              >
                {/* Bubble outer stroke */}
                <circle
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill="#FFFBF2"
                  stroke="#1E1610"
                  strokeWidth="2.2"
                  className="transition-colors group-hover:fill-[#F4B362]"
                />
                {/* Bubble specular highlight */}
                <circle
                  cx={b.cx - b.r * 0.32}
                  cy={b.cy - b.r * 0.32}
                  r={b.r * 0.28}
                  fill="#FFFFFF"
                />
                {/* Subtle depth rim */}
                <circle
                  cx={b.cx + b.r * 0.2}
                  cy={b.cy + b.r * 0.2}
                  r={b.r * 0.6}
                  fill="#C85A32"
                  opacity="0.15"
                />
              </g>
            );
          })}
        </g>

        {/* ── GLASS OUTLINE & FLUTED DETAILS ────────────────────────────── */}
        {/* Main Glass Silhouette */}
        <path
          d="M 126 150 
             C 125 140, 275 140, 274 150
             L 252 360 
             C 250 372, 150 372, 148 360 
             Z"
          fill="none"
          stroke="#1E1610"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glass Lip / Top Rim Accent */}
        <path
          d="M 124 148 C 124 136, 276 136, 276 148"
          fill="none"
          stroke="#1E1610"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Left specular reflection stripe */}
        <path
          d="M 137 165 L 153 350"
          stroke="url(#glassReflection)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Right side glass rim edge line */}
        <path
          d="M 262 165 L 244 350"
          stroke="#1E1610"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Base reinforced ring */}
        <path
          d="M 148 360 C 155 368, 245 368, 252 360"
          fill="none"
          stroke="#1E1610"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
