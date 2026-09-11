/**
 * CountPanel — displays total/small/medium/large bubble counts.
 */
import useBubbleStore from "../store/useBubbleStore";

const CARDS = [
  { key: "total",  label: "Total",  icon: "🫧", bg: "bg-surface-100", border: "border-brand-700/40", text: "text-brand-200" },
  { key: "small",  label: "Small",  icon: "·",  bg: "bg-blue-950/40",  border: "border-blue-700/40",  text: "text-blue-300"  },
  { key: "medium", label: "Medium", icon: "○",  bg: "bg-amber-950/40", border: "border-amber-700/40", text: "text-amber-300" },
  { key: "large",  label: "Large",  icon: "◯",  bg: "bg-red-950/40",   border: "border-red-700/40",   text: "text-red-300"   },
];

export default function CountPanel() {
  const results = useBubbleStore((s) => s.results);

  if (!results) return null;

  return (
    <div className="grid grid-cols-4 gap-3 animate-slide-up" id="count-panel">
      {CARDS.map(({ key, label, icon, bg, border, text }) => (
        <div
          key={key}
          className={`count-badge ${bg} border ${border} rounded-2xl py-5 px-3`}
          id={`count-${key}`}
        >
          <span className="text-2xl mb-1">{icon}</span>
          <span className={`text-3xl font-bold tabular-nums ${text}`}>
            {results.count[key] ?? 0}
          </span>
          <span className="text-xs text-brand-500 mt-1 uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
