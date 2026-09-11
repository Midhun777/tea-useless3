// Simplified Endless Time-Wasting Bubble Popper Engine

import { Bubble } from "./Bubble";
import { BUBBLE_TYPES } from "./BubbleTypes";
import { ParticleSystem } from "./ParticleSystem";
import { RippleSystem } from "./RippleSystem";
import { sounds } from "./SoundEffects";

export class GameEngine {
  constructor() {
    this.canvasWidth = 800;
    this.canvasHeight = 600;

    this.bubbles = [];
    this.particleSystem = new ParticleSystem();
    this.rippleSystem = new RippleSystem();

    this.popsTotal = 0;
    this.timeWastedSeconds = 0;
    this.timeWastedTimer = null;

    this.spawnTimer = 0;
    this.spawnInterval = 30; // Spawns new bubble every ~0.5s

    this.customProfile = null;
  }

  init(width, height, customProfile = null) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.customProfile = customProfile;

    this.popsTotal = 0;
    this.timeWastedSeconds = 0;
    this.bubbles = [];
    this.particleSystem.reset();
    this.rippleSystem.reset();

    // Start time wasted counter
    if (this.timeWastedTimer) clearInterval(this.timeWastedTimer);
    this.timeWastedTimer = setInterval(() => {
      this.timeWastedSeconds += 1;
    }, 1000);

    // Seed initial batch of bubbles
    if (this.customProfile && this.customProfile.summary) {
      this.seedSpecimenBubbles();
    } else {
      this.seedInitialBubbles(18);
    }
  }

  seedInitialBubbles(count) {
    for (let i = 0; i < count; i++) {
      const x = 50 + Math.random() * (this.canvasWidth - 100);
      const y = 80 + Math.random() * (this.canvasHeight - 160);
      this.bubbles.push(new Bubble(x, y, BUBBLE_TYPES.NORMAL));
    }
  }

  seedSpecimenBubbles() {
    const counts = this.customProfile.summary.counts || {};
    const total = (counts.small || 10) + (counts.medium || 5) + (counts.large || 3);
    const numToSeed = Math.min(total, 30);

    for (let i = 0; i < numToSeed; i++) {
      const x = 60 + Math.random() * (this.canvasWidth - 120);
      const y = 80 + Math.random() * (this.canvasHeight - 160);
      
      let customR = null;
      let type = BUBBLE_TYPES.NORMAL;
      if (i % 6 === 0) type = BUBBLE_TYPES.GOLDEN;
      else if (i % 4 === 0) type = BUBBLE_TYPES.SPEED;

      if (i < (counts.large || 2)) customR = 42 + Math.random() * 15;
      else if (i < (counts.large || 2) + (counts.medium || 5)) customR = 24 + Math.random() * 10;
      else customR = 14 + Math.random() * 8;

      this.bubbles.push(new Bubble(x, y, type, customR));
    }
  }

  stopTimer() {
    if (this.timeWastedTimer) {
      clearInterval(this.timeWastedTimer);
      this.timeWastedTimer = null;
    }
  }

  handlePointerDown(px, py) {
    this.rippleSystem.spawnRipple(px, py, 45, "rgba(255, 245, 230, 0.45)");

    // Check hit test against bubbles (top-most first)
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      if (bubble.containsPoint(px, py)) {
        const fullyPopped = bubble.hit();

        if (fullyPopped) {
          this.popsTotal += 1;

          if (bubble.type === BUBBLE_TYPES.GOLDEN) {
            sounds.playGoldenPop();
            this.particleSystem.spawnBurst(bubble.x, bubble.y, "#FFD700", 20, 1.3);
            this.particleSystem.spawnText(bubble.x, bubble.y, "POP! ✨", "#FFD700", 22);
          } else {
            sounds.playPop(0.85 + Math.random() * 0.4);
            this.particleSystem.spawnBurst(bubble.x, bubble.y, bubble.config.borderColor, 12, 1.0);
            this.particleSystem.spawnText(bubble.x, bubble.y, "POP!", "#FFFFFF", 18);
          }

          this.rippleSystem.spawnRipple(bubble.x, bubble.y, bubble.radius * 2.0);
        } else {
          sounds.playMegaHit();
          this.particleSystem.spawnBurst(bubble.x, bubble.y, "rgba(255, 200, 150, 0.7)", 6, 0.6);
        }

        break; // Only pop top bubble per click
      }
    }
  }

  refillCup() {
    this.bubbles = [];
    this.seedInitialBubbles(20);
    sounds.playClusterPop();
  }

  update(dt = 1) {
    // Update active bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.update(dt, this.canvasWidth, this.canvasHeight);

      // Remove bubbles floating off top or popped
      if (b.y + b.radius < -20 || b.isPopped) {
        this.bubbles.splice(i, 1);
      }
    }

    // Continuous spawn to keep cup filled with floating bubbles
    this.spawnTimer += 1;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      if (this.bubbles.length < 28) {
        const x = 50 + Math.random() * (this.canvasWidth - 100);
        const y = this.canvasHeight + 30;
        const types = [BUBBLE_TYPES.NORMAL, BUBBLE_TYPES.NORMAL, BUBBLE_TYPES.SPEED, BUBBLE_TYPES.GOLDEN];
        const type = types[Math.floor(Math.random() * types.length)];
        this.bubbles.push(new Bubble(x, y, type));
      }
    }

    this.particleSystem.update(dt);
    this.rippleSystem.update(dt);
  }

  draw(ctx) {
    this.rippleSystem.draw(ctx);

    for (let i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].draw(ctx);
    }

    this.particleSystem.draw(ctx);
  }

  getFormattedTimeWasted() {
    const mins = Math.floor(this.timeWastedSeconds / 60);
    const secs = this.timeWastedSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}
