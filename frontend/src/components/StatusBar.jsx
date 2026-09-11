/**
 * StatusBar — loading spinner and error display.
 */
import useBubbleStore from "../store/useBubbleStore";

export default function StatusBar() {
  const loading = useBubbleStore((s) => s.loading);
  const error = useBubbleStore((s) => s.error);

  if (!loading && !error) return null;

  return (
    <div className="animate-fade-in" id="status-bar">
      {loading && (
        <div className="flex items-center gap-3 bg-brand-900/50 border border-brand-700/40 rounded-xl px-4 py-3">
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-brand-400 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 00-8 8h4z"
            />
          </svg>
          <span className="text-brand-300 text-sm font-medium">
            Running bubble detection pipeline…
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-950/50 border border-red-700/40 rounded-xl px-4 py-3">
          <span className="text-red-400 text-lg shrink-0">⚠</span>
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
