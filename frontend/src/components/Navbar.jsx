import React from "react";
import useBubbleStore from "../store/useBubbleStore";

/**
 * Navbar Component
 * Global top navigation bar allowing seamless switching between:
 * - Analyze Chai (OpenCV foam detector)
 * - Code a Chai (ChaiScript terminal compiler)
 */
export default function Navbar() {
  const { route, setRoute } = useBubbleStore();

  return (
    <header className="w-full bg-paper/95 backdrop-blur border-b-2 border-ink/20 sticky top-0 z-40 px-4 py-3 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Title */}
        <div
          onClick={() => setRoute("detector")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <span className="w-3 h-3 rounded-full bg-terracotta border border-ink group-hover:scale-110 transition-transform" />
          <span className="font-technical font-bold text-sm sm:text-base tracking-widest uppercase text-ink group-hover:text-terracotta transition-colors">
            CHAI BUBBLE LAB
          </span>
          <span className="hidden md:inline font-handwritten text-base text-ink-faint border-l border-ink/20 pl-2.5">
            Dept. of Unnecessary Fluid Dynamics
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 font-technical text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setRoute("detector")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg border-2 transition-all ${
              route === "detector"
                ? "bg-ink text-paper border-ink shadow-sketch-sm"
                : "bg-paper text-ink border-ink/30 hover:border-ink hover:bg-paper-dark"
            }`}
          >
            Analyze Chai
          </button>

          <button
            onClick={() => setRoute("code-a-chai")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg border-2 flex items-center gap-1.5 transition-all ${
              route === "code-a-chai"
                ? "bg-chai text-paper border-ink shadow-sketch-sm"
                : "bg-paper text-ink border-ink/30 hover:border-ink hover:bg-paper-dark"
            }`}
          >
            <span>Code a Chai</span>
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
          </button>
        </nav>
      </div>
    </header>
  );
}
