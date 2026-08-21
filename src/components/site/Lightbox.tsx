"use client";

import * as Dialog from "@radix-ui/react-dialog";

export function Lightbox({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={!!image} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#201b16]/[.82]" />
        <Dialog.Content
          className="fixed inset-0 z-[60] flex items-center justify-center p-8 sm:p-12 outline-none"
          onClick={onClose}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Image preview</Dialog.Title>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary runtime src, not a next/image candidate here
            <img
              src={image.src}
              alt={image.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[min(1100px,92vw)] max-h-[86vh] object-contain bg-white p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.5)]"
            />
          )}
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
