import type { CaseStudy } from "@/content/site";
import { BrowserFrame } from "./BrowserFrame";
import { PlaceholderBox } from "./PlaceholderBox";
import Image from "next/image";

export function CaseStudyRow({
  study,
  border = "top",
}: {
  study: CaseStudy;
  border?: "top" | "top-and-bottom";
}) {
  const borderClass =
    border === "top-and-bottom" ? "border-t border-b border-border" : "border-t border-border";

  return (
    <div
      id={study.id}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center ${borderClass} px-6 sm:px-10 lg:pl-20 py-12 overflow-hidden scroll-mt-24`}
    >
      <div>
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            {study.period}
          </span>
          {study.badge && (
            <span className="font-mono font-medium text-[11px] uppercase tracking-[0.12em] text-bg bg-accent px-2.5 py-1.5 rounded-full">
              {study.badge}
            </span>
          )}
        </div>
        <h3 className="mt-5 mb-4 font-serif font-semibold text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em]">
          {study.title}
        </h3>
        <p className="max-w-[44ch] text-lg leading-[1.6]">{study.description}</p>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs uppercase tracking-[0.08em] text-green border border-border rounded-full px-3.5 py-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <a href={study.ctaHref} className="inline-block mt-8 font-medium text-[15px] text-accent-dark">
          {study.ctaLabel}
        </a>
      </div>
      {study.screenshot ? (
        <BrowserFrame>
          {study.screenshot.src ? (
            <Image
              src={study.screenshot.src}
              alt={study.screenshot.alt}
              unoptimized={study.screenshot.unoptimized}
              style={{ width: "100%", objectFit: "cover", objectPosition: "top left" }}
            />
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{
                backgroundImage: "repeating-linear-gradient(135deg, #EAE0D0 0 7px, #F2EAE0 7px 14px)",
              }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted bg-bg px-2.5 py-1.5">
                {study.screenshot.pendingLabel ?? "Image pending"}
              </span>
            </div>
          )}
        </BrowserFrame>
      ) : (
        <PlaceholderBox label={study.placeholderLabel ?? ""} />
      )}
    </div>
  );
}
