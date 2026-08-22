import Link from "next/link";
import { intro } from "@/content/intro";
import { IntroFlowDiagram } from "./IntroFlowDiagram";
import { FullScreenDemoTrigger } from "./FullScreenDemoTrigger";

export function IntroScreen() {
  return (
    <div className="flex flex-col" style={{ minHeight: "100vh" }}>
      <header
        className="flex items-center flex-shrink-0"
        style={{ height: 66, gap: 20, padding: "0 40px", borderBottom: "1px solid var(--border)", background: "color-mix(in oklch, var(--card) 75%, transparent)", backdropFilter: "blur(8px)" }}
      >
        <Link href="/" className="ss-backlink">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {intro.backToPortfolioLabel}
        </Link>
      </header>

      <main className="flex-1 w-full" style={{ maxWidth: 1120, margin: "0 auto", padding: "52px 40px 72px" }}>
        <div style={{ maxWidth: 660 }}>
          <span className="ss-intro-chip" style={{ background: "color-mix(in oklch, var(--primary) 11%, transparent)", color: "var(--primary)" }}>
            {intro.chip}
          </span>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.028em", margin: "18px 0 16px" }}>
            {intro.heading}
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.62, color: "var(--muted-foreground)" }}>{intro.body}</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 40 }}>
          {intro.threeUp.map((item) => (
            <div key={item.label} className="ss-node" style={{ padding: "18px 20px" }}>
              <div className="ss-eyebrow" style={{ marginBottom: 8 }}>
                {item.label}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div style={{ margin: "48px 0 18px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.012em", marginBottom: 4 }}>{intro.flowHeading}</h2>
          <p style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>{intro.flowSubheading}</p>
        </div>

        <IntroFlowDiagram />

        <div className="flex justify-center" style={{ marginTop: 40 }}>
          <FullScreenDemoTrigger />
        </div>
      </main>
    </div>
  );
}
