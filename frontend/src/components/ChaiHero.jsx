import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ChaiCupIllustration from "./illustrations/ChaiCupIllustration";
import LabAnnotations from "./illustrations/LabAnnotations";
import IllustratedButton from "./illustrations/IllustratedButton";
import useBubbleStore from "../store/useBubbleStore";

/**
 * Expanded Scrollable ChaiHero Component
 * Features:
 * 1. Scroll-triggered entrance: Cup image reveals upon scroll.
 * 2. 5-Section Rich Landing Page:
 *    - Hero Header & Main Call to Action
 *    - Interactive Scroll-Revealed Chai Cup Stage
 *    - Three Pillars of Absurd Tea Science
 *    - Official Chai Quality Scale Grid (6 Tiers)
 *    - Useless Statistics Banner & Bottom CTA
 */
export default function ChaiHero() {
  const { setStage, setRoute, sessionPoppedCount, firstPopTimestamp } = useBubbleStore();
  const heroContainerRef = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef = useRef(null);
  const ctaContainerRef = useRef(null);
  const cupWrapperRef = useRef(null);
  const cupStageSectionRef = useRef(null);
  
  const [isCupRevealed, setIsCupRevealed] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!firstPopTimestamp) return;
    const updateElapsed = () => {
      setElapsedSec(Math.max(1, Math.floor((Date.now() - firstPopTimestamp) / 1000)));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [firstPopTimestamp]);

  // Entrance animations for Hero Headline & CTA
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Headline and CTA initial states
      gsap.set(headlineRef.current, { opacity: 0, y: 20 });
      gsap.set(sublineRef.current, { opacity: 0, y: 14 });
      gsap.set(ctaContainerRef.current, { opacity: 0, scale: 0.9, y: 14 });

      // Central Cup starts initially NOT visible (opacity 0, scaled down, shifted down)
      gsap.set(cupWrapperRef.current, { opacity: 0, scale: 0.8, y: 60 });
      gsap.set(".annotation-item", { opacity: 0, scale: 0.8 });

      // Animate Hero text entrance
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(sublineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      }, "-=0.3")
      .to(ctaContainerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
      }, "-=0.2");

    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // Scroll Listener & IntersectionObserver to trigger Image Visibility on Scroll
  useEffect(() => {
    const target = cupStageSectionRef.current;
    if (!target) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        triggerCupReveal();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0.1) {
            triggerCupReveal();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    window.addEventListener("scroll", handleScroll);

    // Initial check in case user is already scrolled
    if (window.scrollY > 40) {
      triggerCupReveal();
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const triggerCupReveal = () => {
    if (isCupRevealed) return;
    setIsCupRevealed(true);

    if (cupWrapperRef.current) {
      gsap.to(cupWrapperRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: "back.out(1.3)",
      });

      gsap.to(".annotation-item", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleStartInspection = () => {
    gsap.to(heroContainerRef.current, {
      opacity: 0,
      y: -18,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setStage("tray");
      },
    });
  };

  return (
    <div
      ref={heroContainerRef}
      className="relative w-full py-8 sm:py-12 space-y-16 sm:space-y-24 overflow-x-hidden"
    >
      {/* ── 1. HERO HEADLINE & TOP CTA ──────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center space-y-6 flex flex-col items-center">
        <div className="space-y-3 max-w-4xl">
          <h1
            ref={headlineRef}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-tight"
          >
            How Bubbly Is Your ചായ?
          </h1>
          <p
            ref={sublineRef}
            className="font-handwritten text-2xl sm:text-3xl md:text-4xl text-chai font-semibold"
          >
            A ridiculously serious inquiry into roadside froth dynamics.
          </p>
        </div>

        {/* Action Buttons: Count Bubbles + Code a Chai Terminal */}
        <div ref={ctaContainerRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <IllustratedButton
            id="btn-count-bubbles"
            onClick={handleStartInspection}
            size="lg"
          >
            COUNT MY BUBBLES 🔬
          </IllustratedButton>

          <button
            type="button"
            onClick={() => setRoute("code-a-chai")}
            className="group relative px-6 py-3.5 rounded-2xl bg-[#1E1610] text-[#F7EEDF] border-3 border-ink font-mono text-sm font-bold tracking-wider hover:bg-[#2A1D16] hover:scale-[1.03] transition-all shadow-sketch flex items-center gap-3 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-saffron font-extrabold">
              <span className="text-xs text-terracotta">&gt;</span> chai.init
            </span>
            <span className="w-2 h-4 bg-saffron animate-pulse" />
            <span className="text-xs text-paper/80 group-hover:text-paper uppercase tracking-widest border-l border-paper/20 pl-3">
              Code a ചായ 💻
            </span>
          </button>
        </div>
      </section>

      {/* ── 2. SCROLL-REVEALED CENTRAL CHAI CUP STAGE ────────────────────── */}
      <section
        ref={cupStageSectionRef}
        className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center space-y-4"
      >


        {/* Central Illustrated Chai Cup (Starts hidden, reveals on scroll) */}
        <div className="relative w-full max-w-3xl flex items-center justify-center my-4 py-4 bg-transparent">
          {/* Scientific Annotations Overlay */}
          <LabAnnotations />

          {/* Central Illustrated Chai Cup */}
          <div
            ref={cupWrapperRef}
            className="relative z-10 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] transition-all duration-300"
          >
            <ChaiCupIllustration />
          </div>
        </div>

        <p className="font-technical text-xs text-ink-faint tracking-wider uppercase text-center">
          [ TIP: Click micro-bubbles inside the glass foam to pop them live ]
        </p>
      </section>

      {/* ── CHAISCRIPT TERMINAL PORTAL CARD ────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-4">
        <div
          onClick={() => setRoute("code-a-chai")}
          className="group relative rounded-2xl bg-[#1E1610] border-2 border-ink shadow-sketch p-6 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-[#261B14]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-2xl shrink-0">
              💻
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-paper flex items-center gap-2">
                <span>ChaiScript Terminal Compiler</span>
                <span className="text-[10px] font-technical uppercase font-bold text-saffron bg-saffron/20 px-2 py-0.5 rounded">IDE</span>
              </h3>
              <p className="font-technical text-xs text-paper/70 mt-0.5">
                Code & compile your custom tea recipe step-by-step in terminal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRoute("code-a-chai");
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-saffron text-ink font-technical font-bold text-xs uppercase tracking-wider hover:bg-paper transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sketch-sm"
          >
            <span>Launch Terminal</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </section>

      {/* ── 3. THE THREE PILLARS OF CHAI PHYSICS (ANNOTATED DIAGRAM LAYOUT) ─ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chai/10 border border-chai/30 text-chai font-technical text-xs font-bold uppercase tracking-wider">
            <span>🔬</span> Laboratory Blueprint & Hydrodynamics
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
            The Three Pillars of ചായ Physics
          </h2>
          <p className="font-handwritten text-xl sm:text-2xl text-terracotta font-semibold">
            High-precision classical OpenCV detection without neural network fluff.
          </p>
        </div>

        {/* Horizontal Annotated Laboratory Diagram Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-paper border-3 border-ink shadow-sketch lab-grid-dense space-y-6">
          <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
            <span className="font-technical text-xs font-bold uppercase tracking-widest text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
              FLUID DYNAMICS DIAGRAM • FIG 4.2
            </span>
            <span className="font-handwritten text-lg text-chai font-bold">
              Roadside Aeration Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Pillar 1: Ink SVG Diagram */}
            <div className="p-5 rounded-2xl bg-paper-dark border-2 border-ink shadow-sketch-sm flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-paper border-2 border-ink flex items-center justify-center p-2 shadow-sketch-sm">
                  {/* Hand-sketched Ink SVG Bubbles */}
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <circle cx="16" cy="18" r="10" stroke="#1E1610" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="16" cy="18" r="3" fill="#1E1610" />
                    <circle cx="30" cy="28" r="8" stroke="#1E1610" strokeWidth="2" />
                    <circle cx="28" cy="12" r="5" stroke="#C85A32" strokeWidth="1.8" />
                    <path d="M 8 32 Q 22 36 36 32" stroke="#1E1610" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                </div>
                <div className="font-technical text-[10px] font-black uppercase tracking-wider text-terracotta">
                  PILLAR 01 • SURFACE TENSION
                </div>
                <h3 className="font-display font-bold text-xl text-ink">
                  Micro-Froth Physics
                </h3>
                <p className="font-technical text-xs text-ink/75 leading-relaxed">
                  Calculates surface tension, bubble radius distributions, and packing efficiency within the upper 15mm foam boundary.
                </p>
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-terracotta pt-2 border-t border-dashed border-ink/20 flex justify-between">
                <span>ACCURACY: &plusmn; 0.01 BUBBLES</span>
                <span>FIG A</span>
              </div>
            </div>

            {/* Pillar 2: Ink SVG Diagram */}
            <div className="p-5 rounded-2xl bg-paper-dark border-2 border-ink shadow-sketch-sm flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-paper border-2 border-ink flex items-center justify-center p-2 shadow-sketch-sm">
                  {/* Hand-sketched Ink SVG Teapot Viscosity */}
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path d="M 12 16 C 12 12, 32 12, 32 16 L 30 36 C 30 38, 14 38, 14 36 Z" stroke="#1E1610" strokeWidth="2" />
                    <path d="M 10 22 C 4 22, 4 30, 14 30" stroke="#1E1610" strokeWidth="1.8" />
                    <path d="M 32 20 L 38 14" stroke="#C85A32" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="24" x2="26" y2="24" stroke="#1E1610" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="16" y1="28" x2="28" y2="28" stroke="#1E1610" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                </div>
                <div className="font-technical text-[10px] font-black uppercase tracking-wider text-chai">
                  PILLAR 02 • VISCOSITY MATRIX
                </div>
                <h3 className="font-display font-bold text-xl text-ink">
                  Kadak Viscosity Matrix
                </h3>
                <p className="font-technical text-xs text-ink/75 leading-relaxed">
                  Determines liquid opacity and boiling duration by assessing milk-fat light scattering and tea leaf extraction depth.
                </p>
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-chai pt-2 border-t border-dashed border-ink/20 flex justify-between">
                <span>STEEPMETER: 100% ROAD-TESTED</span>
                <span>FIG B</span>
              </div>
            </div>

            {/* Pillar 3: Ink SVG Diagram */}
            <div className="p-5 rounded-2xl bg-paper-dark border-2 border-ink shadow-sketch-sm flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-paper border-2 border-ink flex items-center justify-center p-2 shadow-sketch-sm">
                  {/* Hand-sketched Ink SVG Steam Plume */}
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path d="M 14 36 C 10 26, 22 18, 16 8" stroke="#1E1610" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 24 38 C 30 28, 18 16, 26 6" stroke="#C85A32" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M 32 34 C 36 26, 28 20, 34 12" stroke="#1E1610" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="8" y1="38" x2="36" y2="38" stroke="#1E1610" strokeWidth="1.8" />
                  </svg>
                </div>
                <div className="font-technical text-[10px] font-black uppercase tracking-wider text-saffron-dark">
                  PILLAR 03 • THERMAL STEAM
                </div>
                <h3 className="font-display font-bold text-xl text-ink">
                  Vapor Plume Dynamics
                </h3>
                <p className="font-technical text-xs text-ink/75 leading-relaxed">
                  Tracks thermal steam wisps rising from fresh pours to calculate optimal sipping temperature without tongue scalding.
                </p>
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-saffron-dark pt-2 border-t border-dashed border-ink/20 flex justify-between">
                <span>THERMAL INDEX: 68&deg;C OPTIMAL</span>
                <span>FIG C</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── 5. USELESS STATISTICS & LIVE SESSION TRACKER ──────────────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Real Live Session Popping Counter (NaN-Safe Guards) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-paper-dark border-3 border-ink shadow-sketch space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-saffron animate-pulse" />
              <h3 className="font-technical text-xs sm:text-sm font-bold uppercase tracking-widest text-ink">
                🔴 Live Session Waste Tracker (Real Data)
              </h3>
            </div>
            <span className="font-technical text-[11px] font-bold text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded border border-terracotta/30">
              {Number.isFinite(sessionPoppedCount) && sessionPoppedCount > 0 ? "Tracking Active Pops Live" : "Awaiting First Specimen Pop..."}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-1">
            <div className="p-4 rounded-2xl bg-paper border-2 border-ink shadow-sketch-sm space-y-1">
              <div className="font-display font-black text-3xl sm:text-4xl text-terracotta">
                {Number.isFinite(sessionPoppedCount) && sessionPoppedCount >= 0 ? sessionPoppedCount : 0}
              </div>
              <div className="font-technical text-xs font-bold uppercase tracking-wider text-ink-faint">
                Bubbles Popped by You 🫧
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-paper border-2 border-ink shadow-sketch-sm space-y-1">
              <div className="font-display font-black text-3xl sm:text-4xl text-chai">
                {Number.isFinite(sessionPoppedCount) ? (sessionPoppedCount * 0.45).toFixed(1) : "0.0"} ml
              </div>
              <div className="font-technical text-xs font-bold uppercase tracking-wider text-ink-faint">
                Chai Displaced by You ☕
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-paper border-2 border-ink shadow-sketch-sm space-y-1">
              <div className="font-display font-black text-3xl sm:text-4xl text-ink">
                {firstPopTimestamp && Number.isFinite(elapsedSec) && elapsedSec > 0
                  ? `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`
                  : "0m 0s"}
              </div>
              <div className="font-technical text-xs font-bold uppercase tracking-wider text-ink-faint">
                Session Time Wasted ⏰
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-paper border-2 border-ink shadow-sketch-sm space-y-1">
              <div className="font-display font-black text-3xl sm:text-4xl text-saffron-dark">
                {Number.isFinite(sessionPoppedCount) ? Math.floor(sessionPoppedCount / 8) : 0}
              </div>
              <div className="font-technical text-xs font-bold uppercase tracking-wider text-ink-faint">
                Parle-G Lost to Foam 🍪
              </div>
            </div>
          </div>

          {(!sessionPoppedCount || sessionPoppedCount === 0) && (
            <p className="font-technical text-xs text-ink/75 text-center italic pt-1">
              💡 Tip: Click micro-bubbles on the illustrated cup above or launch <button onClick={() => setRoute("pop-the-bubble")} className="underline font-bold text-terracotta">Bubble Popper</button> to start live tracking!
            </p>
          )}
        </div>

        {/* Global Laboratory Metrics (Unique, Non-Duplicate Metrics) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-paper border-3 border-ink shadow-sketch space-y-4 text-center">
          <h3 className="font-technical text-xs sm:text-sm font-bold uppercase tracking-widest text-terracotta">
            📊 Global Laboratory Metrics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-2">
            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-terracotta">
                8,420
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Tapri Talks Overhead 🗣️
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-chai">
                98.2%
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Leaf Extraction Rate 🫖
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-ink">
                14.2 km
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Meniscus Distance 📏
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-saffron-dark">
                0.00s
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Market Value 📉
              </div>
              <div className="font-handwritten text-[11px] text-terracotta">
                Re-verified: Still 0.00s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-terracotta">
                5,190
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Crumbs Dissolved 🍪
              </div>
            </div>

            <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-chai">
                100%
              </div>
              <div className="font-technical text-[10px] font-bold uppercase tracking-wider text-ink/70">
                Roadside Authenticity ☕
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CALL TO ACTION ────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-4 text-center space-y-6 pt-6">
        <div className="space-y-2">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight">
            Ready to Analyze Your ചായ?
          </h2>
          <p className="font-handwritten text-2xl text-terracotta font-semibold">
            Upload your tea photograph to calculate foam volume and bubble density.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <IllustratedButton
            id="btn-bottom-count"
            onClick={handleStartInspection}
            size="lg"
          >
            BEGIN ചായ CENSUS 🔬
          </IllustratedButton>

          <button
            type="button"
            onClick={() => setRoute("code-a-chai")}
            className="px-6 py-4 rounded-2xl bg-[#1E1610] text-[#F7EEDF] border-3 border-ink font-technical font-extrabold text-sm uppercase tracking-wider hover:bg-[#2A1D16] hover:scale-[1.03] transition-all shadow-sketch flex items-center gap-2.5 cursor-pointer"
          >
            <span>OPEN CHAISCRIPT TERMINAL</span>
            <span className="text-base">💻</span>
          </button>
        </div>
      </section>
    </div>
  );
}
