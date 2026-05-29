import { useRef, useState } from "react";

type VideoTileProps = {
  src: string;
  title: string;
  poster?: string;
};

export function VideoTile({ src, title, poster }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playOnce = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setIsPlaying(true);
    void video.play();
  };

  const resetPreview = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <button
      type="button"
      onClick={playOnce}
      className="group relative h-full w-full overflow-hidden bg-black text-left"
      aria-label={`Play ${title}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        muted
        playsInline
        onEnded={resetPreview}
        className="h-full w-full object-cover"
        aria-label={title}
      />

      <span className="pointer-events-none absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-2xl backdrop-blur-sm transition-transform group-hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
            <path d="M8 5.14v13.72c0 .77.84 1.25 1.5.85l10.95-6.86a1 1 0 0 0 0-1.7L9.5 4.29A1 1 0 0 0 8 5.14Z" />
          </svg>
        </span>
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3">
        <span className="block text-xs font-mono uppercase tracking-[0.18em] text-white/55">Trajectory preview</span>
      </span>
    </button>
  );
}
