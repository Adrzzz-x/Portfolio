"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";
import { workspace as copy, TOUR_STORAGE_KEY } from "@/content/demo";

const STEPS = copy.tour.steps;
const TIP_W = 326;

type Rect = { top: number; left: number; width: number; height: number };

function targetEl(step: number): HTMLElement | null {
  const sel = STEPS[step]?.target;
  return sel ? document.querySelector<HTMLElement>(sel) : null;
}

/** Centres the target inside any scrollable ancestor, then scrolls the page to it. */
function scrollIntoView(el: HTMLElement, smooth: boolean) {
  let p = el.parentElement;
  while (p && p !== document.body) {
    const cs = getComputedStyle(p);
    const scrollableY = /(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1;
    const scrollableX = /(auto|scroll)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1;
    if (scrollableY || scrollableX) {
      const er = el.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      if (scrollableX) p.scrollLeft += er.left - pr.left - (p.clientWidth / 2 - er.width / 2);
      if (scrollableY) p.scrollTop += er.top - pr.top - (p.clientHeight / 2 - er.height / 2);
    }
    p = p.parentElement;
  }
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const top = Math.max(0, r.top + window.scrollY - Math.max(120, (vh - r.height) / 2));
  const maxX = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
  let left = window.scrollX;
  if (r.right > vw - 24 || r.left < 24) {
    left = Math.min(maxX, Math.max(0, r.left + window.scrollX - (vw / 2 - Math.min(r.width, vw * 0.6) / 2)));
  }
  window.scrollTo({ top, left, behavior: smooth ? "smooth" : "auto" });
}

export function GuidedTour() {
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [anim, setAnim] = useState<"in-a" | "in-b">("in-a");
  const [moving, setMoving] = useState(false);

  const token = useRef(0);
  const raf = useRef<number | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = useCallback((s: number) => {
    const el = targetEl(s);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = Math.max(8, r.top);
    const height = Math.min(r.height - (top - r.top), vh - top - 16);
    setRect({ top, left: r.left, width: r.width, height: Math.max(60, height) });
  }, []);

  // Re-measures continuously while the spotlight animates between targets.
  const track = useCallback(
    (s: number, ms: number) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      const myToken = ++token.current;
      const t0 = performance.now();
      const loop = () => {
        if (token.current !== myToken) return;
        measure(s);
        if (performance.now() - t0 < ms) raf.current = requestAnimationFrame(loop);
        else setMoving(false);
      };
      raf.current = requestAnimationFrame(loop);
    },
    [measure],
  );

  const goStep = useCallback(
    (s: number) => {
      const el = targetEl(s);
      setStep((prev) => {
        const first = prev === null;
        setAnim((a) => (a === "in-a" ? "in-b" : "in-a"));
        setMoving(!first);
        if (el) scrollIntoView(el, !first);
        track(s, first ? 260 : 620);
        return s;
      });
    },
    [track],
  );

  const endTour = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — the tour just won't be remembered */
    }
    if (raf.current) cancelAnimationFrame(raf.current);
    token.current++;
    setStep(null);
    setRect(null);
  }, []);

  // Auto-start on first visit only.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TOUR_STORAGE_KEY) === "1";
    } catch {
      /* storage unavailable — treat as unseen */
    }
    if (!seen) startTimer.current = setTimeout(() => goStep(0), 700);
    const startTimerRef = startTimer;
    const rafRef = raf;
    return () => {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [goStep]);

  // Keep the spotlight glued to its target while the page scrolls or resizes.
  useEffect(() => {
    if (step === null) return;
    const onWin = () => measure(step);
    window.addEventListener("resize", onWin, true);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin, true);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [step, measure]);

  const open = step !== null && rect !== null;

  if (!open) {
    return (
      <button type="button" className="tour-cta" onClick={() => goStep(0)}>
        <Compass size={15} strokeWidth={1.75} /> {copy.tour.cta}
      </button>
    );
  }

  const pad = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tipH = step === 2 ? 188 : 178;
  const spotTop = rect.top - pad;
  const spotLeft = rect.left - pad;
  const spotW = rect.width + pad * 2;
  const spotH = rect.height + pad * 2;

  let tipTop = spotTop + spotH + 14;
  if (tipTop + tipH > vh - 16) tipTop = Math.max(16, spotTop - tipH - 14);
  const tipLeft =
    step === 2
      ? Math.min(vw - TIP_W - 20, Math.max(20, rect.left + rect.width / 2 - TIP_W / 2))
      : Math.max(20, rect.left);

  return (
    <>
      <div
        className={`tour-spot ${moving ? "is-moving" : ""}`}
        style={{ top: spotTop, left: spotLeft, width: spotW, height: spotH }}
      />
      <div className="tour-tip" style={{ top: tipTop, left: tipLeft }} role="dialog" aria-label={STEPS[step].title}>
        <div className={`tour-tip__body ${anim}`}>
          <p className="tour-tip__n">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="tour-tip__t">{STEPS[step].title}</p>
          <p className="tour-tip__d">{STEPS[step].body}</p>
          <div className="tour-tip__foot">
            <div className="tour-dots">
              {STEPS.map((s, i) => (
                <span key={s.target} className={`tour-dot ${i === step ? "on" : ""}`} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="button" className="tour-skip" onClick={endTour}>
                {copy.tour.skip}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => (step === STEPS.length - 1 ? endTour() : goStep(step + 1))}
              >
                {step === STEPS.length - 1 ? copy.tour.done : copy.tour.next}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
