import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { evaluateChaiQuality } from "./ChaiEvaluator";

/**
 * AnimeBrewingAnimation Component
 * Anime.js powered step-by-step visual brewing sequence:
 * - Tea leaves falling into cup
 * - Milk pouring stream
 * - Liquid color blend transition
 * - Stirring wobble
 * - Foam bubbles popping into existence with elastic easing
 * - Steam rising
 */
export default function AnimeBrewingAnimation({ recipe, onComplete }) {
  const containerRef = useRef(null);
  const liquidRef = useRef(null);
  const milkStreamRef = useRef(null);
  const bubblesRef = useRef(null);

  const evaluation = evaluateChaiQuality(recipe);

  const {
    tea = 2,
    milk = 120,
    ginger = false,
    cardamom = false,
    foam = { type: "medium", density: 50 },
    boil = 50,
  } = recipe;

  // Calculate target liquid color
  const totalVol = Math.max(1, tea * 30 + milk);
  const teaRatio = (tea * 30) / totalVol;
  let targetColor = "#8C461F";
  if (teaRatio < 0.25) targetColor = "#DDBA95";
  else if (teaRatio < 0.45) targetColor = "#BA7A48";
  else if (teaRatio > 0.7) targetColor = "#50200C";

  useEffect(() => {
    if (!containerRef.current) return;

    // Timeline using Anime.js
    const tl = anime.timeline({
      easing: "easeOutExpo",
    });

    // 1. Initial hidden state
    anime.set(".tea-leaf", { opacity: 0, translateY: -40, scale: 0.5 });
    anime.set(milkStreamRef.current, { scaleY: 0, opacity: 0 });
    anime.set(".foam-bubble-pop", { scale: 0, opacity: 0 });
    anime.set(".spice-particle", { opacity: 0, translateY: -20 });

    // 2. Step A: Tea leaves fall into cup
    tl.add({
      targets: ".tea-leaf",
      opacity: [0, 1],
      translateY: [-40, 20],
      scale: [0.5, 1],
      delay: anime.stagger(120),
      duration: 600,
      easing: "easeOutBack",
    })
    // 3. Step B: Milk stream pours down
    .add({
      targets: milkStreamRef.current,
      opacity: [0, 1],
      scaleY: [0, 1],
      duration: 500,
      easing: "easeOutQuad",
    })
    // 4. Step C: Liquid color blends to chai color
    .add({
      targets: liquidRef.current,
      fill: ["#F3EBDD", targetColor],
      duration: 1000,
      easing: "easeInOutQuad",
    }, "-=200")
    .add({
      targets: milkStreamRef.current,
      opacity: 0,
      duration: 300,
    }, "-=400")
    // 5. Step D: Spices drop if enabled
    .add({
      targets: ".spice-particle",
      opacity: [0, 1],
      translateY: [-20, 0],
      delay: anime.stagger(150),
      duration: 500,
      easing: "easeOutBounce",
    }, "-=300")
    // 6. Step E: Stirring wobble
    .add({
      targets: containerRef.current,
      rotate: [-3, 3, -2, 2, 0],
      duration: 700,
      easing: "easeInOutSine",
    })
    // 7. Step F: Foam bubbles pop on surface with elastic bounce
    .add({
      targets: ".foam-bubble-pop",
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(30),
      duration: 700,
      easing: "easeOutElastic(1, 0.5)",
    }, "-=400")
    // Complete callback
    .add({
      complete: () => {
        if (onComplete) onComplete();
      },
    });

    // Continuous steam wisp animation
    anime({
      targets: ".steam-wisp-anime",
      translateY: [0, -35],
      opacity: [0.7, 0],
      duration: 1800,
      delay: anime.stagger(300),
      loop: true,
      easing: "linear",
    });

  }, []);

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-4 py-4">
      {/* Anime.js Stage */}
      <div ref={containerRef} className="relative w-[280px] h-[240px] flex items-center justify-center">
        {/* Steam Wisps */}
        <div className="absolute top-2 left-0 right-0 h-14 pointer-events-none flex justify-center gap-4 z-20">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} width="20" height="40" viewBox="0 0 20 40" className="steam-wisp-anime">
              <path
                d="M 10 40 C 4 30, 16 20, 10 10 C 6 4, 14 0, 10 0"
                fill="none"
                stroke="#F7EEDF"
                strokeWidth="2.5"
                strokeDasharray="3 2"
              />
            </svg>
          ))}
        </div>

        <svg width="280" height="240" viewBox="0 0 280 240" fill="none" className="overflow-visible">
          {/* Saucer */}
          <ellipse cx="140" cy="205" rx="110" ry="24" fill="#FAF6EE" stroke="#1E1610" strokeWidth="3" />

          {/* Cup Handle */}
          <path d="M 200 95 C 250 95, 250 165, 190 170" fill="none" stroke="#FAF6EE" strokeWidth="16" strokeLinecap="round" />
          <path d="M 200 95 C 250 95, 250 165, 190 170" fill="none" stroke="#1E1610" strokeWidth="22" strokeLinecap="round" />

          {/* Cup Outer Body */}
          <path d="M 80 80 L 95 185 C 95 193, 185 193, 185 185 L 200 80 Z" fill="#C85A32" stroke="#1E1610" strokeWidth="3.5" />

          {/* Liquid Base */}
          <ellipse cx="140" cy="80" rx="58" ry="16" fill="#FAF6EE" stroke="#1E1610" strokeWidth="3.5" />

          {/* Dynamic Blending Chai Liquid Surface */}
          <ellipse ref={liquidRef} cx="140" cy="80" rx="54" ry="13" fill="#F3EBDD" />

          {/* Falling Tea Leaves */}
          <g>
            <ellipse className="tea-leaf" cx="130" cy="76" rx="4" ry="2" fill="#3D1B0B" />
            <ellipse className="tea-leaf" cx="145" cy="82" rx="5" ry="2.5" fill="#50200C" />
            <ellipse className="tea-leaf" cx="120" cy="84" rx="4.5" ry="2" fill="#3D1B0B" />
          </g>

          {/* Pouring Milk Stream */}
          <rect
            ref={milkStreamRef}
            x="136"
            y="0"
            width="8"
            height="80"
            fill="#FAF6EE"
            rx="4"
            style={{ transformOrigin: "top center" }}
          />

          {/* Spices */}
          {ginger && <path className="spice-particle" d="M 115 78 Q 122 75 120 82" stroke="#E89635" strokeWidth="3" strokeLinecap="round" />}
          {cardamom && <ellipse className="spice-particle" cx="155" cy="77" rx="3.5" ry="2" fill="#52A054" stroke="#1E1610" strokeWidth="1" />}

          {/* Foam Bubbles Elastic Pop Group */}
          <g ref={bubblesRef}>
            {Array.from({ length: foam.type === "small" ? 30 : foam.type === "large" ? 10 : 20 }).map((_, idx) => {
              const angle = (idx / 20) * Math.PI * 2;
              const r = 4 + (idx % 4) * 2;
              const dist = 12 + (idx % 5) * 8;
              const cx = 140 + Math.cos(angle) * dist;
              const cy = 80 + Math.sin(angle) * (dist * 0.25);
              return (
                <circle
                  key={idx}
                  className="foam-bubble-pop"
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#FAF6EE"
                  stroke="#1E1610"
                  strokeWidth="1.2"
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Tea Quality Evaluation Summary Badge */}
      <div className="w-full p-4 rounded-xl bg-paper border-2 border-ink shadow-sketch text-center flex flex-col items-center gap-1.5 animate-fade-in">
        <span
          className="font-technical text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded border text-paper"
          style={{ backgroundColor: evaluation.color, borderColor: "#1E1610" }}
        >
          RATING: {evaluation.rating} ({evaluation.score} / 100)
        </span>
        <h3 className="font-display text-2xl font-bold text-ink">{evaluation.title}</h3>
        <p className="font-handwritten text-lg text-chai leading-snug">{evaluation.description}</p>
      </div>
    </div>
  );
}
