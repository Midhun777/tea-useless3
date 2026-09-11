/**
 * BubbleCanvas — draws detection overlay on top of the preview image.
 * Small = blue, Medium = amber, Large = red
 */
import { useEffect, useRef, useCallback } from "react";
import useBubbleStore from "../store/useBubbleStore";

const SIZE_COLORS = {
  small:  { stroke: "#60a5fa", fill: "rgba(96,165,250,0.12)",  label: "#93c5fd" },
  medium: { stroke: "#fbbf24", fill: "rgba(251,191,36,0.12)",  label: "#fcd34d" },
  large:  { stroke: "#f87171", fill: "rgba(248,113,113,0.12)", label: "#fca5a5" },
};

export default function BubbleCanvas() {
  const { preview, results } = useBubbleStore();
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !results) return;

    const { naturalWidth: nw, naturalHeight: nh } = img;
    const { width: dw, height: dh } = img.getBoundingClientRect();

    canvas.width = dw;
    canvas.height = dh;

    const scaleX = dw / nw;
    const scaleY = dh / nh;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, dw, dh);

    results.bubbles.forEach((b) => {
      const cx = b.x * scaleX;
      const cy = b.y * scaleY;
      const r = b.radius * Math.min(scaleX, scaleY);

      const colors = SIZE_COLORS[b.size] || SIZE_COLORS.medium;

      // Fill
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill;
      ctx.fill();

      // Stroke
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Confidence label (only for medium and large to reduce clutter)
      if (b.size !== "small" || r > 14) {
        const label = `${Math.round(b.confidence * 100)}%`;
        ctx.font = `bold ${Math.max(9, Math.min(14, r * 0.7))}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = colors.label;
        ctx.fillText(label, cx, cy);
      }
    });
  }, [results]);

  useEffect(() => {
    if (!preview || !results) return;
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth) {
      draw();
    } else {
      img.onload = draw;
    }

    const ro = new ResizeObserver(draw);
    ro.observe(img);
    return () => ro.disconnect();
  }, [preview, results, draw]);

  if (!preview) return null;

  return (
    <div className="relative w-full animate-fade-in" id="canvas-container">
      <img
        ref={imgRef}
        src={preview}
        alt="Chai foam"
        className="w-full rounded-2xl object-contain max-h-96"
      />
      {results && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
