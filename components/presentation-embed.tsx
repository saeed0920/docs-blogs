"use client";

import { useRef, useState } from "react";
import { withBasePath } from "@/lib/shared";

export default function PresentationEmbed({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      ref={wrapRef}
      className="group relative w-full overflow-hidden rounded-xl border border-fd-border bg-fd-secondary shadow-sm not-prose"
      style={{ aspectRatio: isFullscreen ? undefined : "16/9" }}
    >
      <iframe
        src={withBasePath(src)}
        title={title}
        className="size-full border-0"
        allow="fullscreen"
      />
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        aria-pressed={isFullscreen}
        className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-lg border border-fd-border bg-fd-card/90 text-fd-foreground opacity-0 backdrop-blur transition-opacity duration-150 hover:text-fd-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fd-primary group-hover:opacity-100"
      >
        {isFullscreen ? (
          <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M136,72V32a8,8,0,0,1,16,0V64h32a8,8,0,0,1,0,16H144A8,8,0,0,1,136,72Zm-16,80H80a8,8,0,0,0,0,16h32v32a8,8,0,0,0,16,0V160A8,8,0,0,0,120,152Zm88-88H176V32a8,8,0,0,0-16,0V72a8,8,0,0,0,8,8h40a8,8,0,0,0,0-16ZM80,152H32a8,8,0,0,0,0,16H64v32a8,8,0,0,0,16,0V160A8,8,0,0,0,80,152Z" transform="rotate(90 128 128)" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M136,32h64a8,8,0,0,1,8,8V96a8,8,0,0,1-16,0V56.6L146.34,102.34a8,8,0,0,1-11.32-11.32L179.4,48H136a8,8,0,0,1,0-16ZM120,208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v39.4l45.66-45.68a8,8,0,0,1,11.32,11.32L67.32,192H112A8,8,0,0,1,120,200Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
