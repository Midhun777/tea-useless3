import React, { useEffect, useState } from "react";
import useBubbleStore from "../../store/useBubbleStore";

/**
 * BrewingSequence Component
 * Handles the compilation sequence (terminal build logs) and transition to brewing visualization.
 */
export default function BrewingSequence() {
  const { setCodeChaiPhase } = useBubbleStore();

  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: "Parsing recipe specification...", delay: 200 },
    { text: "✓ Recipe syntax valid", delay: 400, type: "success" },
    { text: "Loading tea extraction module...", delay: 600 },
    { text: "✓ Tannins & color profile locked", delay: 850, type: "success" },
    { text: "Loading dairy emulsion module...", delay: 1100 },
    { text: "✓ Milk fat balance calibrated", delay: 1350, type: "success" },
    { text: "Infusing spice matrices (Ginger / Cardamom)...", delay: 1600 },
    { text: "✓ Aromatics synchronized", delay: 1850, type: "success" },
    { text: "Initializing foam engine & bubble field...", delay: 2100 },
    { text: "✓ Kinetic aeration complete", delay: 2400, type: "success" },
  ];

  useEffect(() => {
    let timeouts = [];

    // Schedule progressive build logs
    steps.forEach((step) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, step]);
      }, step.delay);
      timeouts.push(t);
    });

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    // Complete compilation and move to brewing scene
    const doneTimeout = setTimeout(() => {
      setCodeChaiPhase("BREWING");
    }, 3200);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(doneTimeout);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-[#1E1610] border-3 border-ink shadow-sketch-lg p-6 sm:p-8 font-mono text-xs sm:text-sm text-[#F7EEDF] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3D2C22] pb-3">
        <div className="flex items-center gap-2 text-[#F5CA80] font-technical font-bold text-sm uppercase tracking-wider">
          <span className="animate-spin text-base">☕</span>
          <span>COMPILING CHAI RECIPE...</span>
        </div>
        <span className="text-[10px] text-[#A68F7A] font-technical">TARGET: DREAM_CUP</span>
      </div>

      {/* Progressive Build Logs */}
      <div className="flex flex-col gap-1.5 min-h-[220px]">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`animate-fade-in ${
              log.type === "success" ? "text-[#6CE070]" : "text-[#EFE4D2]"
            }`}
          >
            {log.text}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex justify-between text-xs font-technical text-[#F4B362]">
          <span>Heating & Aerating Chai</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#2A1D16] border border-[#3D2C22] overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E5A83B] to-[#DE764E] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
