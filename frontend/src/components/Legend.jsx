/**
 * Legend — small key for bubble colour coding.
 */
export default function Legend() {
  const ITEMS = [
    { color: "bg-blue-400",  label: "Small bubbles"  },
    { color: "bg-amber-400", label: "Medium bubbles" },
    { color: "bg-red-400",   label: "Large bubbles"  },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center" id="legend">
      {ITEMS.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${color} opacity-80`} />
          <span className="text-xs text-brand-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
