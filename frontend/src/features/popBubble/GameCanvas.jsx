import React, { useRef, useEffect, useState, useCallback } from "react";
import { GameEngine } from "./GameEngine";
import GameHUD from "./GameHUD";
import { sounds } from "./SoundEffects";
import useBubbleStore from "../../store/useBubbleStore";

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const requestRef = useRef(null);

  const [popsTotal, setPopsTotal] = useState(0);
  const [timeWasted, setTimeWasted] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);

  const customProfile = useBubbleStore((state) => state.activeSpecimenProfile);
  const clearProfile = useBubbleStore((state) => state.clearSpecimenProfile);

  useEffect(() => {
    const engine = new GameEngine();
    engineRef.current = engine;

    const handleResize = () => {
      if (canvasRef.current && engineRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        engineRef.current.init(rect.width, rect.height, customProfile);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.stopTimer();
    };
  }, [customProfile]);

  // Main 60fps Canvas Render Loop
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engineRef.current) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Deep warm chai liquid gradient background
    const bgGradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.4,
      width * 0.1,
      width * 0.5,
      height * 0.5,
      width * 0.8
    );
    bgGradient.addColorStop(0, "#C86D40");
    bgGradient.addColorStop(0.6, "#7A3519");
    bgGradient.addColorStop(1, "#36160A");

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Ceramic cup rim border vignette
    const rimGradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.4,
      width * 0.5,
      height * 0.5,
      width * 0.55
    );
    rimGradient.addColorStop(0, "rgba(0,0,0,0)");
    rimGradient.addColorStop(1, "rgba(30,22,16,0.6)");

    ctx.fillStyle = rimGradient;
    ctx.fillRect(0, 0, width, height);

    const engine = engineRef.current;
    engine.update(1);
    engine.draw(ctx);

    setPopsTotal(engine.popsTotal);
    setTimeWasted(engine.getFormattedTimeWasted());

    requestRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [renderLoop]);

  const handlePointerDown = (e) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    engineRef.current.handlePointerDown(x, y);
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleRefillCup = () => {
    if (engineRef.current) {
      engineRef.current.refillCup();
    }
  };

  return (
    <div className="relative w-full h-[78vh] min-h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1E1610] bg-[#1E1610]">
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-pointer touch-none block"
      />

      {/* Game HUD Overlay */}
      <GameHUD
        popsTotal={popsTotal}
        timeWasted={timeWasted}
        customProfile={customProfile}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRefillCup={handleRefillCup}
        onClearProfile={clearProfile}
      />
    </div>
  );
}
