import React from "react";

export default function GameHUD({
  popsTotal,
  timeWasted,
  customProfile,
  isMuted,
  onToggleMute,
  onRefillCup,
  onClearProfile,
}) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex flex-col justify-between h-full select-none z-10">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left Side: Bubbles Burst Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1E1610]/90 backdrop-blur-md border border-[#FF9D42]/30 px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FF9D42]">
              Bubbles Burst
            </div>
            <div className="text-3xl font-black text-[#FAF6EE] font-mono tracking-tight drop-shadow">
              {popsTotal}
            </div>
          </div>
        </div>

        {/* Center Title & Specimen Info */}
        <div className="hidden md:flex flex-col items-center">
          <div className="bg-[#1E1610]/90 backdrop-blur-md border border-[#DE764E]/30 px-4 py-1.5 rounded-full shadow-lg text-center">
            <span className="font-extrabold text-xs text-[#FF9D42] tracking-wider uppercase">
              ☕ Endless Useless ചായ Bubble Popper
            </span>
          </div>
          {customProfile && (
            <div className="text-[11px] text-[#FAF6EE]/80 mt-1 flex items-center gap-1.5 bg-black/40 px-3 py-0.5 rounded-full border border-white/10 pointer-events-auto">
              <span>Specimen: {customProfile.name || "Real OpenCV ചായ"}</span>
              <button
                onClick={onClearProfile}
                className="text-amber-300 hover:underline font-bold ml-1"
              >
                (Reset Specimen)
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Time Wasted & Controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Time Wasted Display */}
          <div className="bg-[#1E1610]/90 border border-[#FF9D42]/30 px-4 py-2 rounded-2xl text-xs font-bold text-[#FAF6EE] backdrop-blur-md flex items-center gap-2 shadow-xl">
            <span className="text-[10px] text-terracotta uppercase font-black">Time Wasted</span>
            <span className="font-mono text-base font-black text-amber-300">{timeWasted}</span>
          </div>

          {/* Refill Cup Button */}
          <button
            onClick={onRefillCup}
            className="px-3.5 py-2 bg-[#DE764E] hover:bg-[#c8623b] text-white font-extrabold rounded-2xl transition-all hover:scale-105 shadow-lg text-xs uppercase tracking-wider flex items-center gap-1"
            title="Refill cup with bubbles"
          >
            <span>Refill ☕</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2.5 bg-[#1E1610]/90 hover:bg-[#2D2118] border border-[#DE764E]/30 rounded-2xl text-[#FAF6EE] transition-all hover:scale-105 shadow-lg"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Bottom Footer Hint */}
      <div className="flex items-center justify-between w-full text-xs text-[#FAF6EE]/60">
        <div className="bg-[#1E1610]/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#DE764E]/20 text-[11px]">
          Tap or click foam bubbles to pop. Zero goals. Pure procrastination.
        </div>
      </div>
    </div>
  );
}
