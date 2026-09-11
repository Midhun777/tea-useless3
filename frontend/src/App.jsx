import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useBubbleStore from "./store/useBubbleStore";
import ChaiHero from "./components/ChaiHero";
import SpecimenUploader from "./components/SpecimenUploader";
import AnalysisScanner from "./components/AnalysisScanner";
import BubbleResultsView from "./components/BubbleResultsView";
import "./index.css";

export default function App() {
  const { stage } = useBubbleStore();
  const mainStageRef = useRef(null);

  // Transition stage cross-fades
  useEffect(() => {
    if (mainStageRef.current) {
      gsap.fromTo(
        mainStageRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [stage]);

  return (
    <div className="min-h-screen bg-paper text-ink relative selection:bg-saffron/30 selection:text-chai">
      {/* ── AMBIENT PAPER TEXTURE & STAMPS ───────────────────────────── */}
      <div className="fixed top-2 right-3 pointer-events-none z-50 hidden md:block">
        <span className="font-technical text-[10px] uppercase tracking-widest text-ink-faint border border-ink/20 px-2 py-0.5 rounded bg-paper/80">
          DOC ID: CHAI-BUBBLE-LAB-2026
        </span>
      </div>

      <div className="fixed bottom-2 left-3 pointer-events-none z-50 hidden md:block">
        <span className="font-handwritten text-sm text-ink-faint">
          Dept. of Unnecessary Fluid Dynamics
        </span>
      </div>

      {/* ── ACTIVE SCENE RENDERER ────────────────────────────────────── */}
      <main ref={mainStageRef} className="w-full">
        {stage === "hero" && <ChaiHero />}
        {stage === "tray" && <SpecimenUploader />}
        {stage === "scanning" && <AnalysisScanner />}
        {stage === "results" && <BubbleResultsView />}
      </main>
    </div>
  );
}
