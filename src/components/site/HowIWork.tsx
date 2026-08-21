import { howIWork } from "@/content/site";
import { PrincipleCard } from "./PrincipleCard";

export function HowIWork() {
  return (
    <div className="relative z-10 bg-panel border-y border-border px-6 sm:px-10 lg:px-20 py-20 lg:py-28">
      <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
        {howIWork.eyebrow}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 mt-11">
        {howIWork.principles.map((principle) => (
          <PrincipleCard key={principle.title} principle={principle} />
        ))}
      </div>
    </div>
  );
}
