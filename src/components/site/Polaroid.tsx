"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { useLightbox } from "@/lib/lightbox-context";
import { Tape, type TapePlacement } from "./Tape";

export function Polaroid({
  src,
  alt,
  rotationDeg,
  height,
  unoptimized,
  tape,
  className = "",
  pendingLabel,
}: {
  src?: StaticImageData;
  alt: string;
  rotationDeg: number;
  height: number;
  unoptimized?: boolean;
  tape?: TapePlacement;
  className?: string;
  /** Set instead of `src` when the source file isn't usable yet (e.g. still awaiting re-export) — renders a labeled placeholder in the same frame instead of a broken image. */
  pendingLabel?: string;
}) {
  const { open } = useLightbox();

  return (
    <div
      className={`polaroid relative bg-white p-2 sm:p-3 border border-border-light shadow-[0_10px_24px_rgba(32,27,22,.12)] ${className}`}
      style={{ "--rotate": `${rotationDeg}deg` } as CSSProperties}
    >
      {src ? (
        <button
          type="button"
          onClick={() => open(src.src, alt)}
          className="block w-full cursor-zoom-in"
          aria-label={`Open larger view: ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            unoptimized={unoptimized}
            style={{ width: "100%", height, objectFit: "cover" }}
          />
        </button>
      ) : (
        <div
          className="flex items-center justify-center text-center px-3"
          style={{
            height,
            backgroundImage: "repeating-linear-gradient(135deg, #EAE0D0 0 7px, #F2EAE0 7px 14px)",
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted bg-bg px-2 py-1">
            {pendingLabel ?? "Photo pending"}
          </span>
        </div>
      )}
      {tape && <Tape placement={tape} />}
    </div>
  );
}
