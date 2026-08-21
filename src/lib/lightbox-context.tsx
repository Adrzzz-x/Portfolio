"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Lightbox } from "@/components/site/Lightbox";

type LightboxImage = { src: string; alt: string };
type LightboxContextValue = { open: (src: string, alt: string) => void };

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);

  return (
    <LightboxContext.Provider value={{ open: (src, alt) => setImage({ src, alt }) }}>
      {children}
      <Lightbox image={image} onClose={() => setImage(null)} />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
