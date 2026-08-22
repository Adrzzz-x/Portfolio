"use client";

import { useSyncExternalStore } from "react";

// A single shared clock so every consumer re-renders on the same tick.
// useSyncExternalStore keeps this out of render and out of an effect body,
// and returns 0 on the server so hydration matches.
const listeners = new Set<() => void>();
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const TICK_MS = 30000;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => 0;

/** Current epoch ms, ticking every 30s. Returns 0 before the client subscribes. */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
