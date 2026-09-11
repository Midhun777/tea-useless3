import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MascotPopup() {
  const mascotRef = useRef(null);

  useEffect(() => {
    if (!mascotRef.current) return;

    // Set initial state: hidden below viewport corner
    gsap.set(mascotRef.current, {
      scale: 0,
      opacity: 0,
      y: 40,
      transformOrigin: "bottom right",
    });

    // Create 10-second repeating popup timeline
    const mascotTl = gsap.timeline({ repeat: -1, repeatDelay: 10 });

    mascotTl
      .to(mascotRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 1.5, // Initial pop up 1.5s after page load
      })
      .to(mascotRef.current, {
        scale: 1,
        duration: 4.0, // Stays visible for 4 seconds
      })
      .to(mascotRef.current, {
        scale: 0,
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: "back.in(1.4)",
      });

    return () => mascotTl.kill();
  }, []);

  return (
    <div
      ref={mascotRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto cursor-pointer group"
    >
      {/* Label Badge */}
      <div className="bg-paper border-2 border-ink px-3 py-1 rounded-xl shadow-sketch text-xs font-technical font-extrabold text-ink mb-1 transition-all group-hover:scale-105 group-hover:-translate-y-1">
        <span className="text-terracotta font-black">Useless Projects 3.0</span>
      </div>

      {/* Mascot Graphic */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 relative transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
        <img
          src="/mascot.png"
          alt="Useless Projects Mascot"
          className="w-full h-full object-contain drop-shadow-2xl select-none"
        />
      </div>
    </div>
  );
}
