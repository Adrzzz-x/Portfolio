import type { CSSProperties } from "react";

export type TapePlacement = Omit<CSSProperties, "rotate"> & { rotateDeg: number };

export function Tape({ placement }: { placement: TapePlacement }) {
  const { rotateDeg, ...position } = placement;
  return (
    <span
      aria-hidden="true"
      className="absolute w-[6.5rem] h-[1.6rem] bg-[#ddd1c2cc] border border-[#201b160f]"
      style={{
        ...position,
        transform: `${position.transform ?? ""} rotate(${rotateDeg}deg)`.trim(),
      }}
    />
  );
}
