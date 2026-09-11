import React from "react";

/**
 * Hand-drawn laboratory stamps, registration marks, and technical markings.
 */
export function StampUnnecessary({ className = "" }) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center border-2 border-dashed border-terracotta text-terracotta px-3 py-1 font-technical text-xs uppercase tracking-widest font-bold rotate-[-4deg] opacity-90 select-none ${className}`}
      style={{
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
      }}
    >
      <span>CERTIFIED UNNECESSARY</span>
      <span className="text-[9px] tracking-normal font-handwritten -mt-0.5 opacity-80">
        Dept. of Absurd Inquiry
      </span>
    </div>
  );
}

export function StampScientific({ className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 border-2 border-ink text-ink bg-paper-dark px-2.5 py-0.5 font-technical text-[11px] uppercase tracking-wider font-bold rotate-[2deg] shadow-sketch-sm select-none ${className}`}
      style={{
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
      }}
    >
      <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
      <span>Extremely Scientific</span>
    </div>
  );
}

export function CornerRegistrationMarks({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 text-ink-faint/60 ${className}`}>
      {/* Top Left */}
      <svg className="absolute top-2 left-2 w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M 2 12 L 2 2 L 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      </svg>
      {/* Top Right */}
      <svg className="absolute top-2 right-2 w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M 22 12 L 22 2 L 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="2" r="1.5" fill="currentColor" />
      </svg>
      {/* Bottom Left */}
      <svg className="absolute bottom-2 left-2 w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M 2 12 L 2 22 L 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="2" cy="22" r="1.5" fill="currentColor" />
      </svg>
      {/* Bottom Right */}
      <svg className="absolute bottom-2 right-2 w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M 22 12 L 22 22 L 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

export function CrosshairScanner({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={`w-16 h-16 pointer-events-none ${className}`} fill="none">
      <circle cx="50" cy="50" r="44" stroke="#C85A32" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="50" cy="50" r="28" stroke="#1E1610" strokeWidth="1" />
      <circle cx="50" cy="50" r="3" fill="#E89635" />
      <line x1="50" y1="2" x2="50" y2="20" stroke="#C85A32" strokeWidth="1.5" />
      <line x1="50" y1="80" x2="50" y2="98" stroke="#C85A32" strokeWidth="1.5" />
      <line x1="2" y1="50" x2="20" y2="50" stroke="#C85A32" strokeWidth="1.5" />
      <line x1="80" y1="50" x2="98" y2="50" stroke="#C85A32" strokeWidth="1.5" />
    </svg>
  );
}
