import type { CSSProperties } from "react";

type Band = {
  to: number;
  label: string;
  action: string;
  variant: "low" | "mid" | "high";
};

type Props = {
  title?: string;
  bands: Band[];
};

const variantStyles: Record<Band["variant"], { bar: string; label: string }> = {
  low: {
    bar: "bg-zinc-300 dark:bg-zinc-700",
    label: "text-zinc-700 dark:text-zinc-300",
  },
  mid: {
    bar: "bg-amber-400/80 dark:bg-amber-500/60",
    label: "text-amber-800 dark:text-amber-300",
  },
  high: {
    bar: "bg-lime-600 dark:bg-lime-400",
    label: "text-lime-800 dark:text-lime-300",
  },
};

export function ScoreThreshold({ title, bands }: Props) {
  return (
    <div className="article-reveal not-prose my-8" role="group" aria-label={title ?? "Score thresholds"}>
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">{title}</div>
      )}

      <div
        className="flex h-2 w-full overflow-hidden border border-zinc-200 dark:border-zinc-800"
        aria-hidden="true"
      >
        {bands.map((band, index) => (
          <div
            key={band.label}
            className={`score-bar-segment ${variantStyles[band.variant].bar} ${
              band.variant === "low" ? "flex-[4]" : "flex-[3]"
            }`}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>

      <div className="mt-3 space-y-2 article-stagger">
        {bands.map((band, index) => (
          <div
            key={band.label}
            className="article-stagger-item flex flex-wrap gap-x-3 gap-y-0.5 items-baseline font-mono text-xs"
            style={{ "--i": index } as CSSProperties}
          >
            <span className={`font-semibold ${variantStyles[band.variant].label}`}>{band.label}</span>
            <span className="text-zinc-500 dark:text-zinc-500 tabular-nums">≤ {band.to}</span>
            <span className="text-zinc-600 dark:text-zinc-400">{band.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
