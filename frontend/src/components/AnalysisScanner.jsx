import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useBubbleStore from "../store/useBubbleStore";
import { CornerRegistrationMarks, StampScientific } from "./illustrations/SpecimenMarks";

/**
 * AnalysisScanner Component
 * Whimsical, deadpan serious loading state:
 * - Tiny animated chai cup with steam
 * - Orbiting inspection bubble
 * - Hand-sketched circular scanner line completing itself
 * - Real-time scientific telemetry ticker
 */
export default function AnalysisScanner() {
  const { scanPhase, preview } = useBubbleStore();
  const circleProgressRef = useRef(null);
  const cupRef = useRef(null);
  const scanLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotate the optical crosshair scanner
      if (circleProgressRef.current) {
        gsap.to(circleProgressRef.current, {
          rotation: 360,
          duration: 4,
          repeat: -1,
          ease: "none",
        });
      }

      // Scanner bar sweeping vertically across specimen
      if (scanLineRef.current) {
        gsap.to(scanLineRef.current, {
          top: "92%",
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Gentle cup floating
      if (cupRef.current) {
        gsap.to(cupRef.current, {
          y: -8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto">
      <div className="relative w-full rounded-2xl bg-paper-dark border-3 border-ink p-8 sm:p-12 shadow-sketch-lg lab-grid text-center flex flex-col items-center">
        <CornerRegistrationMarks />

        {/* Top badge */}
        <div className="mb-6">
          <StampScientific />
        </div>

        {/* ── CENTRAL OPTICAL SCANNER STAGE ─────────────────────────── */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4">
          {/* Circular reticle */}
          <svg
            ref={circleProgressRef}
            viewBox="0 0 160 160"
            className="absolute inset-0 w-full h-full pointer-events-none text-ink"
            fill="none"
          >
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="#E2D5C0"
              strokeWidth="4"
            />
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="#C85A32"
              strokeWidth="4"
              strokeDasharray="160 80"
              strokeLinecap="round"
            />
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="#1E1610"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </svg>

          {/* Mini Chai Cup in center */}
          <div ref={cupRef} className="relative z-10 flex flex-col items-center">
            <svg width="70" height="75" viewBox="0 0 70 75" fill="none">
              {/* Cup body */}
              <path
                d="M 18 22 L 23 60 C 23 63, 47 63, 47 60 L 52 22 Z"
                fill="#8A4B29"
                stroke="#1E1610"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Foam cap */}
              <ellipse
                cx="35"
                cy="22"
                rx="17"
                ry="6"
                fill="#FFF9F0"
                stroke="#1E1610"
                strokeWidth="2.2"
              />
              {/* Steam lines */}
              <path
                d="M 30 14 C 28 8, 33 4, 30 0"
                stroke="#C85A32"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 40 12 C 42 7, 37 3, 40 -1"
                stroke="#E89635"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Saucer */}
              <ellipse
                cx="35"
                cy="62"
                rx="28"
                ry="6"
                fill="#FAF6EE"
                stroke="#1E1610"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Orbiting specimen bubble */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-saffron border-2 border-ink shadow-sm" />
          </div>
        </div>

        {/* ── DYNAMIC SCAN TELEMETRY ──────────────────────────────────── */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-technical font-bold text-xs uppercase tracking-widest text-terracotta mb-1">
            OPTICAL SCANNER ACTIVE
          </span>
          <h2 className="font-handwritten text-3xl sm:text-4xl font-bold text-ink transition-all">
            {scanPhase}
          </h2>
          <p className="font-technical text-[11px] text-ink-faint uppercase tracking-wider mt-2">
            Examining surface tension • Isolating micro-bubbles • Computing absurdity
          </p>
        </div>
      </div>
    </section>
  );
}
