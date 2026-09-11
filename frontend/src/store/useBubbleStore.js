/**
 * Zustand store for the bubble detection app.
 * Tracks: image, preview, loading, results, settings, error
 */
import { create } from "zustand";
import { analyzeImage } from "../services/api";

const useBubbleStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  image: null,       // File object
  preview: null,     // Object URL string
  loading: false,
  results: null,     // AnalysisResponse | null
  error: null,
  settings: {
    sensitivity: 5,
  },

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Set the image file and generate a preview URL */
  setImage: (file) => {
    const prev = get().preview;
    if (prev) URL.revokeObjectURL(prev);

    const preview = URL.createObjectURL(file);
    set({ image: file, preview, results: null, error: null });
  },

  /** Run analysis against the backend */
  analyze: async () => {
    const { image, settings } = get();
    if (!image) return;

    set({ loading: true, error: null, results: null });
    try {
      const results = await analyzeImage(image, settings.sensitivity);
      set({ results, loading: false });
    } catch (err) {
      set({ error: err.message || "Analysis failed.", loading: false });
    }
  },

  /** Update sensitivity setting */
  setSensitivity: (value) => {
    set((s) => ({ settings: { ...s.settings, sensitivity: value } }));
  },

  /** Reset everything */
  reset: () => {
    const prev = get().preview;
    if (prev) URL.revokeObjectURL(prev);
    set({ image: null, preview: null, loading: false, results: null, error: null });
  },
}));

export default useBubbleStore;
