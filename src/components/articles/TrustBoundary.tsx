import { useEffect, useRef, useState } from "react";

type Status = "pass" | "fail" | "flag";

type Step =
  | { kind: "client"; text: string }
  | { kind: "server"; label: string; text: string; status: Status }
  | { kind: "request" | "response"; text: string };

type Scenario = {
  id: string;
  label: string;
  steps: Step[];
  outcome: { status: Status; ledger: string; text: string };
};

type Props = {
  title?: string;
  scenarios: Scenario[];
  caption?: string;
};

const STATUS: Record<Status, { mark: string; word: string; text: string; border: string }> = {
  pass: {
    mark: "✓",
    word: "passed",
    text: "text-lime-700 dark:text-lime-400",
    border: "border-lime-600 dark:border-lime-400",
  },
  fail: {
    mark: "✕",
    word: "failed",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-600 dark:border-red-400",
  },
  flag: {
    mark: "!",
    word: "flagged",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-600 dark:border-amber-400",
  },
};

const STEP_MS = 420;

/**
 * Sequence diagram with a client lane, a server lane and the trust boundary
 * between them. Tabs switch scenarios; steps play in order. SSR and reduced
 * motion render every step of the first scenario.
 */
export function TrustBoundary({ title, scenarios, caption }: Props) {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];
  const total = scenario.steps.length + 1; // + outcome row
  const [shown, setShown] = useState(total);
  const [animate, setAnimate] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const reduced = useRef(false);

  const play = (count: number) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (reduced.current) {
      setShown(count);
      return;
    }
    setAnimate(false);
    setShown(0);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        for (let i = 1; i <= count; i++) {
          timers.current.push(window.setTimeout(() => setShown(i), i * STEP_MS));
        }
      })
    );
  };

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const node = rootRef.current;
    if (!node) return;

    setShown(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          play(total);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);

    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach(window.clearTimeout);
    };
    // play only touches refs and setters, so mount-once is safe.
  }, []);

  const select = (index: number) => {
    setActive(index);
    play(scenarios[index].steps.length + 1);
  };

  const ease = animate ? "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : "duration-0";
  const reveal = (index: number) =>
    `transition-[opacity,transform] ${ease} ${index < shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`;

  const outcome = STATUS[scenario.outcome.status];

  return (
    <figure
      ref={rootRef}
      suppressHydrationWarning
      className="article-reveal not-prose my-12"
      aria-label={title ?? "Client and server trust boundary"}
    >
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div role="tablist" aria-label="Scenario" className="flex flex-wrap border border-b-0 border-zinc-200 dark:border-zinc-800">
        {scenarios.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`trust-${item.id}`}
              onClick={() => select(index)}
              className={`touch-target focus-ring flex-1 min-w-[7rem] px-3 py-2.5 font-mono text-xs text-left border-b-2 transition-colors ${
                selected
                  ? "border-lime-600 dark:border-lime-400 text-heading bg-zinc-50 dark:bg-zinc-900/40"
                  : "border-transparent text-meta hover:text-heading"
              }`}
            >
              <span className="text-[10px] mr-1.5 opacity-60">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`trust-${scenario.id}`}
        role="tabpanel"
        className="relative border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5"
      >
        {/* Lane headers */}
        <div className="grid grid-cols-[1fr_2rem_1fr] sm:grid-cols-[1fr_3rem_1fr] items-end mb-4">
          <div>
            <div className="font-display text-sm sm:text-base font-extrabold tracking-tight text-heading">Client</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 leading-snug">
              Whoever holds the device controls this
            </div>
          </div>
          <div />
          <div className="text-right">
            <div className="font-display text-sm sm:text-base font-extrabold tracking-tight text-heading">Server</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-lime-700 dark:text-lime-400 leading-snug">
              Only the bank controls this
            </div>
          </div>
        </div>

        <div className="relative">
          {/* The boundary itself */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="h-full border-l border-dashed border-zinc-400 dark:border-zinc-600" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-50 dark:bg-[#0f0f11] px-1.5 font-mono text-[9px] uppercase tracking-widest text-meta whitespace-nowrap"
          >
            trust boundary
          </div>

          <ol className="relative space-y-2.5 pt-3">
            {scenario.steps.map((step, index) => (
              <li key={`${scenario.id}-${index}`} className={reveal(index)}>
                <StepRow step={step} />
              </li>
            ))}
          </ol>
        </div>

        <div
          className={`relative mt-5 border ${outcome.border} bg-white dark:bg-zinc-950 px-3 sm:px-4 py-3 ${reveal(scenario.steps.length)}`}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
            <span className={`font-mono text-[10px] uppercase tracking-wider ${outcome.text}`}>
              {outcome.mark} Outcome
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-meta">
              Ledger: <span className={outcome.text}>{scenario.outcome.ledger}</span>
            </span>
          </div>
          <div className="text-sm leading-snug text-heading">{scenario.outcome.text}</div>
        </div>

      </div>

      <figcaption className="mt-2 flex items-start justify-between gap-4">
        <span className="pt-2.5 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</span>
        <button
          type="button"
          onClick={() => play(total)}
          className="touch-target focus-ring shrink-0 font-mono text-xs text-meta hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          Replay
        </button>
      </figcaption>
    </figure>
  );
}

function StepRow({ step }: { step: Step }) {
  if (step.kind === "client") {
    return (
      <div className="grid grid-cols-[1fr_2rem_1fr] sm:grid-cols-[1fr_3rem_1fr]">
        <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-2 text-[11px] sm:text-xs leading-snug text-prose">
          <span className="sr-only">Client: </span>
          {step.text}
        </div>
      </div>
    );
  }

  if (step.kind === "server") {
    const status = STATUS[step.status];
    return (
      <div className="grid grid-cols-[1fr_2rem_1fr] sm:grid-cols-[1fr_3rem_1fr]">
        <div className="col-start-3 flex gap-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-2">
          <span
            aria-hidden="true"
            className={`mt-px inline-flex size-4 shrink-0 items-center justify-center border text-[10px] font-bold leading-none ${status.border} ${status.text}`}
          >
            {status.mark}
          </span>
          <div className="min-w-0">
            <div className={`font-mono text-[10px] uppercase tracking-wider ${status.text}`}>
              {step.label}
              <span className="sr-only"> {status.word}</span>
            </div>
            <div className="text-[11px] sm:text-xs leading-snug text-prose">{step.text}</div>
          </div>
        </div>
      </div>
    );
  }

  const toServer = step.kind === "request";
  return (
    <div className="px-1 py-1">
      <div className={`font-mono text-[10px] sm:text-[11px] leading-snug text-heading mb-1 ${toServer ? "text-left" : "text-right"}`}>
        <span className="relative bg-zinc-50 dark:bg-[#0f0f11] px-1 -mx-1 box-decoration-clone">
          <span className="sr-only">{toServer ? "Request to server: " : "Response to client: "}</span>
          {step.text}
        </span>
      </div>
      <div aria-hidden="true" className={`flex items-center ${toServer ? "" : "flex-row-reverse"}`}>
        <div className="h-px flex-1 bg-zinc-500 dark:bg-zinc-400" />
        <svg width="8" height="10" viewBox="0 0 8 10" className={`shrink-0 fill-zinc-500 dark:fill-zinc-400 ${toServer ? "" : "rotate-180"}`}>
          <path d="M0 0 L8 5 L0 10 Z" />
        </svg>
      </div>
    </div>
  );
}
