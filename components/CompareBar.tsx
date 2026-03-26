'use client';

import { useState } from 'react';
import { GitCompare, AlertCircle, X } from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';

const isValidYouTubeUrl = (value: string): boolean => {
  return /youtube\.com\/((@|c\/|user\/|channel\/)[\w.-]+)/.test(value.trim());
};

export default function CompareBar() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const {
    compare,
    compareLoading,
    setCompare,
    setCompareLoading,
    addToCompare,
    setError: setStoreError,
  } = useVideoStore();

  const handleCompare = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please paste a second channel URL.');
      return;
    }
    if (!isValidYouTubeUrl(trimmed)) {
      setError("That doesn't look like a valid YouTube channel URL.");
      return;
    }

    setError('');
    setCompareLoading(true);

    try {
      const channelRes = await fetch(
        `/api/channel?url=${encodeURIComponent(trimmed)}`,
      );
      const channelData = await channelRes.json();
      if (!channelRes.ok)
        throw new Error(channelData.error ?? 'Failed to fetch channel');

      const videosRes = await fetch(`/api/videos?channelId=${channelData.id}`);
      const videosData = await videosRes.json();
      if (!videosRes.ok)
        throw new Error(videosData.error ?? 'Failed to fetch videos');

      addToCompare({
        id: channelData.id,
        title: channelData.title,
        channel: channelData,
        videos: videosData,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setStoreError(message);
      setError(message);
    } finally {
      setCompareLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError('');
    setCompare([]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    if (error) setError('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleCompare();
  };

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <GitCompare
          size={16}
          className="text-forest dark:text-grove"
          strokeWidth={2}
        />
        <h2 className="section-title">Compare with Another Channel</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste competitor channel URL..."
          className="input-base text-sm"
          disabled={compareLoading}
        />

        {compare.length > 0 ?
          <button
            onClick={handleClear}
            className="btn-ghost shrink-0 flex items-center gap-2">
            <X size={14} strokeWidth={2} />
            Clear
          </button>
        : <button
            onClick={handleCompare}
            disabled={compareLoading}
            className="btn-primary shrink-0">
            {compareLoading ? 'Loading...' : 'Compare'}
          </button>
        }
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose text-sm animate-fade-in">
          <AlertCircle size={14} strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
