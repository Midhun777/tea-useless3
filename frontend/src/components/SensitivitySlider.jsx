/**
 * SensitivitySlider — adjusts how aggressively bubbles are detected (1–10).
 */
import useBubbleStore from "../store/useBubbleStore";

const LABELS = {
  1: "Very conservative",
  3: "Conservative",
  5: "Balanced",
  7: "Aggressive",
  10: "Maximum",
};

export default function SensitivitySlider() {
  const sensitivity = useBubbleStore((s) => s.settings.sensitivity);
  const setSensitivity = useBubbleStore((s) => s.setSensitivity);

  const label = LABELS[sensitivity] ||
    (sensitivity <= 2 ? "Conservative" : sensitivity <= 6 ? "Balanced" : "Aggressive");

  const progress = `${((sensitivity - 1) / 9) * 100}%`;

  return (
    <div className="flex flex-col gap-2" id="sensitivity-control">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-brand-300" htmlFor="sensitivity-slider">
          Detection Sensitivity
        </label>
        <span className="text-sm font-semibold text-brand-400">
          {sensitivity} — <span className="text-brand-500 font-normal">{label}</span>
        </span>
      </div>

      <div className="relative">
        <input
          id="sensitivity-slider"
          type="range"
          min={1}
          max={10}
          step={1}
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="sensitivity-track w-full"
          style={{ "--progress": progress }}
        />
      </div>

      <div className="flex justify-between text-xs text-brand-600 px-0.5 select-none">
        <span>Fewer, precise</span>
        <span>More, inclusive</span>
      </div>
    </div>
  );
}
