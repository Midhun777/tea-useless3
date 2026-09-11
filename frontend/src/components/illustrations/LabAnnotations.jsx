import React from "react";

/**
 * Hand-sketched scientific annotations, arrows, and measurement calipers
 * Designed to frame the chai cup hero with deadpan laboratory seriousness.
 */
export default function LabAnnotations({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 select-none overflow-visible ${className}`}>
      {/* ── TOP LEFT: SPECIMEN 01 ─────────────────────────────────────── */}
      <div className="annotation-item absolute top-[18%] left-[4%] sm:left-[10%] md:left-[14%] flex items-start gap-2 max-w-[170px]">
        <div className="flex flex-col">
          <span className="font-handwritten text-2xl sm:text-3xl text-chai font-bold leading-tight transform -rotate-3">
            specimen 01
          </span>
          <span className="font-technical text-[10px] tracking-wider uppercase text-ink-faint">
            standard tapri glass
          </span>
        </div>
        {/* Curved arrow pointing down-right toward cup rim */}
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" className="overflow-visible mt-1 text-ink">
          <path
            d="M 5 15 C 25 10, 42 22, 50 38"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 43 36 L 50 38 L 52 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── TOP RIGHT: HIGHLY SUSPICIOUS FOAM ─────────────────────────── */}
      <div className="annotation-item absolute top-[14%] right-[4%] sm:right-[10%] md:right-[14%] flex items-start gap-2 max-w-[190px]">
        {/* Curved arrow pointing down-left toward froth */}
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" className="overflow-visible mt-1 text-terracotta">
          <path
            d="M 55 12 C 35 8, 18 20, 10 38"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 17 32 L 10 38 L 8 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col">
          <span className="font-handwritten text-2xl sm:text-3xl text-terracotta font-bold leading-tight transform rotate-2">
            highly suspicious!
          </span>
          <span className="font-technical text-[10px] tracking-wider uppercase text-ink-faint">
            abnormal froth volume
          </span>
        </div>
      </div>

      {/* ── MID LEFT: FOAM LAYER CALIPER ───────────────────────────────── */}
      <div className="annotation-item absolute top-[44%] left-[2%] sm:left-[6%] md:left-[10%] flex items-center gap-2">
        <div className="flex flex-col text-right">
          <span className="font-handwritten text-xl sm:text-2xl text-ink font-bold leading-tight transform -rotate-1">
            foam layer
          </span>
          <span className="font-technical text-[10px] text-ink-faint">
            approx 14.2 mm
          </span>
        </div>
        {/* Horizontal straight pointer with caliper tick */}
        <svg width="55" height="30" viewBox="0 0 55 30" fill="none" className="text-ink">
          <line x1="5" y1="5" x2="5" y2="25" stroke="currentColor" strokeWidth="1.8" />
          <line x1="5" y1="15" x2="48" y2="15" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
          <polygon points="48,12 54,15 48,18" fill="currentColor" />
        </svg>
      </div>

      {/* ── MID RIGHT: BUBBLE REGION IDENTIFIER ────────────────────────── */}
      <div className="annotation-item absolute top-[42%] right-[2%] sm:right-[6%] md:right-[10%] flex items-center gap-2">
        <svg width="55" height="30" viewBox="0 0 55 30" fill="none" className="text-saffron-dark">
          <polygon points="7,12 1,15 7,18" fill="currentColor" />
          <line x1="7" y1="15" x2="50" y2="15" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
          <line x1="50" y1="5" x2="50" y2="25" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <div className="flex flex-col">
          <span className="font-handwritten text-xl sm:text-2xl text-saffron-dark font-bold leading-tight transform rotate-1">
            bubble region
          </span>
          <span className="font-technical text-[10px] text-ink-faint">
            density: uncounted
          </span>
        </div>
      </div>

      {/* ── BOTTOM ANNOTATION: METRIC CERTIFICATION ────────────────────── */}
      <div className="annotation-item absolute bottom-[6%] right-[8%] sm:right-[15%] hidden md:flex items-center gap-3">
        <div className="border border-ink/40 bg-paper/90 px-3 py-1.5 rounded rotate-1 shadow-sketch-sm">
          <p className="font-technical text-[10px] uppercase tracking-widest text-ink font-semibold">
            INSTRUMENT NO. CBL-009
          </p>
          <p className="font-handwritten text-sm text-terracotta">
            zero commercial utility verified
          </p>
        </div>
      </div>
    </div>
  );
}
