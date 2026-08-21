"use client";

import { useEffect, useState } from "react";
import { swiftstatementCaseStudy as cs } from "@/content/site";
import { DesktopGate } from "./DesktopGate";

const LOAD_TIMEOUT_MS = 6000;

function IframeStatus({ resetCount }: { resetCount: number }) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Fresh state each remount (this component is keyed by resetCount), so the only job of
  // the effect is to schedule the "taking too long" fallback — no synchronous setState here.
  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  function handleLoad() {
    setLoaded(true);
    setTimedOut(false);
  }

  return (
    <div className="relative" style={{ aspectRatio: "16 / 10", minHeight: "min(720px, 70vh)" }}>
      {!loaded && !timedOut && (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#F1E9DE_8%,#FAF6F0_18%,#F1E9DE_33%)] bg-[length:200%_100%]" />
      )}
      {timedOut && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel">
          <div className="text-center max-w-[32ch] px-6">
            <p className="text-sm text-text-muted mb-4">The demo is taking a while to load in-page.</p>
            <a href="/demo" target="_blank" rel="noopener noreferrer" className="font-medium text-accent-dark">
              Open full screen ↗
            </a>
          </div>
        </div>
      )}
      <iframe
        src={`/demo?r=${resetCount}`}
        title="SwiftStatement interactive prototype"
        loading="lazy"
        onLoad={handleLoad}
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}

export function DemoFrame() {
  const [resetCount, setResetCount] = useState(0);

  return (
    <div>
      {/* Desktop-only: the reconciliation table genuinely doesn't work on a phone-width viewport */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-border bg-white shadow-[0_20px_50px_rgba(32,27,22,.14)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light bg-panel">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
            </span>
            <span className="font-mono text-xs text-text-muted bg-bg border border-border rounded px-2.5 py-1">
              adrianmullee.com/demo
            </span>
          </div>
          <IframeStatus key={resetCount} resetCount={resetCount} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="font-mono text-xs text-text-muted">{cs.demoDisclaimer}</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setResetCount((n) => n + 1)}
              className="font-mono text-xs uppercase tracking-[0.1em] text-accent-dark border border-border rounded-sm px-3 py-2"
            >
              Reset demo
            </button>
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[15px] text-accent-dark"
            >
              Open full screen ↗
            </a>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <DesktopGate />
      </div>
    </div>
  );
}
