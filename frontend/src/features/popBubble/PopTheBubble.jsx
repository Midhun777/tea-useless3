import React from "react";
import GameCanvas from "./GameCanvas";

export default function PopTheBubble() {
  return (
    <section className="relative min-h-[85vh] p-3 md:p-6 w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
      <GameCanvas />
    </section>
  );
}
