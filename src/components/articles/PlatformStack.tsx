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

export function PlatformStack({ title, layers }: Props) {
  const last = Math.max(layers.length - 1, 1);

  return (
    <div
      className="article-reveal not-prose my-8"
      role="list"
      aria-label={title ?? "Platform stack"}
    >
      {title && (
        <div className="font-mono text-xs text-meta tracking-wider mb-3">{title}</div>
      )}

      <div className="flex items-end justify-center gap-3">
        <div
          className="hidden sm:flex flex-col justify-between self-stretch py-3 font-mono text-[0.625rem] uppercase tracking-widest text-meta"
          aria-hidden="true"
        >
          <span>Surface</span>
          <span className="flex-1 w-px mx-auto my-2 bg-zinc-200 dark:bg-zinc-800" />
          <span>Ops</span>
        </div>

        <div className="article-stagger flex flex-1 flex-col items-center min-w-0">
          {layers.map((layer, index) => {
            const t = index / last;
            const width = 58 + t * 42;
            const inset = `${1.6 + t * 0.15}rem`;
            const clip = `polygon(${inset} 0, calc(100% - ${inset}) 0, 100% 100%, 0 100%)`;
            const isTop = index === 0;

            return (
              <div
                key={layer.name}
                className="article-stagger-item relative w-full"
                style={
                  {
                    maxWidth: `${width}%`,
                    marginTop: index === 0 ? 0 : -6,
                    zIndex: layers.length - index,
                    "--i": index,
                  } as CSSProperties
                }
                role="listitem"
              >
                <div
                  className="absolute inset-0 bg-zinc-300 dark:bg-zinc-700"
                  style={{ clipPath: clip }}
                  aria-hidden="true"
                />
                <div
                  className={`absolute inset-px ${
                    isTop ? "bg-zinc-50 dark:bg-zinc-900" : "bg-zinc-100/90 dark:bg-zinc-950"
                  }`}
                  style={{ clipPath: clip }}
                  aria-hidden="true"
                />
                {isTop && (
                  <div
                    className="absolute top-0 h-0.5 bg-lime-600 dark:bg-lime-400"
                    style={{ left: inset, right: inset }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="relative py-3.5 sm:py-4"
                  style={{ paddingLeft: `calc(${inset} + 0.75rem)`, paddingRight: `calc(${inset} + 0.75rem)` }}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[0.625rem] tabular-nums text-accent shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-heading leading-snug m-0">
                      {layer.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-prose leading-snug">{layer.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {layer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[0.625rem] px-1.5 py-0.5 border border-subtle text-meta"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
