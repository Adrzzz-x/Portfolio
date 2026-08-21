"use client";

import * as Dialog from "@radix-ui/react-dialog";

export function VideoModal({
  open,
  onOpenChange,
  videoSrc,
  posterSrc,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoSrc: string;
  posterSrc: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#201b16]/[.82]" />
        <Dialog.Content
          className="fixed inset-0 z-[60] flex items-center justify-center p-8 sm:p-12 outline-none"
          onClick={() => onOpenChange(false)}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Video preview</Dialog.Title>
          {/* Never autoplay: this modal only mounts a playable <video> once the user has
              explicitly clicked a play affordance — controls are native, autoPlay stays false. */}
          <video
            src={videoSrc}
            poster={posterSrc}
            controls
            autoPlay={false}
            muted={false}
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-w-[min(1000px,92vw)] max-h-[86vh] bg-black shadow-[0_30px_80px_rgba(0,0,0,.5)]"
          />
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-6 right-8 font-mono text-xs uppercase tracking-[0.12em] text-bg"
            >
              Close ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
