import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { StatsBar } from "@/components/site/StatsBar";
import { WorkSection } from "@/components/site/WorkSection";
import { HowIWork } from "@/components/site/HowIWork";
import { PersonalSection } from "@/components/site/PersonalSection";
import { ClosingCta } from "@/components/site/ClosingCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <StatsBar />
      <WorkSection />
      <HowIWork />
      <PersonalSection />
      <ClosingCta />
    </>
  );
}
