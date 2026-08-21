import Image, { type StaticImageData } from "next/image";

export function PlaceholderBox({
  label,
  imageSrc,
}: {
  label: string;
  imageSrc?: StaticImageData;
}) {
  if (imageSrc) {
    return (
      <div className="lg:mr-20 h-60 rounded-md border border-border overflow-hidden">
        <Image src={imageSrc} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div
      className="lg:mr-20 h-60 flex items-center justify-center rounded-md border border-border"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #EAE0D0 0 7px, #F2EAE0 7px 14px)",
      }}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted bg-bg px-2.5 py-1.5">
        {label}
      </span>
    </div>
  );
}
