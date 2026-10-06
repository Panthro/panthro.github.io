import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

type Step = {
  title: string;
  body: string;
};

type Props = {
  steps: Step[];
};

/**
 * How far each level reaches on the plane, in % of the chart.
 * x = solution ambiguity, y = problem ambiguity. The "frame" at 80% is the
 * edge of the problems someone hands you; only principal reaches past it.
 */
const LEVELS = [
  { label: "Junior", w: 11, h: 8 },
  { label: "Mid", w: 30, h: 12 },
  { label: "Senior", w: 54, h: 32 },
  { label: "Staff", w: 76, h: 76 },
  { label: "Principal", w: 100, h: 100 },
] as const;

const FRAME = 80;
const MAX = LEVELS.length - 1;

type Task = {
  text: string;
  x: number;
  y: number;
  level: number;
  side: "left" | "right";
};

const TASKS: Task[] = [
  { text: "Fix the bug exactly as the ticket says", x: 6, y: 4, level: 0, side: "right" },
  { text: "Add CSV export to the reports page", x: 25, y: 9, level: 1, side: "right" },
  { text: "Design the notifications service", x: 47, y: 15, level: 2, side: "left" },
  { text: "Finance needs exports. Requirements half-written.", x: 31, y: 26, level: 2, side: "right" },
  { text: "Onboarding drop-off doubled. Nobody knows why.", x: 22, y: 62, level: 3, side: "right" },
  { text: "Cut fraud losses without blocking good customers", x: 66, y: 48, level: 3, side: "left" },
  { text: "Five teams wrote their own retry logic", x: 90, y: 70, level: 4, side: "left" },
  { text: "Nobody owns data quality between services", x: 14, y: 91, level: 4, side: "right" },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function regionAt(value: number) {
  const lower = Math.floor(clamp(value, 0, MAX));
  const upper = Math.min(MAX, lower + 1);
  const t = value - lower;
  return {
    w: LEVELS[lower].w + (LEVELS[upper].w - LEVELS[lower].w) * t,
    h: LEVELS[lower].h + (LEVELS[upper].h - LEVELS[lower].h) * t,
  };
}

export function AmbiguityMap({ steps }: Props) {
  // SSR renders the full principal picture: a complete static diagram without JS.
  const [value, setValue] = useState<number>(MAX);
  const [hydrated, setHydrated] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [dragging, setDragging] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastBeat = useRef(-1);

  const level = Math.round(clamp(value, 0, MAX));
  const { w, h } = regionAt(value);
  const breakout = clamp(value - (MAX - 1), 0, 1);
  const beyondVisible = breakout > 0.5;

  // Top-anchor scroll spy, coalesced through one animation frame (see journey-scroll-spy.ts).
  const measure = useCallback(() => {
    const beats = beatsRef.current?.querySelectorAll<HTMLElement>("[data-beat]");
    const panel = panelRef.current;
    if (!beats || beats.length === 0 || !panel) return null;

    const viewport = window.innerHeight;
    const sideBySide = window.matchMedia("(min-width: 1024px)").matches;
    const panelBottom = panel.getBoundingClientRect().bottom;
    const anchor = sideBySide ? viewport * 0.55 : panelBottom + (viewport - panelBottom) * 0.4;

    let index = 0;
    beats.forEach((beat, i) => {
      if (beat.getBoundingClientRect().top <= anchor) index = i;
    });
    return Math.min(index, MAX);
  }, []);

  useEffect(() => {
    const initial = measure();
    if (initial !== null) {
      lastBeat.current = initial;
      setValue(initial);
    }
    setHydrated(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let enableFrame = 0;
    if (!reduced) {
      // Two frames: the first commits the initial level without a transition.
      enableFrame = requestAnimationFrame(() => {
        enableFrame = requestAnimationFrame(() => setAnimate(true));
      });
    }

    let frame = 0;
    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const index = measure();
        // Only react when the reader crosses into a different beat, so a level
        // picked on the rail sticks until they scroll on.
        if (index === null || index === lastBeat.current) return;
        lastBeat.current = index;
        setValue(index);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(enableFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const valueFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * MAX, 0, MAX);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setValue(valueFromPointer(event.clientX));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setValue(valueFromPointer(event.clientX));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    setValue(Math.round(valueFromPointer(event.clientX)));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: level + 1,
      ArrowUp: level + 1,
      ArrowLeft: level - 1,
      ArrowDown: level - 1,
      Home: 0,
      End: MAX,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    setValue(clamp(keys[event.key], 0, MAX));
  };

  const smooth = animate && !dragging;
  const ease = smooth ? "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" : "duration-0";

  return (
    // Head.astro toggles .show on .article-reveal before hydration; that is expected.
    <figure
      suppressHydrationWarning
      className="article-reveal not-prose my-14"
      aria-label="Ambiguity by career level: problem ambiguity against solution ambiguity"
    >
      <div className="lg:relative lg:left-1/2 lg:w-[min(62rem,calc(100vw-4rem))] lg:-translate-x-1/2">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
          <div
            ref={panelRef}
            className="sticky top-[5rem] sm:top-[5.5rem] z-10 self-start bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 lg:border-b-0 pb-3 lg:pb-0"
          >
            <div className="flex items-baseline justify-between gap-4 pb-3">
              <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-heading" aria-live="polite">
                {LEVELS[level].label}
              </div>
              <div className="font-mono text-xs text-meta tabular-nums">
                {String(level + 1).padStart(2, "0")} / {String(LEVELS.length).padStart(2, "0")}
              </div>
            </div>

            {/* Plane */}
            <div className="relative pl-5 pb-5">
              <div
                className="absolute left-0 bottom-5 font-mono text-[10px] uppercase tracking-wider text-meta whitespace-nowrap origin-bottom-left -rotate-90 translate-x-3"
                aria-hidden="true"
              >
                Problem ambiguity →
              </div>
              <div
                className="absolute left-5 bottom-0 font-mono text-[10px] uppercase tracking-wider text-meta whitespace-nowrap"
                aria-hidden="true"
              >
                Solution ambiguity →
              </div>

              <div className="relative h-[min(34vh,17rem)] sm:h-[min(42vh,22rem)] lg:h-[min(52vh,27rem)] border-l border-b border-zinc-400 dark:border-zinc-600">
                {/* Rings left behind by earlier levels */}
                {LEVELS.slice(0, MAX).map((ring, i) => (
                  <div
                    key={ring.label}
                    aria-hidden="true"
                    className={`absolute left-0 bottom-0 border-t border-r border-zinc-300 dark:border-zinc-700 transition-opacity duration-500 ${
                      i < level ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ width: `${ring.w}%`, height: `${ring.h}%` }}
                  >
                    {i > 0 && (
                      <span className="absolute right-1 top-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600 hidden sm:block">
                        {ring.label}
                      </span>
                    )}
                  </div>
                ))}

                {/* Edge of the problems you get handed */}
                <div
                  aria-hidden="true"
                  className={`absolute left-0 border-t border-dashed border-zinc-400 dark:border-zinc-600 transition-[opacity,transform] ${ease}`}
                  style={{
                    bottom: `${FRAME}%`,
                    width: `${FRAME}%`,
                    opacity: 1 - breakout * 0.75,
                    transform: `translateY(${-breakout * 14}px)`,
                  }}
                >
                  <span className="absolute left-1 -top-4 font-mono text-[9px] uppercase tracking-wider text-meta whitespace-nowrap">
                    Edge of what you get handed
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className={`absolute bottom-0 border-r border-dashed border-zinc-400 dark:border-zinc-600 transition-[opacity,transform] ${ease}`}
                  style={{
                    left: `${FRAME}%`,
                    height: `${FRAME}%`,
                    opacity: 1 - breakout * 0.75,
                    transform: `translateX(${breakout * 14}px)`,
                  }}
                />

                <div
                  aria-hidden="true"
                  className={`absolute right-1 top-1 hidden sm:block font-mono text-[10px] uppercase tracking-wider text-accent text-right transition-opacity duration-500 ${
                    beyondVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Problems nobody has named yet
                </div>

                {/* Active reach */}
                <div
                  aria-hidden="true"
                  className={`absolute left-0 bottom-0 border-t border-r border-lime-600 dark:border-lime-400 bg-zinc-900/[0.04] dark:bg-white/[0.04] transition-[width,height] ${ease}`}
                  style={{ width: `${w}%`, height: `${h}%` }}
                />

                {/* Work, plotted */}
                {TASKS.map((task) => {
                  const beyond = task.level === MAX;
                  const inside = task.x <= w + 0.5 && task.y <= h + 0.5;
                  const hidden = beyond && !beyondVisible;
                  const fresh = inside && task.level === level;
                  const state = hidden ? "hidden" : fresh ? "new" : inside ? "lit" : "dim";

                  return (
                    <div
                      key={task.text}
                      className={`group absolute transition-[opacity,transform] duration-500 ${
                        state === "hidden" ? "opacity-0" : "opacity-100"
                      }`}
                      style={{
                        left: `${task.x}%`,
                        bottom: `${task.y}%`,
                        transform: `translate(-50%, 50%) scale(${state === "hidden" ? 0.5 : 1})`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={`relative block size-2 rounded-full border transition-colors duration-500 ${
                          state === "new"
                            ? "bg-lime-600 border-lime-600 dark:bg-lime-400 dark:border-lime-400"
                            : state === "lit"
                              ? "bg-zinc-500 border-zinc-500 dark:bg-zinc-400 dark:border-zinc-400"
                              : "bg-transparent border-zinc-400 dark:border-zinc-600"
                        }`}
                      >
                        {beyond && beyondVisible && animate && (
                          <span className="ambiguity-pulse absolute inset-0 rounded-full border border-lime-600 dark:border-lime-400" />
                        )}
                      </span>
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 w-[9rem] sm:w-[11rem] text-[10px] sm:text-[11px] leading-tight transition-opacity duration-500 ${
                          task.side === "right" ? "left-3.5 text-left" : "right-3.5 text-right"
                        } ${
                          state === "new"
                            ? "opacity-100 text-heading font-medium"
                            : state === "lit" && !hydrated
                              ? "opacity-100 text-meta"
                              : state === "lit"
                                ? "opacity-0 group-hover:opacity-100 text-meta"
                                : "opacity-0"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Level rail */}
            <div className="mt-4 px-3">
              <div
                ref={trackRef}
                className="relative h-11 cursor-pointer touch-none select-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-300 dark:bg-zinc-700" aria-hidden="true" />
                <div
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-px bg-lime-600 dark:bg-lime-400 transition-[width] ${ease}`}
                  style={{ width: `${(value / MAX) * 100}%` }}
                />
                {LEVELS.map((stop, i) => (
                  <span
                    key={stop.label}
                    aria-hidden="true"
                    className={`absolute top-1/2 h-2 w-px -translate-y-1/2 ${
                      i <= value ? "bg-lime-600 dark:bg-lime-400" : "bg-zinc-400 dark:bg-zinc-600"
                    }`}
                    style={{ left: `${(i / MAX) * 100}%` }}
                  />
                ))}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Career level"
                  aria-valuemin={0}
                  aria-valuemax={MAX}
                  aria-valuenow={level}
                  aria-valuetext={LEVELS[level].label}
                  onKeyDown={onKeyDown}
                  className={`focus-ring absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-600 dark:bg-lime-400 ring-4 ring-zinc-100 dark:ring-zinc-950 transition-[left] ${ease} ${
                    dragging ? "scale-125" : ""
                  }`}
                  style={{ left: `${(value / MAX) * 100}%` }}
                />
              </div>
              <div className="relative h-6" aria-hidden="true">
                {LEVELS.map((stop, i) => (
                  <span
                    key={stop.label}
                    className={`absolute top-0 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                      i === level ? "text-accent" : "text-meta hidden sm:block"
                    }`}
                    style={{
                      left: `${(i / MAX) * 100}%`,
                      transform: i === 0 ? "none" : i === MAX ? "translateX(-100%)" : "translateX(-50%)",
                    }}
                  >
                    {stop.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Readout */}
            <div className="mt-3 hidden sm:grid grid-cols-2 gap-6" aria-hidden="true">
              {[
                { label: "Problem ambiguity", amount: h },
                { label: "Solution ambiguity", amount: w },
              ].map((meter) => (
                <div key={meter.label}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-meta mb-1.5">{meter.label}</div>
                  <div className="h-px bg-zinc-300 dark:bg-zinc-700">
                    <div
                      className={`h-px bg-zinc-900 dark:bg-white transition-[width] ${ease}`}
                      style={{ width: `${meter.amount}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beats */}
          <ol ref={beatsRef} className="relative pb-[20vh] lg:pb-[30vh]">
            {steps.slice(0, LEVELS.length).map((step, i) => (
              <li
                key={step.title}
                data-beat
                data-active={!hydrated || i === level}
                className="min-h-[55vh] lg:min-h-[72vh] flex flex-col justify-center py-10 transition-opacity duration-500 data-[active=false]:opacity-35"
                style={{ "--i": i } as CSSProperties}
              >
                <div className="font-mono text-xs uppercase tracking-wider text-accent mb-2">
                  {String(i + 1).padStart(2, "0")} · {LEVELS[i].label}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-heading mb-3 text-pretty">
                  {step.title}
                </h3>
                <p className="text-prose leading-relaxed text-pretty">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
