import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useBubbleStore from "./store/useBubbleStore";
import Navbar from "./components/Navbar";
import ChaiHero from "./components/ChaiHero";
import SpecimenUploader from "./components/SpecimenUploader";
import AnalysisScanner from "./components/AnalysisScanner";
import BubbleResultsView from "./components/BubbleResultsView";
import CodeAChai from "./features/codeChai/CodeAChai";
import PopTheBubble from "./features/popBubble/PopTheBubble";
import "./index.css";

export default function App() {
  const { route, stage } = useBubbleStore();
  const mainStageRef = useRef(null);

  // Transition cross-fades between routes & stages
  useEffect(() => {
    if (mainStageRef.current) {
      gsap.fromTo(
        mainStageRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [route, stage]);

  return (
    <div className="min-h-screen bg-paper text-ink relative selection:bg-saffron/30 selection:text-chai">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Ambient Footer Mark */}
      <div className="fixed bottom-2 left-3 pointer-events-none z-50 hidden md:block">
        <span className="font-handwritten text-sm text-ink-faint">
          Dept. of Unnecessary Fluid Dynamics
        </span>
      </div>

      {/* Active Route Renderer */}
      <main ref={mainStageRef} className="w-full">
        {route === "code-a-chai" ? (
          <CodeAChai />
        ) : route === "pop-the-bubble" ? (
          <PopTheBubble />
        ) : (
          <>
            {stage === "hero" && <ChaiHero />}
            {stage === "tray" && <SpecimenUploader />}
            {stage === "scanning" && <AnalysisScanner />}
            {stage === "results" && <BubbleResultsView />}
          </>
        )}
      </main>
    </div>
  );
}
