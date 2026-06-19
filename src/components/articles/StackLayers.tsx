import type { CSSProperties } from "react";

type Layer = {
  name: string;
  summary: string;
  tags: string[];
};

type Props = {
  title?: string;
  layers: Layer[];
};

export function StackLayers({ title, layers }: Props) {
  return (
    <div
      className="article-reveal not-prose my-8"
      role="list"
      aria-label={title ?? "Architecture stack layers"}
    >
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">
          {title}
        </div>
      )}
      <div className="article-stagger border border-zinc-200 dark:border-zinc-800">
        {layers.map((layer, index) => {
          const isLast = index === layers.length - 1;

          return (
            <div
              key={layer.name}
              className={`article-stagger-item ${
                !isLast ? "border-b border-zinc-200 dark:border-zinc-800" : ""
              }`}
              style={{ "--i": index } as CSSProperties}
              role="listitem"
            >
              <div className="flex gap-0">
                <div
                  className="w-1 shrink-0 bg-lime-600 dark:bg-lime-400"
                  style={{ opacity: 1 - index * 0.12 }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                    <div className="min-w-0">
                      <div className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug">
                        {layer.name}
                      </div>
                      <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {layer.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:justify-end sm:max-w-[14rem] shrink-0">
                      {layer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.625rem] px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
