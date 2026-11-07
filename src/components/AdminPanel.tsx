import { useState } from "react";
import { type Post } from "../types";
import { type NewPostInput } from "../api/posts";

interface AdminPanelProps {
  onAddPost: (input: NewPostInput) => Promise<void>;
  onClose: () => void;
}

/**
 * AdminPanel — create a journal post. Same Worker/D1 contract as before;
 * only the surface is new: bone paper, ruled fields, no glass.
 */
export default function AdminPanel({ onAddPost, onClose }: AdminPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [detectedType, setDetectedType] = useState<Post["type"]>("image");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "w-full border-b border-black/20 bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:opacity-30 focus:border-[#121110]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || saving) return;

    const trimmedUrl = mediaUrl.trim();
    if (trimmedUrl) {
      try {
        const url = new URL(trimmedUrl);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          setError("Media URL must start with http:// or https://");
          return;
        }
      } catch {
        setError("Please enter a valid media URL.");
        return;
      }
    }

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    setSaving(true);
    setError(null);
    try {
      await onAddPost({
        type: detectedType,
        title: title.trim(),
        description: description.trim() || "No description",
        tags,
        mediaUrl: trimmedUrl || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setTagsInput("");
    setMediaUrl("");
    setDetectedType("image");
    setSubmitted(false);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel"
    >
      <div className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden bg-[#f4f1ea] text-[#121110]">
        <div className="flex items-center justify-between border-b border-black/12 px-5 py-4">
          <p className="mono-label opacity-45">Journal — new entry</p>
          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none opacity-40 transition-opacity hover:opacity-90"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-start gap-4 p-7">
            <p className="font-display text-2xl">Published.</p>
            <p className="text-sm opacity-60">Your entry is live in the journal.</p>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={reset}
                className="border border-black/25 px-4 py-2.5 text-xs font-medium transition-colors hover:border-black/60"
              >
                Add another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#121110] px-4 py-2.5 text-xs font-medium text-[#f4f1ea]"
              >
                View journal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            <div>
              <label htmlFor="post-type" className="mono-label mb-1.5 block opacity-45">
                Media type
              </label>
              <select
                id="post-type"
                value={detectedType}
                onChange={(e) => setDetectedType(e.target.value as Post["type"])}
                className={field}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="music">Music</option>
              </select>
            </div>

            <div>
              <label htmlFor="post-title" className="mono-label mb-1.5 block opacity-45">
                Title
              </label>
              <input
                id="post-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a name…"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="post-media-url" className="mono-label mb-1.5 block opacity-45">
                Media URL
              </label>
              <input
                id="post-media-url"
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/file.jpg"
                className={field}
              />
              <p className="mt-1.5 text-[11px] opacity-45">
                Host the file first, then paste the direct URL.
              </p>
            </div>

            <div>
              <label htmlFor="post-desc" className="mono-label mb-1.5 block opacity-45">
                Caption
              </label>
              <textarea
                id="post-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What's this about…"
                className={`${field} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="post-tags" className="mono-label mb-1.5 block opacity-45">
                Tags — comma separated
              </label>
              <input
                id="post-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="music, ambient, night"
                className={field}
              />
            </div>

            {error && (
              <p className="border border-red-700/40 bg-red-700/5 px-3 py-2 text-xs text-red-800">{error}</p>
            )}

            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="mt-1 w-full bg-[#121110] py-3 text-sm font-medium text-[#f4f1ea] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Publishing…" : "Publish entry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
