import type { Principle } from "@/content/site";

export function PrincipleCard({ principle }: { principle: Principle }) {
  return (
    <div>
      <h4 className="mb-3.5 font-serif font-medium text-2xl leading-[1.2] tracking-[-0.02em]">
        {principle.title}
      </h4>
      <p className="max-w-[46ch] text-[17px] leading-[1.65] text-text-muted">
        {principle.description}
      </p>
    </div>
  );
}
