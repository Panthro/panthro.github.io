import { useState } from "react";

type Period = {
  label: string;
  prsPerDay: number;
  medianLines: number;
  /** Share of PRs opened by coding agents, 0–1. */
  agentShare?: number;
  highlight?: boolean;
};

type Props = {
  title?: string;
  periods: Period[];
  /** Starting values for the two sliders. */
  reviewers?: number;
  linesPerHour?: number;
  /** Focused review hours one person can give per day. */
  hoursPerReviewer?: number;
  caption?: string;
};

const fmt = (value: number) => (value < 10 ? value.toFixed(1) : Math.round(value).toString());

/**
 * Bars of careful-review hours a team would need per day, from PRs per day ×
 * median PR size ÷ review speed, against a capacity line set by the sliders.
 * SSR renders the default slider values.
 */
export function ReviewLoad({
  title,
  periods,
  reviewers: initialReviewers = 2,
  linesPerHour: initialSpeed = 400,
  hoursPerReviewer = 4,
  caption,
}: Props) {
  const [reviewers, setReviewers] = useState(initialReviewers);
  const [speed, setSpeed] = useState(initialSpeed);

  const needed = periods.map((period) => (period.prsPerDay * period.medianLines) / speed);
  const capacity = reviewers * hoursPerReviewer;
  const scale = Math.max(...needed, capacity) * 1.08;
  const latest = periods.length - 1;
  const over = needed[latest] / capacity;

  const track = (name: string, value: number) =>
    window.posthog?.capture("review_load_slider_changed", { slider: name, value });

  return (
    <figure suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={title ?? "Review load"}>
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <label className="block">
            <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-meta">
              Reviewers
              <span className="text-heading text-xs normal-case tracking-normal tabular-nums">
                {reviewers} × {hoursPerReviewer} h/day
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={reviewers}
              onChange={(event) => setReviewers(Number(event.target.value))}
              onPointerUp={() => track("reviewers", reviewers)}
              className="focus-ring mt-2 w-full accent-lime-600 dark:accent-lime-400"
            />
          </label>
          <label className="block">
            <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-meta">
              Careful review speed
              <span className="text-heading text-xs normal-case tracking-normal tabular-nums">{speed} lines/h</span>
            </span>
            <input
              type="range"
              min={200}
              max={1000}
              step={100}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              onPointerUp={() => track("lines_per_hour", speed)}
              className="focus-ring mt-2 w-full accent-lime-600 dark:accent-lime-400"
            />
          </label>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-lime-600 dark:border-lime-400 transition-[left] duration-300"
            style={{ left: `calc(7.5rem + (100% - 7.5rem) * ${capacity / scale})` }}
          >
            <span className="absolute -top-4 -translate-x-1/2 whitespace-nowrap bg-zinc-50 dark:bg-[#0f0f11] px-1 font-mono text-[9px] uppercase tracking-wider text-lime-700 dark:text-lime-400">
              capacity {fmt(capacity)} h
            </span>
          </div>

          <ul className="space-y-3 pt-3">
            {periods.map((period, index) => {
              const hours = needed[index];
              const exceeds = hours > capacity;
              return (
                <li key={period.label} className="grid grid-cols-[7.5rem_1fr] items-center gap-0">
                  <div className="pr-3">
                    <div className={`text-xs leading-tight ${period.highlight ? "text-heading font-medium" : "text-prose"}`}>
                      {period.label}
                    </div>
                    <div className="font-mono text-[10px] leading-tight text-meta tabular-nums">
                      {period.prsPerDay.toFixed(1)} PRs/day · {period.medianLines} lines
                      {period.agentShare !== undefined && <> · {Math.round(period.agentShare * 100)}% agent</>}
                    </div>
                  </div>
                  <div className="relative h-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    <div
                      className={`h-full transition-[width] duration-300 ${
                        exceeds ? "bg-red-600/70 dark:bg-red-400/60" : "bg-zinc-400 dark:bg-zinc-600"
                      }`}
                      style={{ width: `${(hours / scale) * 100}%` }}
                    />
                    <span className="absolute inset-y-0 right-1.5 flex items-center font-mono text-[11px] tabular-nums text-heading">
                      {fmt(hours)} h/day
                      <span className="sr-only">{exceeds ? ", over capacity" : ", within capacity"}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          aria-live="polite"
          className={`mt-5 border bg-white dark:bg-zinc-950 px-3 sm:px-4 py-3 ${
            over > 1 ? "border-red-600 dark:border-red-400" : "border-lime-600 dark:border-lime-400"
          }`}
        >
          <div
            className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
              over > 1 ? "text-red-700 dark:text-red-400" : "text-lime-700 dark:text-lime-400"
            }`}
          >
            {periods[latest].label}
          </div>
          <div className="text-sm leading-snug text-heading">
            {over > 1
              ? `Careful review would need ${fmt(needed[latest])} hours a day, ${over.toFixed(1)}× what ${reviewers} ${reviewers === 1 ? "person" : "people"} can give. The queue grows every day.`
              : `${fmt(needed[latest])} hours a day fits inside ${fmt(capacity)} hours of review capacity.`}
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
