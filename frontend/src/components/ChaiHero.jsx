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
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center min-h-[88vh] gap-4 sm:gap-6"
    >

      {/* ── HEADLINE AREA (EXPANDED & PROMINENT) ──────────────────────────── */}
      <div className="text-center z-10 max-w-4xl space-y-2">
        <div ref={stampRef} className="inline-block mb-1">
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
          className="font-handwritten text-2xl sm:text-3xl md:text-4xl text-chai font-semibold"
        >
          A ridiculously serious inquiry into roadside froth dynamics.
        </p>
      </div>

      {/* ── CENTRAL CUP STAGE (EXPANDED DUAL SCALE) ──────────────────── */}
      <div className="relative w-full max-w-3xl flex items-center justify-center my-2 sm:my-4 flex-1">
        {/* Scientific Annotations Overlay strictly surrounding the cup */}
        <LabAnnotations />

        {/* Central Illustrated Chai Cup */}
        <div ref={cupWrapperRef} className="relative z-10 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px]">
          <ChaiCupIllustration />
        </div>
      </div>

      {/* Interactive hint */}
      <p className="font-technical text-xs text-ink-faint tracking-wider uppercase">
        [ TIP: Click bubbles inside the foam to pop them ]
      </p>

      {/* ── BOTTOM HERO CTA (EXPANDED PROMINENT CTA) ─────────────────── */}
      <div ref={ctaContainerRef} className="z-20 mt-1 mb-2 flex flex-col items-center">
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
