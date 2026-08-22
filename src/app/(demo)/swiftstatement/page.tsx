import type { Metadata } from "next";
import { IntroScreen } from "@/components/demo/intro/IntroScreen";
import { intro } from "@/content/intro";

// This route lives in the (demo) group (it needs the demo's own fonts/tokens), but unlike
// /demo itself it's a real case-study page meant to be found and indexed.
export const metadata: Metadata = {
  title: "SwiftStatement — Adrian Mullee",
  description: intro.body,
  alternates: { canonical: "/swiftstatement" },
  robots: { index: true, follow: true },
};

export default function SwiftStatementPage() {
  return <IntroScreen />;
}
