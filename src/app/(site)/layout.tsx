import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/site";
import { LightboxProvider } from "@/lib/lightbox-context";
import { GrainOverlay } from "@/components/site/GrainOverlay";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — Product Owner & AI Native Designer`,
  description:
    "Product Owner in regulated fintech, Perth WA. Case studies, an interactive SwiftStatement demo, and a bit about the rest of it.",
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: "Product Owner & AI Native Designer, Perth WA.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  jobTitle: "Product Owner & AI Native Designer",
  address: { "@type": "PostalAddress", addressLocality: "Perth", addressRegion: "WA", addressCountry: "AU" },
  sameAs: ["https://www.linkedin.com/in/adrian-mullee-4a389442/"],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jbMono.variable} antialiased`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="relative max-w-[1280px] mx-auto bg-bg text-text overflow-hidden">
          <GrainOverlay />
          <LightboxProvider>{children}</LightboxProvider>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
