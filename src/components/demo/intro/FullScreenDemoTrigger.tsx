"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { intro } from "@/content/intro";

export function FullScreenDemoTrigger() {
  const [resetCount, setResetCount] = useState(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="ss-btn-primary">
          {intro.tryDemoLabel}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 z-[100] flex flex-col outline-none"
          style={{ background: "var(--background)" }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">SwiftStatement interactive demo</Dialog.Title>
          <div
            className="flex items-center justify-between gap-3 flex-shrink-0"
            style={{ padding: "0 16px", height: 48, borderBottom: "1px solid var(--border)", background: "var(--card)" }}
          >
            <Dialog.Close asChild>
              <button type="button" className="ss-backlink">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Close
              </button>
            </Dialog.Close>
            <div className="flex items-center" style={{ gap: 10 }}>
              <button type="button" className="ss-btn ss-btn--outline ss-btn--sm" onClick={() => setResetCount((n) => n + 1)}>
                Reset demo
              </button>
              <a href="/demo" target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn--ghost ss-btn--sm">
                Open in new tab ↗
              </a>
            </div>
          </div>
          <iframe
            key={resetCount}
            src={`/demo?r=${resetCount}`}
            title="SwiftStatement interactive prototype"
            className="flex-1 w-full border-0"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
