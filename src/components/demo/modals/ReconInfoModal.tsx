"use client";

import { ChevronDown, GitMerge, Link as LinkIcon, Send, Settings, X } from "lucide-react";
import { Modal } from "./Modal";
import { useDemoStore } from "@/lib/demo/store";
import { RECON_STATUSES } from "@/lib/demo/seed";
import { workspace as copy } from "@/content/demo";

const ICONS = { link: LinkIcon, settings: Settings, "git-merge": GitMerge, send: Send } as const;

export function ReconInfoModal() {
  const open = useDemoStore((s) => s.showReconInfo);
  const setShowReconInfo = useDemoStore((s) => s.setShowReconInfo);
  const close = () => setShowReconInfo(false);

  return (
    <Modal
      open={open}
      onClose={close}
      title={copy.reconInfo.title}
      cardStyle={{ width: 580, maxHeight: "88vh", overflowY: "auto", padding: "28px 28px 24px" }}
    >
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2 style={{ font: "var(--text-h3)", color: "var(--foreground)", margin: "0 0 4px" }}>
            {copy.reconInfo.title}
          </h2>
          <p style={{ font: "var(--text-small)", color: "var(--muted-foreground)", margin: 0 }}>
            {copy.reconInfo.subtitle}
          </p>
        </div>
        <button type="button" className="icon-btn" onClick={close} style={{ marginLeft: 16 }} aria-label="Close">
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div>
        {RECON_STATUSES.map((s, i) => {
          const Icon = ICONS[s.icon as keyof typeof ICONS];
          return (
            <div key={s.label}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <div>
                  <p style={{ font: "var(--text-label)", color: "var(--foreground)", margin: "0 0 4px" }}>
                    {s.label}
                  </p>
                  <p
                    style={{
                      font: "var(--text-small)",
                      color: "var(--muted-foreground)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
              {i < RECON_STATUSES.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 28,
                    color: "var(--border)",
                  }}
                >
                  <ChevronDown size={16} strokeWidth={1.75} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
