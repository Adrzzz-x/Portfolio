import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { HowItFitsTogether } from "@/components/site/HowItFitsTogether";
import { DemoFrame } from "@/components/site/DemoFrame";
import { swiftstatementCaseStudy as cs } from "@/content/site";

export const metadata: Metadata = {
  title: "SwiftStatement — Adrian Mullee",
  description: cs.intro,
  alternates: { canonical: "/swiftstatement" },
};

export default function SwiftStatementPage() {
  return (
    <>
      <Header />
      <div className="px-6 sm:px-10 lg:px-20 py-14 lg:py-20">
        <div className="max-w-[70ch]">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            {cs.eyebrow}
          </div>
          <h1 className="mt-4 mb-5 font-serif font-semibold text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em]">
            {cs.heading}
          </h1>
          <p className="text-lg sm:text-xl leading-[1.55] text-pretty">{cs.intro}</p>
        </div>

        <HowItFitsTogether />

        <div className="mt-16">
          <DemoFrame />
        </div>
      </div>
    </>
  );
}
