import type { CSSProperties } from "react";

type Column = {
  label: string;
  items: string[];
};

type Props = {
  before: Column;
  after: Column;
};

export function Compare({ before, after }: Props) {
  return (
    <div
      className="article-reveal article-reveal--compare not-prose my-8 grid sm:grid-cols-2 article-stagger border border-zinc-200 dark:border-zinc-800"
      role="group"
      aria-label={`Comparison: ${before.label} versus ${after.label}`}
    >
      <ColumnBlock column={before} variant="before" />
      <ColumnBlock column={after} variant="after" />
    </div>
  );
}

type ColumnBlockProps = {
  column: Column;
  variant: "before" | "after";
};

function ColumnBlock({ column, variant }: ColumnBlockProps) {
  const isAfter = variant === "after";

  return (
    <div
      className={`article-stagger-item article-stagger-item--${variant} p-4 sm:p-5 ${
        isAfter
          ? "bg-zinc-50 dark:bg-zinc-900/40 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800"
          : "bg-white dark:bg-zinc-950"
      }`}
      style={{ "--i": isAfter ? 1 : 0 } as CSSProperties}
    >
      <div
        className={`font-mono text-xs font-semibold tracking-wider uppercase mb-3 ${
          isAfter ? "text-lime-700 dark:text-lime-400" : "text-zinc-500 dark:text-zinc-500"
        }`}
      >
        {column.label}
      </div>
      <ul className="space-y-2">
        {column.items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            <span
              className={`shrink-0 mt-1.5 size-1.5 ${
                isAfter ? "bg-lime-600 dark:bg-lime-400" : "bg-zinc-400 dark:bg-zinc-600"
              }`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
