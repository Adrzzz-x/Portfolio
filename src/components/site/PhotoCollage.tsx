import { personalSection } from "@/content/site";
import { Polaroid } from "./Polaroid";
import { VideoThumbnail } from "./VideoThumbnail";
import type { TapePlacement } from "./Tape";

const tapeByIndex: Record<number, TapePlacement | undefined> = {
  0: { rotateDeg: -8, top: "-10px", left: "20px" },
  3: { rotateDeg: 5, bottom: "-10px", right: "22px" },
};

const heightByIndex: Record<number, number> = { 0: 190, 1: 150, 2: 150, 3: 196 };
const cellClassByIndex: Record<number, string> = { 1: "mt-8" };

export function PhotoCollage() {
  return (
    <div className="grid grid-cols-2 gap-5 content-start items-start pt-9">
      {personalSection.collage.map((item, i) => {
        const cellClass = cellClassByIndex[i] ?? "";
        if (item.type === "video") {
          return (
            <VideoThumbnail
              key={item.alt}
              posterSrc={item.posterSrc}
              videoSrc={item.videoSrc}
              alt={item.alt}
              rotationDeg={item.rotationDeg}
              height={heightByIndex[i]}
              className={cellClass}
            />
          );
        }
        return (
          <Polaroid
            key={item.alt}
            src={item.src}
            alt={item.alt}
            unoptimized={item.unoptimized}
            pendingLabel={item.pendingLabel}
            rotationDeg={item.rotationDeg}
            height={heightByIndex[i]}
            tape={tapeByIndex[i]}
            className={cellClass}
          />
        );
      })}
    </div>
  );
}
