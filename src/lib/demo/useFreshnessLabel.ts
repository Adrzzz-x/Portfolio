"use client";

import { useEffect, useState } from "react";

/** Ticks every 30s so "fresh" copy updates without calling Date.now() directly during render. */
export function useFreshnessLabel(lastUpdated: number | null) {
  const [label, setLabel] = useState("Loading…");

  useEffect(() => {
    function update() {
      if (!lastUpdated) {
        setLabel("Loading…");
        return;
      }
      const minutes = Math.round((Date.now() - lastUpdated) / 60000);
      setLabel(minutes < 10 ? "Statement up to date" : "May be out of date");
    }
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return label;
}
