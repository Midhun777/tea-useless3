import React from "react";

/**
 * Hand-drawn CTA button with an imperfect sketched outline,
 * drop-ink shadow, and an illustrated animated pointer arrow or hand.
 */
export default function IllustratedButton({
  children,
  onClick,
  showArrow = true,
  variant = "primary",
  size = "lg",
  className = "",
  disabled = false,
  id,
}) {
  const isPrimary = variant === "primary";

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Hand-drawn pointer arrow with micro-wiggle animation */}
      {showArrow && (
        <div className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 pointer-events-none hidden xs:flex items-center animate-bounce">
          <svg
            width="44"
            height="26"
            viewBox="0 0 44 26"
            fill="none"
            className="text-terracotta transform rotate-6"
          >
            <path
              d="M 2 13 C 12 11, 24 14, 34 13"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M 28 6 L 35 13 L 28 20"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Main button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`group relative flex items-center justify-center font-technical font-bold uppercase tracking-wider transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed ${
          size === "lg"
            ? "px-8 py-4 text-base sm:text-lg"
            : size === "sm"
            ? "px-4 py-2 text-xs"
            : "px-6 py-3 text-sm sm:text-base"
        } ${
          isPrimary
            ? "bg-saffron text-ink hover:bg-saffron-light"
            : "bg-paper text-ink hover:bg-paper-dark border-2 border-ink"
        }`}
        style={{
          border: "2.5px solid #1E1610",
          boxShadow: isPrimary ? "4px 5px 0px #1E1610" : "3px 4px 0px #1E1610",
          borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
        }}
      >
        {/* Children label */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Imperfect sketchy corner flourish */}
        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-ink opacity-30" />
      </button>

      {/* Tiny annotation under CTA */}
      {showArrow && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-handwritten text-sm text-ink-faint">
          100% scientifically redundant
        </span>
      )}
    </div>
  );
}
