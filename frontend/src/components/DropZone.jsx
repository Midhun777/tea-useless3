/**
 * DropZone — drag & drop or click-to-upload image area.
 */
import { useRef, useState, useCallback } from "react";
import useBubbleStore from "../store/useBubbleStore";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function DropZone() {
  const { setImage, preview } = useBubbleStore();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      setImage(file);
    },
    [setImage]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onClick = () => inputRef.current?.click();

  const onFileChange = (e) => handleFile(e.target.files?.[0]);

  return (
    <div
      id="drop-zone"
      className={`drop-zone min-h-[200px] flex flex-col items-center justify-center gap-4 p-8 select-none
        ${dragging ? "drop-zone-active" : ""}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={preview ? undefined : onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !preview && onClick()}
      aria-label="Image upload drop zone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={onFileChange}
        id="file-input"
      />

      {preview ? (
        <div className="w-full flex flex-col items-center gap-3">
          <img
            src={preview}
            alt="Chai foam preview"
            className="max-h-80 w-full object-contain rounded-xl"
          />
          <button
            className="btn-ghost text-sm mt-1"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            id="change-image-btn"
          >
            Change image
          </button>
        </div>
      ) : (
        <>
          {/* Upload icon */}
          <div className="w-16 h-16 rounded-2xl bg-brand-800/40 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4-8 4 8m4-4l2-4 2 4M3 20h18M12 4v8"
              />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-brand-200 font-semibold text-lg">
              Drop your chai image here
            </p>
            <p className="text-brand-500 text-sm mt-1">
              or click to browse · JPEG, PNG, WebP
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {["Small bubbles", "Large bubbles", "Low contrast"].map((t) => (
              <span
                key={t}
                className="text-xs bg-brand-900/60 text-brand-400 px-3 py-1 rounded-full border border-brand-800/50"
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
