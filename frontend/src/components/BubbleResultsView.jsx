import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import useBubbleStore from "../store/useBubbleStore";
import IllustratedButton from "./illustrations/IllustratedButton";
import { CornerRegistrationMarks, StampUnnecessary } from "./illustrations/SpecimenMarks";

/**
 * BubbleResultsView Component
 * Editorial composition with specimen photo as hero:
 * - Multi-scale OpenCV candidate visualization
 * - Hand-drawn SVG inspection rings around detected bubbles
 * - Debug mode toggle & candidate pipeline stats (Small/Medium/Large/Merged/Final)
 * - Interactive layer selector (Final, Small Cands, Medium Cands, Large Cands, Rejected)
 * - Absurd scientific verdict
 */
export default function BubbleResultsView() {
  const {
    results,
    preview,
    resetAll,
    setStage,
    debugMode,
    setDebugMode,
    activeDebugLayer,
    setActiveDebugLayer,
    playWithRealChai,
  } = useBubbleStore();

  const containerRef = useRef(null);
  const numberCounterRef = useRef(null);
  const verdictCardRef = useRef(null);
  const classificationRef = useRef(null);

  const [displayCount, setDisplayCount] = useState(0);
  const [activeBubble, setActiveBubble] = useState(null);
  const [filterSize, setFilterSize] = useState("all"); // 'all' | 'small' | 'medium' | 'large'

  const total = results?.count?.total || 0;
  const small = results?.count?.small || 0;
  const medium = results?.count?.medium || 0;
  const large = results?.count?.large || 0;
  const stats = results?.stats || null;
  const debugCandidates = results?.debugCandidates || null;

  const bubbles = results?.bubbles || [];
  const verdict = results?.verdict || {
    title: "Chaotic Chai",
    status: "Bubble density: unnecessarily impressive.",
    observation: "Spirited boiling and high surface froth dynamics observed.",
    recommendation: "Consume with Parle-G immediately.",
  };

  // Determine which list of items to draw on SVG overlay
  const displayItems = React.useMemo(() => {
    if (!debugMode || activeDebugLayer === "final") {
      return filterSize === "all"
        ? bubbles
        : bubbles.filter((b) => b.size === filterSize);
    }
    if (debugCandidates && debugCandidates[activeDebugLayer]) {
      return debugCandidates[activeDebugLayer].map((c, idx) => ({
        ...c,
        specimenId: `${activeDebugLayer.toUpperCase()}-${idx + 1}`,
        size: c.size || (c.radius <= 12 ? "small" : c.radius >= 25 ? "large" : "medium"),
      }));
    }
    return [];
  }, [debugMode, activeDebugLayer, filterSize, bubbles, debugCandidates]);

  // Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: total,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayCount(Math.round(counterObj.val));
        },
        onComplete: () => {
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#E89635", "#C85A32", "#8A4B29", "#F7EEDF"],
              disableForReducedMotion: true,
            });
          } catch (e) {}

          if (numberCounterRef.current) {
            gsap.fromTo(
              numberCounterRef.current,
              { scale: 1.15 },
              { scale: 1, duration: 0.4, ease: "bounce.out" }
            );
          }
        },
      });

      gsap.fromTo(
        ".bubble-marker",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.01,
          ease: "back.out(1.8)",
          delay: 0.3,
        }
      );

      if (classificationRef.current) {
        gsap.from(classificationRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.8,
          ease: "power2.out",
        });
      }

      if (verdictCardRef.current) {
        gsap.from(verdictCardRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.7,
          delay: 1.1,
          ease: "back.out(1.3)",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [total]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen px-4 py-8 max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* ── TOP EDITORIAL MASTHEAD ────────────────────────────────────── */}
      <div className="w-full flex flex-wrap items-center justify-between border-b-2 border-ink/20 pb-4 mb-6 gap-3">
        <button
          onClick={() => setStage("tray")}
          className="flex items-center gap-1.5 font-technical text-xs uppercase tracking-wider text-ink-faint hover:text-ink font-semibold"
        >
          <span className="text-base font-bold">←</span> Inspect Another ചായ
        </button>

        <div className="flex items-center gap-3">
          {/* Debug View Toggle */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-3 py-1 rounded border-2 text-xs font-technical font-bold uppercase transition-all shadow-sketch-sm ${
              debugMode
                ? "bg-terracotta text-paper border-ink"
                : "bg-paper text-ink border-ink/40 hover:border-ink"
            }`}
          >
            {debugMode ? "🔬 Debug View: ON" : "🔬 Enable Debug Mode"}
          </button>
        </div>
      </div>

      {/* ── MAIN EDITORIAL TWO-COLUMN LAYOUT ──────────────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT / HERO: SPECIMEN PHOTOGRAPH WITH MARKER OVERLAY (7 COLS) ─ */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <div
            className="relative w-full rounded-2xl bg-paper-dark border-3 border-ink p-3 sm:p-4 shadow-sketch-lg overflow-hidden"
            style={{
              borderRadius: "255px 25px 225px 25px/25px 225px 25px 255px",
            }}
          >
            <CornerRegistrationMarks />

            {/* Specimen Frame */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-ink bg-chai-dark/10">
              <img
                src={preview}
                alt="ചായ bubble specimen"
                className="w-full h-full object-cover select-none"
              />

              {/* SVG Scientific Inspection Grid Overlay */}
              <svg
                viewBox="0 0 800 600"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-auto"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);
                  setActiveBubble((prev) => (prev && prev.isHoverReticle ? { ...prev, x, y } : { x, y, isHoverReticle: true }));
                }}
                onMouseLeave={() => setActiveBubble(null)}
              >
                {/* 1. Scientific Coordinate Grid Lines */}
                <g stroke="#1E1610" strokeWidth="0.8" strokeOpacity="0.18">
                  {/* Vertical gridlines */}
                  {[100, 200, 300, 400, 500, 600, 700].map((vx) => (
                    <line key={`v-${vx}`} x1={vx} y1="0" x2={vx} y2="600" strokeDasharray="4 4" />
                  ))}
                  {/* Horizontal gridlines */}
                  {[100, 200, 300, 400, 500].map((hy) => (
                    <line key={`h-${hy}`} x1="0" y1={hy} x2="800" y2={hy} strokeDasharray="4 4" />
                  ))}
                </g>

                {/* 2. Grid Labels & Axis Ticks */}
                {["A", "B", "C", "D", "E", "F", "G"].map((label, idx) => (
                  <text
                    key={label}
                    x={(idx + 1) * 100 - 5}
                    y="16"
                    fontFamily="Space Grotesk, sans-serif"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1E1610"
                    fillOpacity="0.4"
                  >
                    {label}
                  </text>
                ))}
                {[1, 2, 3, 4, 5].map((num) => (
                  <text
                    key={num}
                    x="8"
                    y={num * 100 + 3}
                    fontFamily="Space Grotesk, sans-serif"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1E1610"
                    fillOpacity="0.4"
                  >
                    {num}
                  </text>
                ))}

                {/* 3. Quadrant Crosshairs */}
                {[
                  [200, 200], [400, 200], [600, 200],
                  [200, 400], [400, 400], [600, 400],
                ].map(([cx, cy], i) => (
                  <g key={`ch-${i}`} stroke="#C85A32" strokeWidth="1" strokeOpacity="0.4">
                    <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} />
                    <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} />
                    <circle cx={cx} cy={cy} r="3" fill="none" />
                  </g>
                ))}

                {/* 4. Subtle Pinpoints for Detected Bubbles (No Messy Overlapping Circles) */}
                {displayItems
                  .filter((b) => b.x >= 15 && b.x <= 785 && b.y >= 15 && b.y <= 585)
                  .map((bubble, idx) => {
                    const isFiltered = filterSize !== "all";
                    const pinColor =
                      bubble.size === "small"
                        ? "#E89635"
                        : bubble.size === "medium"
                        ? "#C85A32"
                        : "#8A4B29";

                    return (
                      <g key={bubble.specimenId || idx}>
                        {/* Micro Center Target Point */}
                        <circle
                          cx={bubble.x}
                          cy={bubble.y}
                          r={isFiltered ? 4 : 2}
                          fill={pinColor}
                          fillOpacity={isFiltered ? 0.8 : 0.6}
                          stroke="#1E1610"
                          strokeWidth="0.8"
                        />
                        {isFiltered && (
                          <circle
                            cx={bubble.x}
                            cy={bubble.y}
                            r={bubble.radius * 0.75}
                            fill="none"
                            stroke={pinColor}
                            strokeWidth="1.2"
                            strokeOpacity="0.6"
                            strokeDasharray="3 2"
                          />
                        )}
                      </g>
                    );
                  })}

                {/* 5. Dynamic Hover Crosshair Reticle */}
                {activeBubble?.isHoverReticle && (
                  <g>
                    <line
                      x1={activeBubble.x}
                      y1="0"
                      x2={activeBubble.x}
                      y2="600"
                      stroke="#DE764E"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="0"
                      y1={activeBubble.y}
                      x2="800"
                      y2={activeBubble.y}
                      stroke="#DE764E"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={activeBubble.x}
                      cy={activeBubble.y}
                      r="16"
                      fill="none"
                      stroke="#DE764E"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={activeBubble.x}
                      cy={activeBubble.y}
                      r="2"
                      fill="#DE764E"
                    />
                  </g>
                )}
              </svg>

              {/* Lab tape banner */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-paper/95 border border-ink text-[11px] font-technical font-bold uppercase tracking-widest shadow-sketch-sm rotate-[-1deg]">
                {debugMode ? `DEBUG MODE: ${activeDebugLayer.toUpperCase()}` : "ANALYZED SPECIMEN • MULTI-SCALE CV"}
              </div>

              {/* Active bubble inspector tooltip */}
              {activeBubble && (
                <div className="absolute top-2 right-2 bg-paper/95 border-2 border-ink px-3 py-1.5 rounded shadow-sketch font-technical text-xs flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-terracotta">{activeBubble.specimenId}</span>
                    <span className="text-ink capitalize">[{activeBubble.size}]</span>
                  </div>
                  <div className="text-[10px] text-ink-faint flex gap-2">
                    <span>r: {activeBubble.radius}px</span>
                    <span>conf: {Math.round((activeBubble.confidence || 0) * 100)}%</span>
                    {activeBubble.source && <span className="text-chai">src: {activeBubble.source}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Specimen legend filter tabs */}
            {!debugMode ? (
              <div className="w-full flex items-center justify-between mt-3 px-1 text-xs font-technical">
                <span className="text-ink-faint uppercase tracking-wider text-[10px]">
                  Filter by Specimen Size:
                </span>
                <div className="flex gap-2">
                  {[
                    { id: "all", label: `All (${total})` },
                    { id: "small", label: `Small (${small})` },
                    { id: "medium", label: `Med (${medium})` },
                    { id: "large", label: `Large (${large})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterSize(tab.id)}
                      className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition-all ${
                        filterSize === tab.id
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper text-ink border-ink/40 hover:border-ink"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Debug candidate layer selector tabs */
              <div className="w-full flex flex-col gap-1.5 mt-3 px-1 text-xs font-technical">
                <span className="text-terracotta font-bold uppercase tracking-wider text-[10px]">
                  Debug Layer Selector:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "final", label: `Final Validated (${bubbles.length})` },
                    { id: "small", label: `Small Candidates (${debugCandidates?.small?.length || 0})` },
                    { id: "medium", label: `Medium Candidates (${debugCandidates?.medium?.length || 0})` },
                    { id: "large", label: `Large Candidates (${debugCandidates?.large?.length || 0})` },
                    { id: "rejected", label: `Rejected (${debugCandidates?.rejected?.length || 0})` },
                  ].map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveDebugLayer(layer.id)}
                      className={`px-2 py-1 rounded border text-[10px] font-bold uppercase transition-all ${
                        activeDebugLayer === layer.id
                          ? "bg-terracotta text-paper border-ink shadow-sketch-sm"
                          : "bg-paper text-ink border-ink/30 hover:border-ink"
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── DEBUG STATISTICS PANEL (WHEN DEBUG MODE ACTIVE) ─────────── */}
          {debugMode && stats && (
            <div className="w-full p-4 rounded-xl bg-paper border-2 border-ink shadow-sketch-sm font-technical text-xs">
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-ink/20">
                <span className="font-bold uppercase tracking-wider text-ink">
                  MULTI-SCALE PIPELINE CANDIDATE STATISTICS
                </span>
                <span className="text-[10px] text-terracotta font-semibold">OpenCV Engine</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-2 rounded bg-paper-dark border border-ink/20">
                  <div className="text-[10px] font-semibold text-ink-faint">Small Cands</div>
                  <div className="text-base font-bold text-saffron-dark">{stats.small_candidates}</div>
                </div>
                <div className="p-2 rounded bg-paper-dark border border-ink/20">
                  <div className="text-[10px] font-semibold text-ink-faint">Medium Cands</div>
                  <div className="text-base font-bold text-terracotta">{stats.medium_candidates}</div>
                </div>
                <div className="p-2 rounded bg-paper-dark border border-ink/20">
                  <div className="text-[10px] font-semibold text-ink-faint">Large Cands</div>
                  <div className="text-base font-bold text-chai">{stats.large_candidates}</div>
                </div>
                <div className="p-2 rounded bg-paper-dark border border-ink/20">
                  <div className="text-[10px] font-semibold text-ink-faint">Merged</div>
                  <div className="text-base font-bold text-ink">{stats.merged_candidates}</div>
                </div>
                <div className="p-2 rounded bg-paper-dark border border-ink/20">
                  <div className="text-[10px] font-semibold text-ink-faint">Final Count</div>
                  <div className="text-base font-bold text-terracotta">{stats.final_bubbles}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: CLIMACTIC COUNT & REPORT DOSSIER (5 COLS) ───────── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ── THE CLIMACTIC NUMBER ─────────────────────────────────── */}
          <div
            className="p-6 sm:p-8 rounded-2xl bg-paper border-3 border-ink shadow-sketch lab-grid-dense text-center relative overflow-hidden"
            style={{
              borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
            }}
          >
            <span className="font-technical text-xs font-bold uppercase tracking-widest text-ink-faint block mb-1">
              TOTAL BUBBLE POPULATION
            </span>

            <div
              ref={numberCounterRef}
              className="font-display font-bold text-7xl sm:text-8xl md:text-9xl text-ink leading-none my-1 tracking-tight"
            >
              {displayCount}
            </div>

            <span className="font-handwritten text-3xl sm:text-4xl text-terracotta font-bold block -mt-1">
              BUBBLES DETECTED
            </span>

            <div className="w-24 h-0.5 bg-ink/20 mx-auto my-3" />

            <p className="font-technical text-[11px] uppercase tracking-wider text-ink-faint">
              Multi-scale census complete • High-fidelity OpenCV
            </p>
          </div>

          {/* ── ORGANIC BUBBLE CLASSIFICATION ────────────────────────── */}
          <div
            ref={classificationRef}
            className="p-5 rounded-2xl bg-paper-dark border-2 border-ink shadow-sketch-sm"
          >
            <div className="flex items-center justify-between mb-3 border-b border-ink/20 pb-2">
              <span className="font-technical font-bold text-xs uppercase tracking-wider text-ink">
                SPECIMEN CLASSIFICATION
              </span>
              <span className="font-handwritten text-lg text-chai font-semibold">
                Organic Population
              </span>
            </div>

            {/* 3 Categories with Organic Bubble Dots */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div
                onClick={() => setFilterSize("small")}
                className={`p-3 rounded-lg border-2 border-ink cursor-pointer transition-all ${
                  filterSize === "small" ? "bg-saffron/20 shadow-sketch-sm" : "bg-paper hover:bg-paper-warm"
                }`}
              >
                <div className="flex items-center justify-center h-8 gap-1">
                  <span className="w-2 h-2 rounded-full bg-saffron border border-ink" />
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron border border-ink" />
                  <span className="w-2 h-2 rounded-full bg-saffron border border-ink" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {small}
                </div>
                <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Small (≤12px)
                </div>
              </div>

              <div
                onClick={() => setFilterSize("medium")}
                className={`p-3 rounded-lg border-2 border-ink cursor-pointer transition-all ${
                  filterSize === "medium" ? "bg-terracotta/20 shadow-sketch-sm" : "bg-paper hover:bg-paper-warm"
                }`}
              >
                <div className="flex items-center justify-center h-8 gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-terracotta border border-ink" />
                  <span className="w-3.5 h-3.5 rounded-full bg-terracotta border border-ink" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {medium}
                </div>
                <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Medium (13-24px)
                </div>
              </div>

              <div
                onClick={() => setFilterSize("large")}
                className={`p-3 rounded-lg border-2 border-ink cursor-pointer transition-all ${
                  filterSize === "large" ? "bg-chai/20 shadow-sketch-sm" : "bg-paper hover:bg-paper-warm"
                }`}
              >
                <div className="flex items-center justify-center h-8">
                  <span className="w-6 h-6 rounded-full bg-chai border-2 border-ink" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {large}
                </div>
                <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Large (≥25px)
                </div>
              </div>
            </div>
          </div>

          {/* ── ABSURD SCIENTIFIC VERDICT ─────────────────────────────── */}
          <div
            ref={verdictCardRef}
            className="p-5 rounded-2xl bg-paper border-3 border-ink shadow-sketch relative"
            style={{
              borderRadius: "255px 20px 225px 20px/20px 225px 20px 255px",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-paper-dark border-2 border-ink flex items-center justify-center flex-shrink-0 shadow-sketch-sm">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path d="M 8 10 L 10 26 C 10 28, 24 28, 24 26 L 26 10 Z" fill="#C85A32" stroke="#1E1610" strokeWidth="1.8" />
                  <ellipse cx="17" cy="10" rx="9" ry="3" fill="#FFFBF2" stroke="#1E1610" strokeWidth="1.4" />
                  <circle cx="14" cy="18" r="1.5" fill="#FAF6EE" />
                  <circle cx="20" cy="18" r="1.5" fill="#FAF6EE" />
                  <path d="M 15 22 Q 17 24 19 22" stroke="#FAF6EE" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-technical text-[10px] uppercase tracking-widest text-terracotta font-bold">
                    OFFICIAL VERDICT:
                  </span>
                  <span className="font-display text-xl font-bold text-ink">
                    {verdict.title}
                  </span>
                </div>
                <p className="font-handwritten text-xl text-chai font-semibold leading-snug mt-0.5">
                  "{verdict.status}"
                </p>
                <p className="font-technical text-xs text-ink-faint mt-1 leading-relaxed">
                  {verdict.observation}
                </p>
                <div className="mt-2 text-[11px] font-technical bg-paper-dark px-2.5 py-1 rounded border border-ink/20">
                  <strong className="text-ink">Prescribed Action:</strong>{" "}
                  <span className="text-terracotta font-medium">{verdict.recommendation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── FUNNY WASTED STATS & THANKS BADGE ───────────────────── */}
          <div className="p-4 rounded-xl bg-paper-dark border-2 border-ink/40 font-technical text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-ink/15 pb-1">
              <span className="font-bold text-terracotta uppercase tracking-wider text-[10px]">
                🗑️ Specimen Waste & Special Acknowledgments
              </span>
              <span className="text-[10px] text-ink-faint">100% Useless Data</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-paper p-2 rounded border border-ink/10">
                <span className="text-ink-faint block text-[10px]">☕ Tea Wasted:</span>
                <strong className="text-ink">250 ml poured & forgotten</strong>
              </div>
              <div className="bg-paper p-2 rounded border border-ink/10">
                <span className="text-ink-faint block text-[10px]">⏰ Time Wasted:</span>
                <strong className="text-chai">4.2 mins staring at foam</strong>
              </div>
              <div className="bg-paper p-2 rounded border border-ink/10">
                <span className="text-ink-faint block text-[10px]">🍪 Biscuits Lost:</span>
                <strong className="text-terracotta">2x Parle-G dunked to death</strong>
              </div>
              <div className="bg-paper p-2 rounded border border-ink/10">
                <span className="text-ink-faint block text-[10px]">🙏 Thanks To:</span>
                <strong className="text-ink">Tapri Chaiwala & HoughCircles</strong>
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => playWithRealChai(results)}
              className="w-full sm:flex-1 px-5 py-3 font-technical text-xs uppercase font-extrabold tracking-wider rounded-xl border-2 border-ink bg-terracotta text-paper hover:bg-terracotta-dark hover:scale-[1.02] transition-all shadow-sketch flex items-center justify-center gap-2"
            >
              <span>POP GLASS BUBBLES 🫧</span>
            </button>

            <IllustratedButton
              id="btn-inspect-again"
              onClick={() => setStage("tray")}
              showArrow={false}
              size="md"
              className="w-full sm:w-auto"
            >
              INSPECT ANOTHER
            </IllustratedButton>

            <button
              type="button"
              onClick={resetAll}
              className="w-full sm:w-auto px-4 py-3 font-technical text-xs uppercase font-bold tracking-wider rounded-xl border-2 border-ink bg-paper hover:bg-paper-dark transition-all shadow-sketch-sm"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
