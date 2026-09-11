import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import useBubbleStore from "../store/useBubbleStore";
import IllustratedButton from "./illustrations/IllustratedButton";
import { CornerRegistrationMarks, StampScientific, StampUnnecessary } from "./illustrations/SpecimenMarks";

/**
 * BubbleResultsView Component
 * The climax of the experience:
 * - Editorial composition with uploaded chai photo as the hero
 * - Hand-drawn SVG inspection rings around every detected bubble with specimen IDs
 * - Rapid number counter animation settling into the climax (e.g. 47 BUBBLES)
 * - Organic bubble classification: visual cluster of small, medium, large bubbles
 * - Absurd scientific verdict with illustrated cup personality expression
 * - Minimal, collectible poster aesthetics
 */
export default function BubbleResultsView() {
  const { results, preview, resetAll, setStage } = useBubbleStore();

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
  const bubbles = results?.bubbles || [];
  const verdict = results?.verdict || {
    title: "Chaotic Chai",
    status: "Bubble density: unnecessarily impressive.",
    observation: "Spirited boiling and high surface froth dynamics observed.",
    recommendation: "Consume with Parle-G immediately.",
  };

  // Coordinated Climax Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial count rolling
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: total,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayCount(Math.round(counterObj.val));
        },
        onComplete: () => {
          // Subtle celebratory burst of saffron & tea leaf confetti
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#E89635", "#C85A32", "#8A4B29", "#F7EEDF"],
              disableForReducedMotion: true,
            });
          } catch (e) {
            // Ignore confetti errors if any
          }

          // Number pulse
          if (numberCounterRef.current) {
            gsap.fromTo(
              numberCounterRef.current,
              { scale: 1.15 },
              { scale: 1, duration: 0.4, ease: "bounce.out" }
            );
          }
        },
      });

      // 2. Animate bubble circles popping into existence
      gsap.fromTo(
        ".bubble-marker",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.025,
          ease: "back.out(1.8)",
          delay: 0.3,
        }
      );

      // 3. Reveal classification & verdict
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

  const filteredBubbles =
    filterSize === "all"
      ? bubbles
      : bubbles.filter((b) => b.size === filterSize);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen px-4 py-8 max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* ── TOP EDITORIAL MASTHEAD ────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between border-b-2 border-ink/20 pb-4 mb-6">
        <button
          onClick={() => setStage("tray")}
          className="flex items-center gap-1.5 font-technical text-xs uppercase tracking-wider text-ink-faint hover:text-ink font-semibold"
        >
          <span className="text-base font-bold">←</span> Inspect Another Chai
        </button>

        <div className="flex items-center gap-3">
          <StampUnnecessary />
          <StampScientific />
        </div>
      </div>

      {/* ── MAIN EDITORIAL TWO-COLUMN LAYOUT ──────────────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT / HERO: SPECIMEN PHOTOGRAPH WITH MARKER OVERLAY (7 COLS) ─ */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className="relative w-full rounded-2xl bg-paper-dark border-3 border-ink p-3 sm:p-4 shadow-sketch-lg overflow-hidden"
            style={{
              borderRadius: "255px 25px 225px 25px/25px 225px 25px 255px",
            }}
          >
            <CornerRegistrationMarks />

            {/* Specimen Frame */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-ink bg-chai-dark/10">
              {/* Uploaded tea image */}
              <img
                src={preview}
                alt="Chai bubble specimen"
                className="w-full h-full object-cover select-none"
              />

              {/* Hand-drawn Optical Bubble Overlay (SVG) */}
              <svg
                viewBox="0 0 800 600"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {filteredBubbles.map((bubble, idx) => {
                  const isHovered = activeBubble?.specimenId === bubble.specimenId;
                  const strokeColor =
                    bubble.size === "small"
                      ? "#E89635"
                      : bubble.size === "medium"
                      ? "#C85A32"
                      : "#8A4B29";

                  return (
                    <g
                      key={bubble.specimenId || idx}
                      className="bubble-marker pointer-events-auto cursor-pointer"
                      onMouseEnter={() => setActiveBubble(bubble)}
                      onMouseLeave={() => setActiveBubble(null)}
                      style={{ transformOrigin: `${bubble.x}px ${bubble.y}px` }}
                    >
                      {/* Imperfect sketched circle */}
                      <circle
                        cx={bubble.x}
                        cy={bubble.y}
                        r={bubble.radius + (isHovered ? 4 : 0)}
                        fill={isHovered ? strokeColor : "none"}
                        fillOpacity={isHovered ? 0.35 : 0}
                        stroke={strokeColor}
                        strokeWidth={isHovered ? 3.5 : bubble.size === "large" ? 2.8 : 2}
                        strokeDasharray={bubble.size === "small" ? "none" : "6 2"}
                        className="transition-all duration-150"
                      />

                      {/* Specimen Center Pip */}
                      <circle
                        cx={bubble.x}
                        cy={bubble.y}
                        r={1.8}
                        fill="#FAF6EE"
                        stroke="#1E1610"
                        strokeWidth="1"
                      />

                      {/* Specimen tag for larger bubbles or on hover */}
                      {(isHovered || bubble.size === "large") && (
                        <g>
                          <line
                            x1={bubble.x}
                            y1={bubble.y - bubble.radius}
                            x2={bubble.x + 16}
                            y2={bubble.y - bubble.radius - 14}
                            stroke="#1E1610"
                            strokeWidth="1.2"
                          />
                          <rect
                            x={bubble.x + 16}
                            y={bubble.y - bubble.radius - 24}
                            width="48"
                            height="15"
                            rx="3"
                            fill="#FAF6EE"
                            stroke="#1E1610"
                            strokeWidth="1"
                          />
                          <text
                            x={bubble.x + 20}
                            y={bubble.y - bubble.radius - 13}
                            fontFamily="Space Grotesk"
                            fontSize="8.5"
                            fontWeight="bold"
                            fill="#1E1610"
                          >
                            {bubble.specimenId || `B-${idx + 1}`}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Lab tape banner */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-paper/95 border border-ink text-[11px] font-technical font-bold uppercase tracking-widest shadow-sketch-sm rotate-[-1deg]">
                ANALYZED SPECIMEN • CV VERIFIED
              </div>

              {/* Active bubble inspector tooltip */}
              {activeBubble && (
                <div className="absolute top-2 right-2 bg-paper/95 border-2 border-ink px-3 py-1.5 rounded shadow-sketch font-technical text-xs">
                  <span className="font-bold text-terracotta">{activeBubble.specimenId}</span>
                  <span className="text-ink ml-1.5 capitalize">[{activeBubble.size}]</span>
                  <span className="text-ink-faint ml-1.5">radius: {activeBubble.radius}px</span>
                </div>
              )}
            </div>

            {/* Specimen legend filter tabs */}
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
          </div>
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
              Census complete • Accuracy: completely unnecessary
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
              {/* Small */}
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
                  Small (≤8px)
                </div>
              </div>

              {/* Medium */}
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
                  Medium (9-18px)
                </div>
              </div>

              {/* Large */}
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
                  Large (≥19px)
                </div>
              </div>
            </div>
          </div>

          {/* ── ABSURD SCIENTIFIC VERDICT (THE ONE FUNNY MOMENT) ───────── */}
          <div
            ref={verdictCardRef}
            className="p-5 rounded-2xl bg-paper border-3 border-ink shadow-sketch relative"
            style={{
              borderRadius: "255px 20px 225px 20px/20px 225px 20px 255px",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Cup Character Expression */}
              <div className="w-14 h-14 rounded-full bg-paper-dark border-2 border-ink flex items-center justify-center flex-shrink-0 shadow-sketch-sm">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  {/* Mini animated cup with eyes */}
                  <path d="M 8 10 L 10 26 C 10 28, 24 28, 24 26 L 26 10 Z" fill="#C85A32" stroke="#1E1610" strokeWidth="1.8" />
                  <ellipse cx="17" cy="10" rx="9" ry="3" fill="#FFFBF2" stroke="#1E1610" strokeWidth="1.4" />
                  {/* Character Eyes based on verdict */}
                  <circle cx="14" cy="18" r="1.5" fill="#FAF6EE" />
                  <circle cx="20" cy="18" r="1.5" fill="#FAF6EE" />
                  {/* Smirk */}
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

          {/* ── ACTION BUTTONS ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <IllustratedButton
              id="btn-inspect-again"
              onClick={() => setStage("tray")}
              showArrow={false}
              size="md"
              className="w-full sm:w-auto flex-1"
            >
              INSPECT ANOTHER SPECIMEN
            </IllustratedButton>

            <button
              type="button"
              onClick={resetAll}
              className="w-full sm:w-auto px-5 py-3 font-technical text-xs uppercase font-bold tracking-wider rounded-xl border-2 border-ink bg-paper hover:bg-paper-dark transition-all shadow-sketch-sm hover:shadow-sketch"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
