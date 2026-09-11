import React from "react";
import useBubbleStore from "../../store/useBubbleStore";

/**
 * TerminalHeader Component
 * Window titlebar with window controls (● ● ●), title, and status indicators.
 */
export default function TerminalHeader({ onReset }) {
  const { chaiRecipe } = useBubbleStore();

  return (
    <div className="w-full bg-[#2A1D16] text-[#E5D7C5] px-4 py-2.5 flex items-center justify-between border-b border-[#3D2C22] select-none font-technical text-xs">
      {/* Window Controls */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#E05638] border border-[#1E1610] inline-block" />
        <span className="w-3 h-3 rounded-full bg-[#E5A83B] border border-[#1E1610] inline-block" />
        <span className="w-3 h-3 rounded-full bg-[#52A054] border border-[#1E1610] inline-block" />
        <span className="ml-2 font-bold tracking-widest text-ink-faint text-[10px]">
          CHAI_TERMINAL v1.0
        </span>
      </div>

      {/* Center Title */}
      <div className="hidden sm:flex items-center gap-1.5 text-paper/90 font-semibold tracking-wider">
        <span>☕</span>
        <span>ChaiScript Compiler</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {chaiRecipe.initialized && (
          <span className="text-[10px] bg-[#52A054]/20 text-[#6CE070] px-2 py-0.5 rounded border border-[#52A054]/40 font-bold uppercase">
            ENV READY
          </span>
        )}
        <button
          onClick={onReset}
          className="text-paper/70 hover:text-paper hover:underline text-[11px] font-medium"
        >
          Reset Session
        </button>
      </div>
    </div>
  );
}
