import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ChaiCupIllustration from "./illustrations/ChaiCupIllustration";
import LabAnnotations from "./illustrations/LabAnnotations";
import IllustratedButton from "./illustrations/IllustratedButton";
import { StampUnnecessary, StampScientific } from "./illustrations/SpecimenMarks";
import useBubbleStore from "../store/useBubbleStore";

/**
 * ChaiHero Component
 * Implements the choreographed entrance sequence:
 * 1. Paper background reveals
 * 2. Cup illustration appears
 * 3. Steam wisps rise
 * 4. Micro-bubbles emerge
 * 5. Scientific annotation lines draw themselves around the cup
 * 6. Headline reveals
 * 7. CTA settles into place
 */
export default function ChaiHero() {
  const { setStage } = useBubbleStore();
  const heroContainerRef = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef = useRef(null);
  const ctaContainerRef = useRef(null);
  const cupWrapperRef = useRef(null);
  const stampRef = useRef(null);
  const mascotRef = useRef(null);

  // Mascot Pop Up / Pop Out Repeating Animation Loop
  useEffect(() => {
    if (!mascotRef.current) return;

    // Initial state: hidden
    gsap.set(mascotRef.current, {
      scale: 0,
      opacity: 0,
      y: 30,
      transformOrigin: "bottom right",
    });

    const mascotTl = gsap.timeline({ repeat: -1, repeatDelay: 10 });

    mascotTl
      .to(mascotRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 1.2, // Initial entrance after 1.2s
      })
      .to(mascotRef.current, {
        scale: 1,
        duration: 3.8, // Stay visible for 3.8 seconds
      })
      .to(mascotRef.current, {
        scale: 0,
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: "back.in(1.4)",
      });

    return () => mascotTl.kill();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Initial states
      gsap.set(cupWrapperRef.current, { scale: 0.85, opacity: 0, y: 20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 16 });
      gsap.set(sublineRef.current, { opacity: 0, y: 12 });
      gsap.set(ctaContainerRef.current, { opacity: 0, scale: 0.9, y: 14 });
      gsap.set(stampRef.current, { opacity: 0, scale: 1.3, rotation: -10 });
      gsap.set(".annotation-item", { opacity: 0, scale: 0.85 });

      // 2. Coordinated sequence
      tl.to(cupWrapperRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: "back.out(1.2)",
      })
      .to(".annotation-item", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      }, "-=0.3")
      .to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      }, "-=0.35")
      .to(sublineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
      }, "-=0.25")
      .to(stampRef.current, {
        opacity: 0.9,
        scale: 1,
        rotation: -4,
        duration: 0.4,
        ease: "bounce.out",
      }, "-=0.2")
      .to(ctaContainerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: "back.out(1.4)",
      }, "-=0.15");

    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const handleStartInspection = () => {
    // Smooth transition into specimen tray
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
    <section
      ref={heroContainerRef}
      className="relative w-full max-w-5xl mx-auto px-4 pt-2 pb-4 flex flex-col items-center justify-between min-h-[96vh] md:min-h-[92vh]"
    >
      {/* ── TOP HEADER / MINIMAL EDITORIAL STRIP ──────────────────────── */}
      <header className="w-full flex items-center justify-between border-b border-dashed border-ink/20 pb-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta border border-ink" />
          <span className="font-technical font-bold text-xs sm:text-sm tracking-widest uppercase text-ink">
            CHAI BUBBLE LAB
          </span>
          <span className="hidden sm:inline font-handwritten text-base text-ink-faint ml-2">
            — Measure the unnecessary.
          </span>
        </div>

        <div ref={stampRef}>
          <StampUnnecessary />
        </div>
      </header>

      {/* ── HEADLINE AREA (CLEAN & ISOLATED) ──────────────────────────── */}
      <div className="text-center z-10 mt-1 mb-1 max-w-3xl">
        <div className="inline-block mb-0.5">
          <StampScientific />
        </div>
        <h1
          ref={headlineRef}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight"
        >
          How Bubbly Is Your Chai?
        </h1>
        <p
          ref={sublineRef}
          className="font-handwritten text-lg sm:text-xl md:text-2xl text-chai font-semibold mt-0.5"
        >
          A ridiculously serious inquiry into roadside froth dynamics.
        </p>
      </div>

      {/* ── CENTRAL CUP STAGE WITH LAB ANNOTATIONS SURROUNDING IT ─────── */}
      <div className="relative w-full max-w-xl flex items-center justify-center my-1 flex-1">
        {/* Scientific Annotations Overlay strictly surrounding the cup */}
        <LabAnnotations />

        {/* Central Illustrated Chai Cup */}
        <div ref={cupWrapperRef} className="relative z-10 w-full max-w-[200px] sm:max-w-[240px]">
          <ChaiCupIllustration />
        </div>
      </div>

      {/* Interactive hint */}
      <p className="font-technical text-[10px] text-ink-faint tracking-wider uppercase my-1">
        [ TIP: Click bubbles inside the foam to pop them ]
      </p>

      {/* ── BOTTOM HERO CTA (ALWAYS VISIBLE ABOVE THE FOLD) ───────────── */}
      <div ref={ctaContainerRef} className="z-20 mt-1 mb-2 flex flex-col items-center">
        <IllustratedButton
          id="btn-count-bubbles"
          onClick={handleStartInspection}
          size="md"
        >
          COUNT MY BUBBLES
        </IllustratedButton>
      </div>

      {/* ── MASCOT POSITIONED AT EXTREME RIGHT EDGE ─────────────────────── */}
      <div
        ref={mascotRef}
        className="absolute bottom-2 right-0 sm:right-1 md:right-2 z-30 flex flex-col items-end group cursor-pointer pointer-events-auto"
      >
        {/* Label Badge */}
        <div className="bg-paper border-2 border-ink px-3 py-1 rounded-xl shadow-sketch text-xs font-technical font-extrabold text-ink mb-1 transition-all group-hover:scale-105 group-hover:-translate-y-1">
          <span className="text-terracotta font-black">Useless Projects 3.0</span>
        </div>

        {/* Large Mascot Image */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 relative transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
          <img
            src="/mascot.png"
            alt="Useless Projects Mascot"
            className="w-full h-full object-contain drop-shadow-xl select-none"
          />
        </div>
      </div>
    </section>
  );
}
