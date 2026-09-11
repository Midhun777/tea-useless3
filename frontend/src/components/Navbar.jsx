import React from "react";
import useBubbleStore from "../store/useBubbleStore";

/**
 * Clean & Minimal Navbar Component
 */
export default function Navbar() {
  const { route, setRoute, setStage } = useBubbleStore();

  const navToDetector = () => {
    setRoute("detector");
    setStage("hero");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="w-full bg-paper/90 backdrop-blur border-b border-ink/15 sticky top-0 z-40 px-4 py-2.5 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Simple Brand Title */}
        <button
          onClick={navToDetector}
          className="flex items-center gap-2 font-technical font-bold text-sm sm:text-base tracking-wider uppercase text-ink hover:text-terracotta transition-colors shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
          <span>കുമിള</span>
        </button>

        {/* Navigation Pills with Micro Descriptions */}
        <nav className="flex items-center gap-1 bg-ink/5 p-1 rounded-xl border border-ink/10 font-technical text-xs font-bold tracking-wider">
          <button
            onClick={navToDetector}
            className={`px-3 py-1 rounded-lg flex flex-col items-center transition-all ${route === "detector"
                ? "bg-ink text-paper shadow-sm"
                : "text-ink/70 hover:text-ink hover:bg-ink/5"
              }`}
          >
            <span className="uppercase text-[11px]">Detector</span>
            <span className="text-[9px] font-normal opacity-70 leading-none pb-0.5">Foam Scanner</span>
          </button>

          <button
            onClick={() => {
              setRoute("code-a-chai");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1 rounded-lg flex flex-col items-center transition-all ${route === "code-a-chai"
                ? "bg-ink text-paper shadow-sm"
                : "text-ink/70 hover:text-ink hover:bg-ink/5"
              }`}
          >
            <span className="uppercase text-[11px]">Code Terminal</span>
            <span className="text-[9px] font-normal opacity-70 leading-none pb-0.5">ChaiScript CLI</span>
          </button>

          <button
            onClick={() => {
              setRoute("pop-the-bubble");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1 rounded-lg flex flex-col items-center transition-all ${route === "pop-the-bubble"
                ? "bg-ink text-paper shadow-sm"
                : "text-ink/70 hover:text-ink hover:bg-ink/5"
              }`}
          >
            <span className="uppercase text-[11px]">Bubble Popper</span>
            <span className="text-[9px] font-normal opacity-70 leading-none pb-0.5">Arcade Game</span>
          </button>
        </nav>
      </div>
    </header>
  );
}




