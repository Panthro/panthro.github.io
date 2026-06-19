import type { CSSProperties } from "react";

type Item = {
  question: string;
  detail?: string;
};

type Props = {
  title?: string;
  items: Item[];
};

export function Checklist({ title, items }: Props) {
  return (
    <div
      className="article-reveal not-prose my-8 border border-zinc-200 dark:border-zinc-800"
      role="list"
      aria-label={title ?? "Checklist"}
    >
      {title && (
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider">
          {title}
        </div>
      )}
      <div className="article-stagger">
        {items.map((item, index) => (
          <div
            key={item.question}
            className={`article-stagger-item flex gap-4 px-4 py-3 ${
              index < items.length - 1 ? "border-b border-zinc-200 dark:border-zinc-800" : ""
            }`}
            style={{ "--i": index } as CSSProperties}
            role="listitem"
          >
            <span
              className="shrink-0 font-mono text-xs font-semibold text-lime-700 dark:text-lime-400 tabular-nums w-5"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-white leading-snug">{item.question}</div>
              {item.detail && (
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
