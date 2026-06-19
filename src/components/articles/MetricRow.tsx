import type { CSSProperties } from "react";

type Metric = {
  value: string;
  label: string;
  highlight?: boolean;
};

type Props = {
  metrics: Metric[];
};

export function MetricRow({ metrics }: Props) {
  return (
    <div
      className="article-reveal not-prose my-8 grid grid-cols-2 sm:grid-cols-3 article-stagger border border-zinc-200 dark:border-zinc-800 divide-x divide-y sm:divide-y-0 divide-zinc-200 dark:divide-zinc-800"
      role="list"
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className="article-stagger-item p-4 sm:p-5 bg-zinc-50/50 dark:bg-zinc-900/20"
          style={{ "--i": index } as CSSProperties}
          role="listitem"
        >
          <div
            className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
              metric.highlight
                ? "text-lime-700 dark:text-lime-400"
                : "text-zinc-900 dark:text-white"
            }`}
          >
            {metric.value}
          </div>
          <div className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-500 leading-snug">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
