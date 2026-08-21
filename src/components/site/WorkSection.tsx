import { workSection, caseStudies } from "@/content/site";
import { CaseStudyRow } from "./CaseStudyRow";

export function WorkSection() {
  return (
    <div className="relative z-10">
      <div className="px-6 sm:px-10 lg:px-20 pt-20 lg:pt-28 pb-10">
        <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
          {workSection.eyebrow}
        </div>
        <h2 className="mt-4.5 font-serif font-medium text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em]">
          {workSection.heading}
        </h2>
      </div>
      <div>
        {caseStudies.map((study, i) => (
          <CaseStudyRow
            key={study.id}
            study={study}
            border={i === caseStudies.length - 1 ? "top-and-bottom" : "top"}
          />
        ))}
      </div>
    </div>
  );
}
