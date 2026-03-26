"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";

const PLACEHOLDER = "https://www.youtube.com/@MrBeast";

const isValidYouTubeUrl = (value: string): boolean => {
  return /youtube\.com\/((@|c\/|user\/|channel\/)[\w.-]+)/.test(value.trim());
};

export default function ChannelInput() {
  const router = useRouter();
  const [url, setUrl]       = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please paste a YouTube channel URL.");
      return;
    }
    if (!isValidYouTubeUrl(trimmed)) {
      setError("That doesn't look like a valid YouTube channel URL. Try using the @handle format.");
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleAnalyze();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    if (error) setError("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      <label className="label-caps">YouTube Channel URL</label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-fog pointer-events-none"
          />
          <input
            type="url"
            value={url}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            className="input-base pl-10"
            disabled={loading}
            aria-label="YouTube channel URL input"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary shrink-0"
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose text-sm animate-fade-in">
          <AlertCircle size={14} strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-fog">
        Supports @handle, /channel/, /c/, and /user/ URL formats
      </p>
    </div>
  );
}