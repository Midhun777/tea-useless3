// Concentric chai surface ripple animation system

export class RippleSystem {
  constructor() {
    this.ripples = [];
  }

  reset() {
    this.ripples = [];
  }

  spawnRipple(x, y, maxRadius = 60, color = "rgba(255, 235, 205, 0.4)") {
    this.ripples.push({
      x,
      y,
      radius: 5,
      maxRadius,
      speed: 2.5 + Math.random() * 1.5,
      alpha: 0.8,
      decay: 0.02,
      color,
    });
  }

  update(dt = 1) {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed * dt;
      r.alpha -= r.decay * dt;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.ripples.length; i++) {
      const r = this.ripples[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
