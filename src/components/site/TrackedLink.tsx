"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * An anchor that reports a custom Vercel Analytics event on click.
 * Exists so server components can fire events without becoming client components
 * themselves — only this leaf ships JS.
 */
export function TrackedLink({
  event,
  eventData,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventData?: Record<string, string | number | boolean | null>;
  children: ReactNode;
}) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, eventData);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
