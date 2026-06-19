import type { CSSProperties } from "react";

type TimelineItem = {
  time: string;
  label: string;
  detail?: string;
  highlight?: boolean;
};

type Props = {
  items: TimelineItem[];
  title?: string;
};

export function Timeline({ items, title }: Props) {
  return (
    <div
      className="article-reveal not-prose my-8 font-mono text-sm"
      role="list"
      aria-label={title ?? "Timeline"}
    >
      {title && (
        <div className="text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4" role="presentation">
          {title}
        </div>
      )}
      <div className="relative article-stagger">
        <div
          className="timeline-track absolute left-[4.25rem] sm:left-[5.5rem] top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-800"
          aria-hidden="true"
        />

        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={i}
              className="article-stagger-item flex gap-0 items-start group"
              style={{ "--i": i } as CSSProperties}
              role="listitem"
            >
              <div
                className="w-[4.25rem] sm:w-[5.5rem] shrink-0 text-right pr-3 sm:pr-4 pt-3 text-[0.6875rem] sm:text-xs text-zinc-600 dark:text-zinc-500 tabular-nums"
                aria-label={`Time: ${item.time}`}
              >
                {item.time}
              </div>

              <div className="relative shrink-0 w-3 mt-4" aria-hidden="true">
                <div
                  className={`size-2 rounded-full border transition-colors duration-300 ${
                    item.highlight
                      ? "bg-lime-600 border-lime-600 dark:bg-lime-400 dark:border-lime-400"
                      : "bg-zinc-100 border-zinc-400 group-hover:border-zinc-500 dark:bg-zinc-950 dark:border-zinc-600 dark:group-hover:border-zinc-400"
                  }`}
                />
              </div>

              <div className="pl-3 sm:pl-4 pb-4 pt-2 min-w-0 flex-1">
                <div
                  className={`text-sm ${
                    item.highlight
                      ? "text-lime-700 dark:text-lime-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {item.label}
                </div>
                {item.detail && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5 leading-relaxed">
                    {item.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
