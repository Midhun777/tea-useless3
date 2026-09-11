import React from "react";
import useBubbleStore from "../../store/useBubbleStore";
import ChaiCup from "./ChaiCup";
import IllustratedButton from "../../components/illustrations/IllustratedButton";

/**
 * ResultScreen Component
 * Final compiled chai result dossier with procedural cup visualization,
 * metrics summary, and options to modify recipe or compare with real OpenCV chai detection.
 */
export default function ResultScreen() {
  const { chaiRecipe, setCodeChaiPhase, resetRecipe, setRoute, setStage } = useBubbleStore();

  const { tea = 2, milk = 120, sugar = 3, foam = { type: "medium", density: 50 }, boil = 50 } = chaiRecipe;

  const totalVol = Math.max(1, tea * 30 + milk);
  const teaStrength = Math.round(Math.min(100, (tea * 30 / totalVol) * 160));

  const handleCompareWithRealChai = () => {
    // Navigate to detector stage tray with dream chai target set
    setRoute("detector");
    setStage("tray");
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in">
      {/* Editorial Result Banner */}
      <div
        className="w-full p-6 sm:p-8 rounded-2xl bg-paper border-3 border-ink shadow-sketch text-center relative overflow-hidden"
        style={{
          borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
        }}
      >
        <span className="font-technical text-xs font-bold uppercase tracking-widest text-terracotta block mb-1">
          BUILD SUCCESSFUL ✓
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink">
          YOUR DREAM CHAI
        </h2>
        <p className="font-handwritten text-xl text-chai font-semibold mt-1">
          Procedurally compiled from your ChaiScript specification.
        </p>

        {/* Procedural Cup Visual */}
        <ChaiCup recipe={chaiRecipe} />

        {/* Recipe Metric Summary Table */}
        <div className="w-full max-w-md mx-auto my-4 p-4 rounded-xl bg-paper-dark border-2 border-ink shadow-sketch-sm font-technical text-xs flex flex-col gap-2">
          <div className="flex justify-between border-b border-ink/15 pb-1">
            <span className="text-ink-faint uppercase font-bold">Foam Density</span>
            <span className="font-bold text-ink">{foam.density}%</span>
          </div>
          <div className="flex justify-between border-b border-ink/15 pb-1">
            <span className="text-ink-faint uppercase font-bold">Bubble Profile</span>
            <span className="font-bold text-terracotta uppercase">{foam.type}</span>
          </div>
          <div className="flex justify-between border-b border-ink/15 pb-1">
            <span className="text-ink-faint uppercase font-bold">Tea Strength</span>
            <span className="font-bold text-chai">{teaStrength}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-faint uppercase font-bold">Boil Intensity</span>
            <span className="font-bold text-saffron-dark">{boil}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <IllustratedButton
            id="btn-compare-real"
            onClick={handleCompareWithRealChai}
            size="md"
          >
            COMPARE WITH REAL CHAI
          </IllustratedButton>

          <button
            onClick={() => setCodeChaiPhase("TERMINAL")}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-ink bg-paper hover:bg-paper-warm font-technical text-xs font-bold uppercase tracking-wider transition-all shadow-sketch-sm"
          >
            Modify Recipe
          </button>

          <button
            onClick={() => {
              resetRecipe();
              setCodeChaiPhase("TERMINAL");
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-ink/40 bg-paper hover:bg-paper-dark font-technical text-xs font-bold uppercase tracking-wider transition-all"
          >
            Brew Again
          </button>
        </div>
      </div>
    </div>
  );
}
