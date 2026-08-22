"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { CSSProperties, ReactNode } from "react";

/**
 * Radix renders Overlay and Content as siblings inside the Portal, so the centring
 * lives on a positioner wrapper rather than on the overlay itself.
 */
export function Modal({
  open,
  onClose,
  title,
  cardStyle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  cardStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-positioner" aria-describedby={undefined} onClick={onClose}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div className="modal-card" style={cardStyle} onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
