import { personalSection } from "@/content/site";
import { PhotoCollage } from "./PhotoCollage";

export function PersonalSection() {
  return (
    <div
      id="the-rest-of-me"
      className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 px-6 sm:px-10 lg:px-20 py-16 lg:py-20 scroll-mt-24"
    >
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
          {personalSection.eyebrow}
        </div>
        <h2 className="mt-4.5 mb-7 font-serif font-medium text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em]">
          {personalSection.heading}
        </h2>
        {personalSection.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-5 max-w-[60ch] text-lg leading-[1.68] text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
      <PhotoCollage />
    </div>
  );
}
