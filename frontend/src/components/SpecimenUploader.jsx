import React, { useRef, useState } from "react";
import useBubbleStore, { SAMPLE_SPECIMENS } from "../store/useBubbleStore";
import IllustratedButton from "./illustrations/IllustratedButton";
import { CornerRegistrationMarks, StampScientific } from "./illustrations/SpecimenMarks";

/**
 * SpecimenUploader Component
 * Designed as an illustrated laboratory specimen tray on graph paper.
 * Responds dynamically to dragover, dragleave, and file drops.
 */
export default function SpecimenUploader() {
  const {
    preview,
    setImage,
    setSampleSpecimen,
    runAnalysis,
    setStage,
    sensitivity,
    setSensitivity,
  } = useBubbleStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto">
      {/* ── TOP TRAY HEADER ───────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between mb-4 border-b-2 border-ink/20 pb-3">
        <button
          onClick={() => setStage("hero")}
          className="flex items-center gap-1.5 font-technical text-xs uppercase tracking-wider text-ink-faint hover:text-ink font-semibold"
        >
          <span className="text-base font-bold">←</span> Back to Specimen View
        </button>

        <div className="flex items-center gap-2">
          <span className="font-handwritten text-xl text-terracotta font-bold">
            Phase 02: Specimen Intake
          </span>
          <StampScientific />
        </div>
      </div>

      {/* ── MAIN LABORATORY SPECIMEN TRAY ─────────────────────────────── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`relative w-full rounded-2xl bg-paper-dark border-3 p-6 sm:p-10 transition-all duration-200 cursor-pointer lab-grid overflow-hidden ${
          isDragging
            ? "border-terracotta bg-saffron/10 scale-[1.01] shadow-sketch-lg"
            : "border-ink shadow-sketch hover:shadow-sketch-lg"
        }`}
        style={{
          border: "3px solid #1E1610",
          borderRadius: "255px 25px 225px 25px/25px 225px 25px 255px",
        }}
      >
        <CornerRegistrationMarks />

        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* ── IF SPECIMEN LOADED ──────────────────────────────────────── */}
        {preview ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative max-w-[440px] w-full aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden border-2 border-ink shadow-sketch bg-paper">
              <img
                src={preview}
                alt="Selected chai specimen"
                className="w-full h-full object-cover"
              />

              {/* Lab tape on corners */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-paper border border-ink/60 text-[9px] font-technical uppercase tracking-wider shadow-sm rotate-[-4deg]">
                SPECIMEN MOUNTED
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-saffron text-ink border border-ink text-[10px] font-technical font-bold uppercase tracking-wider shadow-sm rotate-[2deg]">
                READY FOR SENSORS
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <IllustratedButton
                id="btn-run-inspection"
                onClick={(e) => {
                  e.stopPropagation();
                  runAnalysis();
                }}
                size="lg"
              >
                BEGIN BUBBLE CENSUS
              </IllustratedButton>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="font-technical text-xs uppercase tracking-wider text-ink-faint hover:text-ink underline underline-offset-4"
              >
                Swap Specimen
              </button>
            </div>

            {/* Sensitivity Calibrator (Ridiculously serious) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm flex flex-col gap-1.5 p-3 rounded bg-paper border border-ink/30 shadow-sketch-sm"
            >
              <div className="flex items-center justify-between text-xs font-technical">
                <span className="font-bold text-ink">FOAM DETECTION THRESHOLD</span>
                <span className="font-handwritten text-lg text-terracotta font-bold">
                  Level {sensitivity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="slider-lab w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-technical text-ink-faint">
                <span>Coarse Bubbles</span>
                <span>Micro-Froth</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── IF EMPTY: DROP ZONE ────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12">
            {/* Illustrated Mini Tray & Cup */}
            <div className={`relative mb-4 transition-transform duration-200 ${isDragging ? "animate-bounce scale-110" : "hover:scale-105"}`}>
              <svg width="120" height="95" viewBox="0 0 120 95" fill="none" className="overflow-visible">
                {/* Plate */}
                <ellipse cx="60" cy="80" rx="45" ry="10" fill="#FAF6EE" stroke="#1E1610" strokeWidth="2.5" />
                {/* Cup */}
                <path d="M 38 40 L 45 78 C 45 81, 75 81, 75 78 L 82 40 Z" fill="#632B13" stroke="#1E1610" strokeWidth="2.5" />
                {/* Foam */}
                <ellipse cx="60" cy="40" rx="22" ry="7" fill="#F7EEDF" stroke="#1E1610" strokeWidth="2" />
                {/* Steam */}
                <path d="M 52 30 C 48 20, 56 12, 53 4" stroke="#C85A32" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
                <path d="M 68 28 C 72 18, 65 10, 68 2" stroke="#E89635" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
                {/* Reactive bubbles that bounce when dragging */}
                <circle cx={isDragging ? 30 : 35} cy={isDragging ? 25 : 30} r="5" fill="#FAF6EE" stroke="#1E1610" strokeWidth="1.8" className="transition-all" />
                <circle cx={isDragging ? 90 : 85} cy={isDragging ? 22 : 28} r="6" fill="#FAF6EE" stroke="#1E1610" strokeWidth="1.8" className="transition-all" />
              </svg>
            </div>

            <span className="font-technical font-bold text-lg sm:text-xl uppercase tracking-widest text-ink mb-1">
              DROP YOUR CHAI HERE
            </span>
            <p className="font-handwritten text-2xl text-terracotta font-semibold mb-2">
              or click to place your tea photo on the laboratory tray
            </p>
            <span className="font-technical text-[10px] tracking-widest uppercase text-ink-faint">
              Accepts standard tea captures (JPEG, PNG, WEBP)
            </span>
          </div>
        )}
      </div>

      {/* ── PRE-CALIBRATED SPECIMENS (1-CLICK TESTING) ───────────────── */}
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-technical text-xs font-bold uppercase tracking-wider text-ink">
            No tea photo on hand?
          </span>
          <span className="font-handwritten text-lg text-terracotta font-bold">
            Select a calibrated laboratory specimen:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {SAMPLE_SPECIMENS.map((specimen) => (
            <button
              key={specimen.id}
              onClick={() => setSampleSpecimen(specimen)}
              className="flex items-start gap-3 p-3 rounded-lg border-2 border-ink bg-paper text-left transition-all duration-150 hover:bg-paper-dark hover:-translate-y-0.5 shadow-sketch-sm hover:shadow-sketch"
            >
              <img
                src={specimen.sampleUrl}
                alt={specimen.name}
                className="w-14 h-14 rounded object-cover border border-ink flex-shrink-0"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-technical font-bold text-xs text-ink leading-tight truncate">
                  {specimen.name}
                </span>
                <span className="font-technical text-[10px] text-ink-faint line-clamp-2 mt-0.5">
                  {specimen.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
