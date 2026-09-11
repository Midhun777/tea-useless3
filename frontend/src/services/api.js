/**
 * API service — communicates with the FastAPI backend.
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Analyze a chai foam image for bubbles.
 * @param {File} file - image file
 * @param {number} sensitivity - 1–10
 * @returns {Promise<AnalysisResponse>}
 */
export async function analyzeImage(file, sensitivity = 5) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sensitivity", String(sensitivity));

  const response = await fetch(`${API_BASE}/api/bubbles/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
