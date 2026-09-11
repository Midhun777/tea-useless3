import React from "react";

export default function GameOver({
  score,
  maxCombo,
  popsTotal,
  accuracy,
  poppedByType,
  modeTitle,
  customProfile,
  onPlayAgain,
  onChangeMode,
  onAnalyzeChai,
}) {
  // Rank determination
  const getRankInfo = (s) => {
    if (s >= 6000) {
      return {
        title: "BUBBLE MENACE 👑",
        subtitle: "Supreme Chai Overlord",
        desc: "ABSOLUTE LEGEND. No bubble survives your gaze. The chai foam bows down before you.",
        badgeColor: "from-amber-400 to-yellow-600 text-black",
      };
    }
    if (s >= 3500) {
      return {
        title: "Chai Master ☕",
        subtitle: "Elite Foam Controller",
        desc: "Elite foam control! The computer vision laboratory hereby standardizes your popping technique.",
        badgeColor: "from-amber-600 to-orange-600 text-white",
      };
    }
    if (s >= 1800) {
      return {
        title: "Bubble Tactician 🎯",
        subtitle: "Cardamom Specialist",
        desc: "Impressive precision! You burst golden bubbles like a seasoned tea master on a busy morning.",
        badgeColor: "from-[#DE764E] to-amber-500 text-white",
      };
    }
    if (s >= 800) {
      return {
        title: "Foam Apprentice 🧪",
        subtitle: "Lab Technician",
        desc: "Respectable tapping! You popped enough bubbles to prevent foam spillover by 42%.",
        badgeColor: "from-blue-600 to-cyan-600 text-white",
      };
    }
    if (s >= 300) {
      return {
        title: "Warm Milk Enjoyer 🥛",
        subtitle: "Casual Sipper",
        desc: "A gentle effort. The foam is lukewarm, but your potential is simmering nicely.",
        badgeColor: "from-slate-600 to-slate-800 text-white",
      };
    }
    return {
      title: "Chai Sleeper 💤",
      subtitle: "Stove Left on Low",
      desc: "Did you leave the stove on low fire? The bubbles outpaced your reflexes completely.",
      badgeColor: "from-stone-700 to-stone-900 text-white",
    };
  };

  const rank = getRankInfo(score);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-xl w-full bg-[#1E1610] text-[#FAF6EE] rounded-3xl border border-[#DE764E]/40 p-6 md:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#DE764E]/20 rounded-full filter blur-3xl pointer-events-none" />

        {/* Title & Rank Badge */}
        <div className="space-y-3 relative z-10">
          <div className="text-xs font-black uppercase tracking-widest text-[#FF9D42]">
            GAME OVER • {modeTitle}
          </div>

          <div
            className={`inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r ${rank.badgeColor} shadow-xl font-black text-xl md:text-2xl tracking-wide uppercase`}
          >
            {rank.title}
          </div>

          <div className="text-sm font-semibold text-[#DE764E]">
            {rank.subtitle}
          </div>
        </div>

        {/* Final Score Section */}
        <div className="bg-[#2D2118] p-5 rounded-2xl border border-[#DE764E]/20 space-y-1">
          <div className="text-xs text-[#FAF6EE]/60 font-bold uppercase tracking-wider">
            Final Score
          </div>
          <div className="text-5xl font-black text-[#FF9D42] font-mono tracking-tight drop-shadow">
            {score.toLocaleString()}
          </div>
          <p className="text-xs text-[#FAF6EE]/80 pt-2 italic max-w-md mx-auto">
            "{rank.desc}"
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#2D2118]/80 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] text-[#FAF6EE]/60 font-bold uppercase">
              Max Combo
            </div>
            <div className="text-xl font-black text-[#FAF6EE] font-mono mt-0.5">
              ×{maxCombo}
            </div>
          </div>
          <div className="bg-[#2D2118]/80 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] text-[#FAF6EE]/60 font-bold uppercase">
              Bubbles Popped
            </div>
            <div className="text-xl font-black text-[#FAF6EE] font-mono mt-0.5">
              {popsTotal}
            </div>
          </div>
          <div className="bg-[#2D2118]/80 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] text-[#FAF6EE]/60 font-bold uppercase">
              Tap Accuracy
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Specimen Badge if ran with OpenCV specimen */}
        {customProfile && (
          <div className="text-xs text-[#FAF6EE]/70 bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <span>☕ Played with Specimen:</span>
            <strong className="text-[#FF9D42] font-mono">
              {customProfile.name || "Real OpenCV Chai"}
            </strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-[#DE764E] to-[#FF9D42] hover:from-[#c8623b] hover:to-[#e58a33] text-white font-black rounded-2xl shadow-lg transition-all hover:scale-105 uppercase tracking-wide text-sm"
          >
            PLAY AGAIN 🔄
          </button>
          <button
            onClick={onChangeMode}
            className="w-full sm:flex-1 py-3.5 bg-[#2D2118] hover:bg-[#3D2D22] border border-[#DE764E]/40 text-[#FAF6EE] font-extrabold rounded-2xl transition-all hover:scale-105 uppercase tracking-wide text-sm"
          >
            CHANGE MODE 🎮
          </button>
          <button
            onClick={onAnalyzeChai}
            className="w-full sm:w-auto px-5 py-3.5 bg-black/40 hover:bg-black/60 border border-white/10 text-amber-300 font-bold rounded-2xl transition-all hover:scale-105 text-xs uppercase"
          >
            ANALYZE CHAI 🔬
          </button>
        </div>
      </div>
    </div>
  );
}
