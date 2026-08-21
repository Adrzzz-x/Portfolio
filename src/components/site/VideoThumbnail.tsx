"use client";

import { useState, type CSSProperties } from "react";
import { VideoModal } from "./VideoModal";

export function VideoThumbnail({
  posterSrc,
  videoSrc,
  alt,
  rotationDeg,
  height,
  className = "",
}: {
  posterSrc: string;
  videoSrc: string;
  alt: string;
  rotationDeg: number;
  height: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`polaroid relative bg-white p-2 sm:p-3 border border-border-light shadow-[0_10px_24px_rgba(32,27,22,.12)] ${className}`}
        style={{ "--rotate": `${rotationDeg}deg` } as CSSProperties}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full cursor-pointer bg-text overflow-hidden"
          style={{ height }}
          aria-label={`Play video: ${alt}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static poster frame, not optimized */}
          <img
            src={posterSrc}
            alt={alt}
            style={{ width: "100%", height, objectFit: "cover", display: "block" }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-bg/[.92] shadow-[0_4px_14px_rgba(32,27,22,.3)]">
              <span
                className="ml-1"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "13px solid #201B16",
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                }}
              />
            </span>
          </span>
        </button>
      </div>
      <VideoModal open={open} onOpenChange={setOpen} videoSrc={videoSrc} posterSrc={posterSrc} />
    </>
  );
}
