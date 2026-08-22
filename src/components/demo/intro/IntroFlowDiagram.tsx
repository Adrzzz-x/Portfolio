"use client";

import { useEffect, useRef, useState } from "react";
import { intro } from "@/content/intro";

const STAGES = intro.stages;
const TOTALS = intro.totals;
const MROWS = intro.matchRows;

export function IntroFlowDiagram() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lines, setLines] = useState(0);
  const [bills, setBills] = useState(0);
  const [matched, setMatched] = useState(0);
  const [review, setReview] = useState(0);
  const [resolved, setResolved] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(0);
  const playingRef = useRef(true);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tweenTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (tweenTimer.current) clearInterval(tweenTimer.current);
    if (revealTimer.current) clearInterval(revealTimer.current);
  }

  function tween(i: number) {
    const steps = 18;
    const dur = 950;
    let k = 0;
    tweenTimer.current = setInterval(() => {
      k++;
      const p = Math.min(1, k / steps);
      const e = 1 - Math.pow(1 - p, 3);
      if (i === 0) setLines(Math.round(TOTALS.lines * e));
      else if (i === 1) setBills(Math.round(TOTALS.bills * e));
      else {
        setMatched(Math.round(TOTALS.matched * e));
        setReview(Math.round(TOTALS.review * e));
      }
      if (p >= 1 && tweenTimer.current) clearInterval(tweenTimer.current);
    }, dur / steps);
  }

  function enter(i: number) {
    clearTimers();
    stageRef.current = i;
    setStage(i);
    setLines(i >= 1 ? TOTALS.lines : 0);
    setBills(i >= 2 ? TOTALS.bills : 0);
    setMatched(0);
    setReview(0);
    setResolved(0);

    if (i === 2) {
      let k = 0;
      revealTimer.current = setInterval(() => {
        k++;
        setResolved(k);
        if (k >= MROWS.length && revealTimer.current) clearInterval(revealTimer.current);
      }, 400);
    }

    tween(i);

    if (i >= STAGES.length - 1) {
      playingRef.current = false;
      setPlaying(false);
    } else if (playingRef.current) {
      advanceTimer.current = setTimeout(() => enter(i + 1), STAGES[i].ms);
    }
  }

  function toggle() {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (!next) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      return;
    }
    const atEnd = stageRef.current >= STAGES.length - 1;
    if (atEnd) enter(0);
    else advanceTimer.current = setTimeout(() => enter(stageRef.current + 1), 400);
  }

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      enter(0);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          enter(0);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only observer setup
  }, []);

  const hqCls = stage === 0 ? "is-hot" : "is-dim";
  const xeroCls = stage === 1 ? "is-hot" : "is-dim";
  const coreCls = stage === 2 ? "is-pulse" : "";
  const mCls = stage === 2 ? "is-open" : "";

  return (
    <div ref={cardRef} className="ss-node" style={{ padding: "44px 40px 26px", boxShadow: "var(--shadow-lg)" }}>
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: "1fr 96px 1.22fr 96px 1fr" }}
      >
        {/* Trade account HQ */}
        <div className={`ss-dgnode ${hqCls}`} style={{ padding: "20px 22px" }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "color-mix(in oklch, var(--chart-4) 16%, transparent)",
                color: "color-mix(in oklch, var(--chart-4) 62%, black)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h2M9 13h2M13 9h2M13 13h2M9 21v-4h6v4" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{intro.tradeAccountHq.title}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 1 }}>
                {intro.tradeAccountHq.subtitle}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>
            {intro.tradeAccountHq.description}
          </p>
        </div>

        {/* HQ -> Core connector */}
        <div className="flex flex-col items-center" style={{ gap: 9 }}>
          <div style={{ position: "relative", width: 90, height: 16 }}>
            <svg width="90" height="16" viewBox="0 0 90 16" style={{ position: "absolute", inset: 0 }}>
              <defs>
                <marker id="ah-in" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0l7 3.5L0 7z" fill="var(--primary)" />
                </marker>
              </defs>
              <line x1="4" y1="8" x2="78" y2="8" strokeWidth={1.75} className={`ss-ln ${stage === 0 ? "is-on" : ""}`} markerEnd="url(#ah-in)" />
            </svg>
            {stage === 0 && (
              <>
                <span className="ss-pk ss-pk-r" style={{ top: 5 }} />
                <span className="ss-pk ss-pk-r ss-pk-d2" style={{ top: 5 }} />
                <span className="ss-pk ss-pk-r ss-pk-d3" style={{ top: 5 }} />
              </>
            )}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--primary)", whiteSpace: "nowrap" }}>API feed</span>
        </div>

        {/* SwiftStatement core */}
        <div className={`ss-dgcore ${coreCls}`} style={{ padding: "24px 22px" }}>
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--primary)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
            </svg>
          </span>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.014em" }}>{intro.core.title}</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted-foreground)", marginTop: 7 }}>
            {intro.core.description}
          </p>
          <div
            className="flex items-center justify-center"
            style={{ gap: 18, marginTop: 14, paddingTop: 13, borderTop: "1px solid color-mix(in oklch, var(--primary) 18%, transparent)" }}
          >
            <div>
              <div className="ss-stat">{lines}</div>
              <div className="ss-statlbl">statement lines</div>
            </div>
            <div style={{ width: 1, height: 26, background: "color-mix(in oklch, var(--primary) 18%, transparent)" }} />
            <div>
              <div className="ss-stat">{bills}</div>
              <div className="ss-statlbl">bills</div>
            </div>
          </div>
          <div className="flex justify-center flex-wrap" style={{ gap: 7, marginTop: 13 }}>
            <span
              className="ss-chip"
              style={{ background: "color-mix(in oklch, var(--chart-1) 14%, transparent)", color: "color-mix(in oklch, var(--chart-1) 68%, black)", height: 24, fontSize: 11 }}
            >
              {matched} matched
            </span>
            <span className="ss-chip" style={{ background: "var(--muted)", color: "var(--muted-foreground)", height: 24, fontSize: 11 }}>
              {review} need review
            </span>
          </div>
        </div>

        {/* Core <-> Xero connector */}
        <div className="flex flex-col items-center" style={{ gap: 9 }}>
          <div style={{ position: "relative", width: 90, height: 30 }}>
            <svg width="90" height="30" viewBox="0 0 90 30" style={{ position: "absolute", inset: 0 }}>
              <defs>
                <marker id="ah-read" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0l7 3.5L0 7z" fill="var(--primary)" />
                </marker>
                <marker id="ah-post" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0l7 3.5L0 7z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <line x1="86" y1="8" x2="6" y2="8" strokeWidth={1.75} className={`ss-ln ${stage === 1 ? "is-on" : ""}`} markerEnd="url(#ah-read)" />
              <line x1="4" y1="22" x2="84" y2="22" strokeWidth={1.5} className="ss-ln" markerEnd="url(#ah-post)" />
            </svg>
            {stage === 1 && (
              <>
                <span className="ss-pk ss-pk-l" style={{ top: 5 }} />
                <span className="ss-pk ss-pk-l ss-pk-d2" style={{ top: 5 }} />
                <span className="ss-pk ss-pk-l ss-pk-d3" style={{ top: 5 }} />
              </>
            )}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.5, textAlign: "center", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--primary)" }}>Read bills</span>
            <br />
            <span style={{ color: "var(--muted-foreground)" }}>Post back</span>
          </span>
        </div>

        {/* Xero or MYOB */}
        <div className={`ss-dgnode ${xeroCls}`} style={{ padding: "20px 22px" }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#13B5EA",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              X
            </span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{intro.accounting.title}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 1 }}>{intro.accounting.subtitle}</div>
            </div>
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{intro.accounting.description}</p>
        </div>
      </div>

      {/* Match rows reveal */}
      <div className={`ss-mwrap ${mCls}`}>
        <div className="flex items-center justify-between gap-3" style={{ marginBottom: 10 }}>
          <span className="ss-eyebrow">{intro.matchRowsTitle}</span>
          <span style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>{intro.matchRowsSubtitle}</span>
        </div>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {MROWS.map((r, k) => {
            const done = k < resolved;
            const isExc = done && !!r.exc;
            const isOk = done && !r.exc;
            const rowCls = !done ? "is-pending" : isExc ? "is-exc" : "is-ok";
            return (
              <div key={r.ref} className={`ss-mrow ${rowCls}`}>
                <span className="ss-mref">{r.ref}</span>
                <span style={{ fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.supplier}</span>
                <span className="ss-mamt">{r.amt}</span>
                <span className="ss-mstate">
                  {!done && <span className="ss-mdot" />}
                  {isOk && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  {isExc && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                  )}
                  {!done ? "Matching…" : isExc ? r.exc : "Matched"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center flex-wrap" style={{ gap: 10, marginTop: 34, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
        <button type="button" className="ss-playbtn" onClick={toggle}>
          {playing ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
              </svg>
              {stage >= STAGES.length - 1 ? "Replay" : "Play"}
            </>
          )}
        </button>
        <div style={{ width: 1, height: 22, background: "var(--border)", margin: "0 4px" }} />
        {STAGES.map((s, i) => (
          <button key={s.n} type="button" className={`ss-steppill ${i === stage ? "is-on" : ""}`} onClick={() => enter(i)}>
            <span className="ss-stepnum">{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--muted-foreground)", marginTop: 13, minHeight: 19 }}>
        {STAGES[stage].caption}
      </p>
    </div>
  );
}
