// Bubble entity class with smooth fluid float physics, wobble, and multi-layer gradient rendering

import { BUBBLE_CONFIGS, BUBBLE_TYPES } from "./BubbleTypes";

export class Bubble {
  constructor(x, y, type = BUBBLE_TYPES.NORMAL, customRadius = null) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.type = type;
    this.config = BUBBLE_CONFIGS[type] || BUBBLE_CONFIGS[BUBBLE_TYPES.NORMAL];

    // Radius determination
    const [minR, maxR] = this.config.radiusRange;
    this.radius = customRadius || minR + Math.random() * (maxR - minR);

    // Multi-hit setup (e.g. MEGA bubble requires 3 pops)
    this.maxHits = this.config.maxHits;
    this.hitsRemaining = this.maxHits;

    // Movement velocity & float dynamics
    const speed = (0.8 + Math.random() * 1.2) * this.config.speedMultiplier;
    this.vx = (Math.random() - 0.5) * 0.8 * speed;
    this.vy = -speed; // Rises upwards toward surface

    // Fluid organic wobble parameters
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.03 + Math.random() * 0.03;
    this.wobbleAmp = 2.0 + Math.random() * 3.0;

    // Hit pulse / pop animation state
    this.hitPulse = 0;
    this.isPopped = false;
  }

  update(dt = 1, boundsWidth, boundsHeight) {
    if (this.isPopped) return;

    // Wobble displacement
    this.wobblePhase += this.wobbleSpeed * dt;
    const wobbleX = Math.sin(this.wobblePhase) * this.wobbleAmp;

    this.x += (this.vx + wobbleX * 0.15) * dt;
    this.y += this.vy * dt;

    // Decay hit pulse visual feedback
    if (this.hitPulse > 0) {
      this.hitPulse -= 0.1 * dt;
    }

    // Horizontal boundary bounce
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x + this.radius > boundsWidth) {
      this.x = boundsWidth - this.radius;
      this.vx *= -1;
    }
  }

  // Check hit test given pointer coordinates
  containsPoint(px, py) {
    if (this.isPopped) return false;
    const dx = px - this.x;
    const dy = py - this.y;
    const hitRadius = this.radius + 8; // Slightly generous touch box
    return dx * dx + dy * dy <= hitRadius * hitRadius;
  }

  // Handle hit
  hit() {
    this.hitsRemaining -= 1;
    this.hitPulse = 1.0;
    if (this.hitsRemaining <= 0) {
      this.isPopped = true;
      return true; // Fully popped
    }
    return false; // Damaged but not popped yet
  }

  draw(ctx) {
    if (this.isPopped) return;

    ctx.save();

    // Calculate current visual scale with wobble deformation and hit pulse
    const wobbleScaleX = 1 + Math.sin(this.wobblePhase) * 0.05 + this.hitPulse * 0.15;
    const wobbleScaleY = 1 + Math.cos(this.wobblePhase) * 0.05 - this.hitPulse * 0.1;
    const r = this.radius;

    ctx.translate(this.x, this.y);
    ctx.scale(wobbleScaleX, wobbleScaleY);

    // 1. Outer Glow (for special bubbles)
    if (this.config.glowColor) {
      ctx.shadowColor = this.config.glowColor;
      ctx.shadowBlur = 14;
    }

    // 2. Radial Gradient Fill
    const fillGradient = ctx.createRadialGradient(
      -r * 0.3,
      -r * 0.3,
      r * 0.1,
      0,
      0,
      r
    );
    fillGradient.addColorStop(0, this.config.fillGradient[0]);
    fillGradient.addColorStop(1, this.config.fillGradient[1]);

    ctx.fillStyle = fillGradient;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 3. Rim Border
    ctx.strokeStyle = this.config.borderColor;
    ctx.lineWidth = Math.max(1.5, r * 0.06);
    ctx.stroke();

    // Reset shadow after body fill
    ctx.shadowBlur = 0;

    // 4. Specular Highlight Curved Crescent
    ctx.fillStyle = this.config.highlightColor;
    ctx.beginPath();
    ctx.arc(-r * 0.32, -r * 0.32, r * 0.24, 0, Math.PI * 2);
    ctx.fill();

    // Secondary subtle rim reflection
    ctx.beginPath();
    ctx.arc(r * 0.3, r * 0.3, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fill();

    // 5. Multi-hit crack overlays for Mega bubble
    if (this.maxHits > 1 && this.hitsRemaining < this.maxHits) {
      const damagePercent = (this.maxHits - this.hitsRemaining) / this.maxHits;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.4, -r * 0.2);
      ctx.lineTo(0, 0);
      ctx.lineTo(-r * 0.2, r * 0.4);

      if (damagePercent >= 0.5) {
        ctx.moveTo(r * 0.3, -r * 0.3);
        ctx.lineTo(0, 0);
        ctx.lineTo(r * 0.4, r * 0.2);
      }
      ctx.stroke();
    }

    // 6. Cluster icon hint for cluster bubble
    if (this.type === BUBBLE_TYPES.CLUSTER) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `bold ${Math.round(r * 0.6)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💥", 0, 2);
    }

    // 7. Toxic icon hint
    if (this.type === BUBBLE_TYPES.TOXIC) {
      ctx.fillStyle = "rgba(255, 100, 100, 0.9)";
      ctx.font = `bold ${Math.round(r * 0.55)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚠️", 0, 2);
    }

    ctx.restore();
  }
}
