import { useEffect, useRef, useState } from "react";

type Signal = {
  team: string;
  text: string;
};

type Props = {
  signals: Signal[];
  problem: string;
  sponsors: string[];
  caption?: string;
};

/** Chip anchors in % of the stage: three down each side, pattern in the middle. */
const ANCHORS = [
  { x: 22, y: 14 },
  { x: 78, y: 14 },
  { x: 22, y: 50 },
  { x: 78, y: 50 },
  { x: 22, y: 86 },
  { x: 78, y: 86 },
];

const CENTER = { x: 50, y: 50 };

/**
 * Phases: 0 empty · 1 complaints arrive · 2 threads drawn · 3 pattern named ·
 * 4 sponsors sign on. SSR and reduced motion render phase 4, the full picture.
 */
const FINAL = 4;
const PHASE_DELAYS = [0, 150, 1500, 2500, 3400];

export function SignalConvergence({ signals, problem, sponsors, caption }: Props) {
  const [phase, setPhase] = useState(FINAL);
  const [animate, setAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const items = signals.slice(0, ANCHORS.length);

  const play = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setAnimate(false);
    setPhase(0);
    // Let the reset commit without transitions, then run the sequence.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        PHASE_DELAYS.forEach((delay, index) => {
          if (index === 0) return;
          timers.current.push(window.setTimeout(() => setPhase(index), delay));
        });
      })
    );
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = rootRef.current;
    if (!node) return;

    setPhase(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          play();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);

    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach(window.clearTimeout);
    };
    // play only touches refs and setters, so mount-once is safe.
  }, []);

  const ease = animate ? "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" : "duration-0";

  return (
    <figure ref={rootRef} suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={`Signals converging into one problem: ${problem}`}>
      <div className="relative h-[26rem] sm:h-[22rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 overflow-hidden">
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {items.map((signal, index) => {
            const anchor = ANCHORS[index];
            return (
              <line
                key={signal.text}
                x1={anchor.x}
                y1={anchor.y}
                x2={CENTER.x}
                y2={CENTER.y}
                vectorEffect="non-scaling-stroke"
                className={`stroke-zinc-400 dark:stroke-zinc-600 transition-transform ${ease}`}
                strokeWidth={1}
                strokeDasharray="3 3"
                style={{
                  // Grow each thread from its complaint toward the middle.
                  transformOrigin: `${anchor.x}px ${anchor.y}px`,
                  transform: phase >= 2 ? "scale(1)" : "scale(0)",
                  transitionDelay: animate ? `${index * 120}ms` : "0ms",
                }}
              />
            );
          })}
        </svg>

        {items.map((signal, index) => {
          const anchor = ANCHORS[index];
          return (
            <div
              key={signal.text}
              className={`absolute w-[42%] sm:w-[11rem] -translate-x-1/2 -translate-y-1/2 border bg-white dark:bg-zinc-950 px-3 py-2 transition-[opacity,border-color] ${ease} ${
                phase >= 3 ? "border-zinc-200 dark:border-zinc-800" : "border-zinc-300 dark:border-zinc-700"
              }`}
              style={{
                left: `${anchor.x}%`,
                top: `${anchor.y}%`,
                // Faint placeholders before the play, so the stage is never an empty box.
                opacity: phase === 0 ? 0.2 : 1,
                transitionDelay: animate && phase === 1 ? `${index * 180}ms` : "0ms",
              }}
            >
              {/* Dim the words, not the chip: an opaque chip keeps the threads hidden behind it. */}
              <div className={`transition-opacity ${ease} ${phase >= 3 ? "opacity-55" : "opacity-100"}`}>
                <div className="font-mono text-[10px] uppercase tracking-wider text-meta mb-0.5">{signal.team}</div>
                <div className="text-[11px] sm:text-xs leading-snug text-prose">{signal.text}</div>
              </div>
            </div>
          );
        })}

        <div
          className={`absolute left-1/2 top-1/2 w-[30%] sm:w-[10rem] border border-lime-600 dark:border-lime-400 bg-white dark:bg-zinc-950 px-3 py-3 text-center transition-[opacity,transform] ${ease}`}
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${phase >= 3 ? 1 : 0.85})`,
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">Pattern</div>
          <div className="font-display text-sm sm:text-base font-extrabold leading-tight tracking-tight text-heading">
            {problem}
          </div>
        </div>
      </div>

      <div className="border border-t-0 border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-meta">Sponsorship</span>
        {sponsors.map((sponsor, index) => (
          <span
            key={sponsor}
            className={`flex items-center gap-2 text-sm text-heading transition-[opacity,transform] ${ease}`}
            style={{
              opacity: phase >= FINAL ? 1 : 0.25,
              transform: phase >= FINAL ? "translateY(0)" : "translateY(4px)",
              transitionDelay: animate && phase >= FINAL ? `${index * 220}ms` : "0ms",
            }}
          >
            <span
              aria-hidden="true"
              className={`inline-flex size-4 items-center justify-center border text-[10px] leading-none ${
                phase >= FINAL
                  ? "border-lime-600 dark:border-lime-400 text-lime-700 dark:text-lime-400"
                  : "border-zinc-300 dark:border-zinc-700 text-transparent"
              }`}
            >
              ✓
            </span>
            {sponsor}
          </span>
        ))}
        <button
          type="button"
          onClick={play}
          className="touch-target focus-ring ml-auto font-mono text-xs text-meta hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          Replay
        </button>
      </div>

      {caption && (
        <figcaption className="mt-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
