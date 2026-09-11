/**
 * HomePage — main page assembling all components.
 */
import useBubbleStore from "../store/useBubbleStore";
import DropZone from "../components/DropZone";
import BubbleCanvas from "../components/BubbleCanvas";
import CountPanel from "../components/CountPanel";
import SensitivitySlider from "../components/SensitivitySlider";
import StatusBar from "../components/StatusBar";
import Legend from "../components/Legend";

export default function HomePage() {
  const { image, loading, results, analyze, reset } = useBubbleStore();

  return (
    <div className="min-h-screen bg-foam-gradient flex flex-col items-center px-4 py-10 gap-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="text-center max-w-xl animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-brand-900/60 border border-brand-700/40 rounded-full px-4 py-1.5 text-xs text-brand-400 font-medium mb-4">
          <span>🫧</span> Classical OpenCV · No ML Required
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-100 leading-tight">
          Chai Bubble
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
            {" "}Detector
          </span>
        </h1>
        <p className="text-brand-500 mt-3 text-base max-w-md mx-auto">
          Upload a chai foam image. We'll detect and classify every bubble —
          small, medium, and large — using Hough circles, contours, and edge detection.
        </p>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-5">
        {/* ── Upload / Canvas Card ─────────────────────────────────────── */}
        <div className="glass-card p-5 flex flex-col gap-4">
          {results ? (
            <>
              <BubbleCanvas />
              {results.bubbles.length > 0 && <Legend />}
            </>
          ) : (
            <DropZone />
          )}
        </div>

        {/* ── Settings Card ────────────────────────────────────────────── */}
        <div className="glass-card p-5 flex flex-col gap-5">
          <SensitivitySlider />

          <div className="flex gap-3 flex-wrap">
            <button
              id="analyze-btn"
              className="btn-primary flex-1"
              onClick={analyze}
              disabled={!image || loading}
            >
              {loading ? "Analysing…" : results ? "Re-analyse" : "Analyse Bubbles"}
            </button>

            {(image || results) && (
              <button
                id="reset-btn"
                className="btn-ghost"
                onClick={reset}
                disabled={loading}
              >
                Reset
              </button>
            )}
          </div>

          <StatusBar />
        </div>

        {/* ── Results Card ─────────────────────────────────────────────── */}
        {results && <CountPanel />}

        {/* ── Pipeline info strip ──────────────────────────────────────── */}
        {!results && (
          <div className="glass-card p-4 animate-fade-in">
            <p className="text-xs text-brand-600 text-center font-medium tracking-wide uppercase mb-3">
              Detection Pipeline
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Grayscale + CLAHE",
                "ROI Detection",
                "Hough Circles",
                "Contour Analysis",
                "Canny Edges",
                "NMS Merge",
                "Validation",
                "Size Classification",
              ].map((step, i) => (
                <span
                  key={step}
                  className="text-xs bg-surface-200/60 text-brand-500 px-2.5 py-1 rounded-full border border-brand-800/30"
                >
                  <span className="text-brand-700 mr-1">{i + 1}.</span>
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-xs text-brand-700 text-center pb-2">
        Classical computer vision · No trained models · OpenCV {" "}
        <span className="text-brand-600">HoughCircles + Contours + Canny</span>
      </footer>
    </div>
  );
}
