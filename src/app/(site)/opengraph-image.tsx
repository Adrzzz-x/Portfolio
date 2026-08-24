import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";
import { hero } from "@/content/site";

export const alt = "Adrian Mullee — Product Owner & AI Native Designer, Perth WA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Statically generated at build time. Uses ImageResponse's bundled font rather than
// shipping font binaries or fetching at build — satori cannot read woff2, and a
// network call here would make the build non-deterministic.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF6F0",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#5A5049",
            }}
          >
            {hero.eyebrow}
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#201B16",
              marginTop: 28,
            }}
          >
            {hero.heading}
          </div>
          <div style={{ display: "flex", width: 260, height: 8, background: "#C0562B", marginTop: 24 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: "#201B16", maxWidth: 900 }}>
            Regulated fintech. Two products taken 0→1. A demo you can actually use.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 34,
              fontSize: 26,
              color: "#8E3D1D",
            }}
          >
            {SITE_URL.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
