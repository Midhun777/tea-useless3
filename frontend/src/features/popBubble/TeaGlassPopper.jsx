import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { sounds } from "./SoundEffects";

/**
 * TeaGlassPopper Component
 * A peaceful, non-game interactive tea glass.
 * Renders a cutting chai glass with warm tea liquid, rising steam, and poppable surface bubbles.
 * No timers, no scores, no game over screens. Pure procrastination.
 */
export default function TeaGlassPopper() {
  const containerRef = useRef(null);
  const steam1Ref = useRef(null);
  const steam2Ref = useRef(null);
  const steam3Ref = useRef(null);

  const [poppedTotal, setPoppedTotal] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Generate initial bubble grid positioned inside tea liquid foam (cx: 140 to 260, cy: 135 to 165 in 400x440 viewBox)
  const generateInitialBubbles = () => {
    const initial = [];
    const count = 38;
    const types = [
      { type: "micro", color: "#F7EEDF", radius: 5 },
      { type: "standard", color: "#FFFBF2", radius: 8 },
      { type: "cardamom", color: "#F4B362", radius: 11 },
      { type: "large", color: "#EED9BF", radius: 14 },
    ];

    for (let i = 1; i <= count; i++) {
      // Oval distribution matching cutting glass top foam meniscus
      const angle = Math.random() * Math.PI * 2;
      const rx = 15 + Math.random() * 52;
      const ry = 6 + Math.random() * 14;

      const cx = 200 + Math.cos(angle) * rx;
      const cy = 150 + Math.sin(angle) * ry;

      const template = types[Math.floor(Math.random() * types.length)];
      initial.push({
        id: i,
        cx: Math.round(cx),
        cy: Math.round(cy),
        r: template.radius,
        color: template.color,
        type: template.type,
        popped: false,
      });
    }
    return initial;
  };

  const [bubbles, setBubbles] = useState(generateInitialBubbles);

  // Steam & Liquid Ambient Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (steam1Ref.current) {
        gsap.to(steam1Ref.current, {
          y: -24,
          x: 6,
          opacity: 0.8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (steam2Ref.current) {
        gsap.to(steam2Ref.current, {
          y: -32,
          x: -8,
          opacity: 0.85,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          delay: 0.4,
          ease: "sine.inOut",
        });
      }
      if (steam3Ref.current) {
        gsap.to(steam3Ref.current, {
          y: -20,
          x: 8,
          opacity: 0.65,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          delay: 0.8,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Bubble Pop
  const popBubble = useCallback(
    (id, cx, cy, type, e) => {
      if (e) e.stopPropagation();

      setBubbles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
      );

      setPoppedTotal((count) => count + 1);

      // Play procedural audio pop
      if (type === "cardamom") {
        sounds.playGoldenPop();
      } else if (type === "large") {
        sounds.playPop(0.75);
      } else {
        sounds.playPop(1.1 + Math.random() * 0.3);
      }

      // Add dynamic splash ripple
      const rippleId = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id: rippleId, cx, cy }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);

      // Respawn bubble automatically on tea surface after 1.8s
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => {
            if (b.id === id) {
              const angle = Math.random() * Math.PI * 2;
              const rx = 12 + Math.random() * 55;
              const ry = 5 + Math.random() * 14;
              return {
                ...b,
                cx: Math.round(200 + Math.cos(angle) * rx),
                cy: Math.round(150 + Math.sin(angle) * ry),
                popped: false,
              };
            }
            return b;
          })
        );
      }, 1800);
    },
    []
  );

  // Refill Glass (Reset all bubbles)
  const handleRefillGlass = () => {
    sounds.playClusterPop();
    setBubbles(generateInitialBubbles());
  };

  // Pop All cascade action
  const handlePopAll = () => {
    bubbles.forEach((b, idx) => {
      if (!b.popped) {
        setTimeout(() => {
          popBubble(b.id, b.cx, b.cy, b.type);
        }, idx * 30);
      }
    });
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-4 animate-fade-in">
      {/* ── TOP HEADER & MASTHEAD ────────────────────────────────────────── */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-paper-dark border-3 border-ink p-4 sm:p-6 rounded-2xl shadow-sketch">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-ink text-ink font-technical font-bold text-xs uppercase tracking-wider">
            <span>🫧</span> Interactive Tea Glass
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            ചായ Glass Bubble Popper
          </h1>
          <p className="font-handwritten text-lg sm:text-xl text-chai font-semibold">
            Tap bubbles floating on the surface of hot cutting tea. Zero timers, zero scores.
          </p>
        </div>

        {/* Counter & Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-paper border-2 border-ink shadow-sketch-sm flex items-center gap-2">
            <span className="font-technical text-xs font-bold uppercase tracking-wider text-ink-faint">
              POPPED
            </span>
            <span className="font-display font-black text-2xl text-terracotta">
              {poppedTotal}
            </span>
          </div>

          <button
            onClick={handleRefillGlass}
            className="px-4 py-2.5 rounded-xl bg-chai text-paper font-technical text-xs font-bold uppercase tracking-wider border-2 border-ink hover:bg-saffron hover:text-ink transition-all shadow-sketch-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>REFILL GLASS ☕</span>
          </button>

          <button
            onClick={handlePopAll}
            className="px-4 py-2.5 rounded-xl bg-terracotta text-paper font-technical text-xs font-bold uppercase tracking-wider border-2 border-ink hover:bg-terracotta-dark transition-all shadow-sketch-sm cursor-pointer"
          >
            POP ALL 💥
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-xl bg-paper border-2 border-ink text-ink hover:bg-paper-dark transition-all shadow-sketch-sm cursor-pointer"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* ── CENTRAL CUTTING CHAI GLASS WITH SURFACE BUBBLES ──────────────── */}
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center py-4 px-4 bg-transparent">
        <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[1/1.1] flex items-center justify-center">
          <svg
            viewBox="0 0 400 440"
            className="w-full h-auto filter drop-shadow-md overflow-visible select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Tea Liquid Gradient */}
              <linearGradient id="glassTeaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C26D3B" />
                <stop offset="25%" stopColor="#8F431E" />
                <stop offset="70%" stopColor="#632B13" />
                <stop offset="100%" stopColor="#441C0C" />
              </linearGradient>

              {/* Surface Foam Gradient */}
              <linearGradient id="glassFoamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F7EEDF" />
                <stop offset="40%" stopColor="#FFF9F0" />
                <stop offset="80%" stopColor="#EED9BF" />
                <stop offset="100%" stopColor="#F5E4CE" />
              </linearGradient>
            </defs>

            {/* Saucer / Plate Base */}
            <ellipse cx="200" cy="385" rx="145" ry="24" fill="#FAF6EE" stroke="#1E1610" strokeWidth="3.5" />
            <ellipse cx="200" cy="384" rx="110" ry="15" fill="none" stroke="#7A685A" strokeWidth="1.8" strokeDasharray="4 3" />
            <ellipse cx="200" cy="374" rx="70" ry="10" fill="#1E1610" opacity="0.18" />

            {/* Rising Steam Wisps */}
            <g>
              <path
                ref={steam1Ref}
                d="M 185 125 C 175 95, 200 65, 180 35 C 172 20, 185 8, 178 0"
                stroke="#C85A32"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.75"
                fill="none"
              />
              <path
                ref={steam2Ref}
                d="M 210 120 C 228 85, 202 55, 222 25 C 230 12, 220 2, 225 -8"
                stroke="#E89635"
                strokeWidth="3.8"
                strokeLinecap="round"
                opacity="0.8"
                fill="none"
              />
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

            {/* Tea Liquid Fill in Glass */}
            <clipPath id="glassLiquidClip">
              <path d="M 132 152 L 152 360 C 152 368, 248 368, 248 360 L 268 152 Z" />
            </clipPath>
            <g clipPath="url(#glassLiquidClip)">
              <rect x="110" y="140" width="180" height="235" fill="url(#glassTeaGradient)" />
              <path d="M 148 200 Q 200 230 252 200 L 248 360 Q 200 370 152 360 Z" fill="#3D1B0B" opacity="0.4" />
              {/* Cutting Glass Fluted Lines */}
              <line x1="162" y1="165" x2="170" y2="350" stroke="#FAF6EE" strokeWidth="2.2" opacity="0.35" strokeDasharray="12 4" />
              <line x1="184" y1="165" x2="188" y2="355" stroke="#FAF6EE" strokeWidth="2.8" opacity="0.45" />
              <line x1="216" y1="165" x2="212" y2="355" stroke="#FAF6EE" strokeWidth="2.8" opacity="0.45" />
              <line x1="238" y1="165" x2="230" y2="350" stroke="#FAF6EE" strokeWidth="2.2" opacity="0.35" strokeDasharray="12 4" />
            </g>

            {/* Surface Foam Base Layer */}
            <g>
              <path
                d="M 129 152 C 128 135, 272 135, 271 152 C 270 168, 130 168, 129 152 Z"
                fill="url(#glassFoamGradient)"
                stroke="#1E1610"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M 136 150 C 150 144, 175 146, 195 142 C 215 138, 245 143, 264 150 C 255 158, 220 162, 200 160 C 170 162, 145 156, 136 150 Z"
                fill="#FFFBF2"
                opacity="0.9"
              />
            </g>

            {/* Pop Splash Ripples */}
            {ripples.map((r) => (
              <g key={r.id}>
                <circle
                  cx={r.cx}
                  cy={r.cy}
                  r="18"
                  stroke="#DE764E"
                  strokeWidth="2"
                  fill="none"
                  className="animate-ping"
                  opacity="0.7"
                />
              </g>
            ))}

            {/* ── SURFACE MICRO-BUBBLES (INTERACTIVE CLICK/TAP TO POP) ──── */}
            <g className="cursor-pointer">
              {bubbles.map((b) => {
                if (b.popped) {
                  return (
                    <g key={b.id}>
                      <circle
                        cx={b.cx}
                        cy={b.cy}
                        r={b.r * 1.5}
                        stroke="#C85A32"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        fill="none"
                        opacity="0.5"
                      />
                    </g>
                  );
                }

                return (
                  <g
                    key={b.id}
                    onClick={(e) => popBubble(b.id, b.cx, b.cy, b.type, e)}
                    className="group transition-transform hover:scale-135 origin-center cursor-pointer"
                    style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
                  >
                    {/* Outer bubble circle */}
                    <circle
                      cx={b.cx}
                      cy={b.cy}
                      r={b.r}
                      fill={b.color}
                      stroke="#1E1610"
                      strokeWidth="2"
                      className="transition-colors group-hover:fill-[#F5CA80]"
                    />
                    {/* Specular highlight */}
                    <circle
                      cx={b.cx - b.r * 0.32}
                      cy={b.cy - b.r * 0.32}
                      r={b.r * 0.28}
                      fill="#FFFFFF"
                    />
                  </g>
                );
              })}
            </g>

            {/* Main Outer Glass Outline */}
            <path
              d="M 126 150 C 125 140, 275 140, 274 150 L 252 360 C 250 372, 150 372, 148 360 Z"
              fill="none"
              stroke="#1E1610"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 124 148 C 124 136, 276 136, 276 148"
              fill="none"
              stroke="#1E1610"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="font-technical text-xs text-ink-faint tracking-wider uppercase text-center mt-2">
          [ Click or tap any bubble inside the tea glass to pop it ]
        </p>
      </div>
    </div>
  );
}
