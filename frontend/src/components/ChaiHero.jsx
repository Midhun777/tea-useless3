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
 * 5. Scientific annotation lines draw themselves
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Initial states
      gsap.set(cupWrapperRef.current, { scale: 0.85, opacity: 0, y: 30 });
      gsap.set(headlineRef.current, { opacity: 0, y: 25 });
      gsap.set(sublineRef.current, { opacity: 0, y: 15 });
      gsap.set(ctaContainerRef.current, { opacity: 0, scale: 0.9, y: 20 });
      gsap.set(stampRef.current, { opacity: 0, scale: 1.4, rotation: -12 });
      gsap.set(".annotation-item", { opacity: 0, scale: 0.85 });

      // 2. Coordinated sequence
      tl.to(cupWrapperRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: "back.out(1.2)",
      })
      .to(".annotation-item", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.18,
        ease: "power2.out",
      }, "-=0.4")
      .to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5")
      .to(sublineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, "-=0.4")
      .to(stampRef.current, {
        opacity: 0.9,
        scale: 1,
        rotation: -4,
        duration: 0.5,
        ease: "bounce.out",
      }, "-=0.3")
      .to(ctaContainerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.4)",
      }, "-=0.2");

    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const handleStartInspection = () => {
    // Smooth transition into specimen tray
    gsap.to(heroContainerRef.current, {
      opacity: 0,
      y: -25,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        setStage("tray");
      },
    });
  };

  return (
    <section
      ref={heroContainerRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-between px-4 py-8 max-w-5xl mx-auto overflow-hidden"
    >
      {/* ── TOP HEADER / MINIMAL EDITORIAL STRIP ──────────────────────── */}
      <header className="w-full flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-terracotta border border-ink" />
          <span className="font-technical font-bold text-sm tracking-widest uppercase text-ink">
            CHAI BUBBLE LAB
          </span>
          <span className="hidden sm:inline font-handwritten text-lg text-ink-faint ml-2">
            — Measure the unnecessary.
          </span>
        </div>

        <div ref={stampRef}>
          <StampUnnecessary />
        </div>
      </header>

      {/* ── CENTRAL HERO STAGE ────────────────────────────────────────── */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-4">
        {/* Scientific Annotations Overlay */}
        <LabAnnotations />

        {/* Hero Headline */}
        <div className="text-center z-10 mb-2">
          <div className="inline-block mb-1">
            <StampScientific />
          </div>
          <h1
            ref={headlineRef}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-tight"
          >
            How Bubbly Is Your Chai?
          </h1>
          <p
            ref={sublineRef}
            className="font-handwritten text-2xl sm:text-3xl text-chai font-semibold mt-1"
          >
            A ridiculously serious inquiry into roadside froth dynamics.
          </p>
        </div>

        {/* Central Illustrated Chai Cup */}
        <div ref={cupWrapperRef} className="relative z-0 w-full max-w-[360px] sm:max-w-[420px] my-1">
          <ChaiCupIllustration />
        </div>

        {/* Interactive hint */}
        <p className="font-technical text-[11px] text-ink-faint tracking-wider uppercase mt-1">
          [ TIP: Click bubbles inside the foam to pop them ]
        </p>
      </div>

      {/* ── BOTTOM HERO CTA ───────────────────────────────────────────── */}
      <div ref={ctaContainerRef} className="z-10 mt-6 mb-2 flex flex-col items-center">
        <IllustratedButton
          id="btn-count-bubbles"
          onClick={handleStartInspection}
          size="lg"
        >
          COUNT MY BUBBLES
        </IllustratedButton>
      </div>
    </section>
  );
}
