import React from "react";

/**
 * Hand-sketched scientific annotations, arrows, and measurement calipers
 * Specifically positioned around the central chai cup specimen.
 */
export default function LabAnnotations({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 select-none overflow-visible ${className}`}>
      {/* ── TOP-LEFT: SPECIMEN 01 ─────────────────────────────────────── */}
      <div className="annotation-item absolute top-1 left-0 sm:left-2 md:left-6 flex items-end gap-1.5 max-w-[150px]">
        <div className="flex flex-col text-left">
          <span className="font-handwritten text-xl sm:text-2xl text-chai font-bold leading-none transform -rotate-3">
            specimen 01
          </span>
          <span className="font-technical text-[8px] sm:text-[9px] tracking-wider uppercase text-ink-faint mt-0.5">
            standard tapri glass
          </span>
        </div>
        {/* Curved arrow pointing down-right toward cup rim */}
        <svg width="38" height="30" viewBox="0 0 38 30" fill="none" className="overflow-visible text-ink mb-1 flex-shrink-0">
          <path
            d="M 3 6 C 15 5, 26 13, 32 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 26 21 L 32 24 L 33 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── TOP-RIGHT: HIGHLY SUSPICIOUS FOAM ─────────────────────────── */}
      <div className="annotation-item absolute top-1 right-0 sm:right-2 md:right-6 flex items-end gap-1.5 max-w-[160px]">
        {/* Curved arrow pointing down-left toward froth */}
        <svg width="38" height="30" viewBox="0 0 38 30" fill="none" className="overflow-visible text-terracotta mb-1 flex-shrink-0">
          <path
            d="M 34 6 C 22 5, 11 13, 5 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 11 19 L 5 24 L 4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-handwritten text-xl sm:text-2xl text-terracotta font-bold leading-none transform rotate-2">
            highly suspicious!
          </span>
          <span className="font-technical text-[8px] sm:text-[9px] tracking-wider uppercase text-ink-faint mt-0.5">
            abnormal froth volume
          </span>
        </div>
      </div>

      {/* ── MID-LEFT: FOAM LAYER CALIPER ───────────────────────────────── */}
      <div className="annotation-item absolute top-[44%] left-0 sm:left-4 md:left-8 flex items-center gap-1.5">
        <div className="flex flex-col text-right">
          <span className="font-handwritten text-lg sm:text-xl text-ink font-bold leading-none transform -rotate-1">
            foam layer
          </span>
          <span className="font-technical text-[8px] sm:text-[9px] text-ink-faint">
            approx 14.2 mm
          </span>
        </div>
        {/* Horizontal pointer with caliper tick */}
        <svg width="36" height="20" viewBox="0 0 36 20" fill="none" className="text-ink flex-shrink-0">
          <line x1="2" y1="3" x2="2" y2="17" stroke="currentColor" strokeWidth="1.6" />
          <line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2" />
          <polygon points="30,7 35,10 30,13" fill="currentColor" />
        </svg>
      </div>

      {/* ── MID-RIGHT: BUBBLE REGION IDENTIFIER ────────────────────────── */}
      <div className="annotation-item absolute top-[44%] right-0 sm:right-4 md:right-8 flex items-center gap-1.5">
        <svg width="36" height="20" viewBox="0 0 36 20" fill="none" className="text-saffron-dark flex-shrink-0">
          <polygon points="5,7 0,10 5,13" fill="currentColor" />
          <line x1="5" y1="10" x2="33" y2="10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2" />
          <line x1="33" y1="3" x2="33" y2="17" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-handwritten text-lg sm:text-xl text-saffron-dark font-bold leading-none transform rotate-1">
            bubble region
          </span>
          <span className="font-technical text-[8px] sm:text-[9px] text-ink-faint">
            density: uncounted
          </span>
        </div>
      </div>
    </div>
  );
}
