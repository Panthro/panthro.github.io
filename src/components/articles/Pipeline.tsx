import type { CSSProperties } from "react";

type Stage = {
  name: string;
  duration: string;
  detail: string;
};

type Props = {
  title?: string;
  stages: Stage[];
};

export function Pipeline({ title, stages }: Props) {
  return (
    <div
      className="article-reveal not-prose my-8 font-mono text-sm"
      role="list"
      aria-label={title ?? "Pipeline stages"}
    >
      {title && (
        <div className="text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4" role="presentation">
          {title}
        </div>
      )}
      <div className="article-stagger border border-zinc-200 dark:border-zinc-800">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;

          return (
            <div
              key={stage.name}
              className={`article-stagger-item flex flex-col sm:flex-row sm:items-stretch ${
                !isLast ? "border-b border-zinc-200 dark:border-zinc-800" : ""
              }`}
              style={{ "--i": index } as CSSProperties}
              role="listitem"
            >
              <div className="sm:w-36 shrink-0 px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800 flex sm:flex-col sm:justify-center gap-1">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">{stage.name}</span>
                <span className="text-xs text-lime-700 dark:text-lime-400 tabular-nums">{stage.duration}</span>
              </div>
              <div className="px-4 py-3 flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{stage.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
