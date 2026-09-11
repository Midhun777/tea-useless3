import React, { useState } from "react";
import { GAME_MODES } from "./GameEngine";

export default function GameMenu({ onStartGame, customProfile, onClearProfile }) {
  const [selectedMode, setSelectedMode] = useState("classic");

  const modeList = Object.values(GAME_MODES);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1E1610] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative ambient background blur gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#DE764E]/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 space-y-8 text-center">
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DE764E]/10 border border-[#DE764E]/30 text-[#DE764E] font-bold text-xs uppercase tracking-widest">
            <span>🎮 CHAI LABORATORY MINI-GAME</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1E1610] tracking-tight font-serif">
            Pop the Bubble!
          </h1>
          <p className="text-sm md:text-base text-[#1E1610]/70 max-w-xl mx-auto font-medium">
            Test your tapping speed on interactive hot chai foam. Build combos, burst golden cardamom bubbles, and earn your official Chai Performance Rank!
          </p>
        </div>

        {/* Real Specimen Chai Banner if passed from OpenCV analysis */}
        {customProfile && (
          <div className="bg-gradient-to-r from-[#2D2118] to-[#1E1610] text-[#FAF6EE] p-5 rounded-3xl border border-[#DE764E]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DE764E]/20 border border-[#DE764E]/40 flex items-center justify-center text-2xl">
                ☕
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#FF9D42]">
                    REAL SPECIMEN CONNECTED
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#FAF6EE]/80 mt-0.5">
                  Loaded specimen analysis containing{" "}
                  <strong className="text-[#FF9D42]">
                    {customProfile.summary?.total || 0} bubbles
                  </strong>{" "}
                  ({customProfile.summary?.counts?.small || 0} small,{" "}
                  {customProfile.summary?.counts?.medium || 0} medium,{" "}
                  {customProfile.summary?.counts?.large || 0} large).
                </p>
              </div>
            </div>

            <button
              onClick={onClearProfile}
              className="text-xs text-[#FAF6EE]/60 hover:text-[#FAF6EE] underline px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
            >
              Use Standard Chai
            </button>
          </div>
        )}

        {/* Mode Selector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {modeList.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`cursor-pointer rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-[#1E1610] text-[#FAF6EE] border-[#DE764E] shadow-xl scale-[1.02]"
                    : "bg-white/80 hover:bg-white text-[#1E1610] border-[#1E1610]/10 hover:border-[#DE764E]/40 shadow-sm"
                }`}
              >
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#DE764E] text-white flex items-center justify-center text-xs font-bold shadow">
                    ✓
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-3xl">{mode.icon}</div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug">
                      {mode.title}
                    </h3>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#DE764E] mt-1">
                      {mode.duration > 0 ? `${mode.duration} Seconds` : "Infinite Time"}
                    </div>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-[#FAF6EE]/80" : "text-[#1E1610]/65"
                    }`}
                  >
                    {mode.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartGame(selectedMode)}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#DE764E] to-[#FF9D42] hover:from-[#c8623b] hover:to-[#e58a33] text-white font-black text-lg rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 tracking-wide uppercase"
          >
            <span>START BREWING ☕</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
