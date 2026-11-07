import { useState, useRef, useEffect } from "react";

interface LoginModalProps {
  onLogin: (password: string) => boolean | Promise<boolean>;
  onClose: () => void;
}

/** Admin sign-in — bone paper card, typewriter labels. */
export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const ok = await onLogin(password);
      if (!ok) {
        setError(true);
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Admin sign in"
    >
      <div className="w-full max-w-sm overflow-hidden bg-[#f4f1ea] text-[#121110]">
        <div className="flex items-center justify-between border-b border-black/12 px-5 py-4">
          <p className="mono-label opacity-45">Admin</p>
          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none opacity-40 transition-opacity hover:opacity-90"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <h2 className="font-display text-2xl leading-tight">Sign in</h2>
          <p className="mt-1.5 text-xs leading-relaxed opacity-55">
            Enter the studio password to manage journal entries.
          </p>

          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoComplete="current-password"
            className={`mt-5 w-full border-b bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:opacity-30 ${
              error ? "border-red-600" : "border-black/25 focus:border-[#121110]"
            }`}
          />
          {error && <p className="mt-2 text-xs text-red-700">Incorrect password or unreachable server.</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#121110] py-3 text-sm font-medium text-[#f4f1ea] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
