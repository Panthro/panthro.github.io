import { useState } from "react";

type Rung = {
  id: string;
  label: string;
  /** When this rung became the everyday way to build, e.g. "1970s". */
  era: string;
  /** The same small program, written at this level. */
  code: string;
  /** What this level hides from you. */
  hidden: string;
  /** A failure that forces you to go one level down. */
  breaksWhen: string;
};

type Props = {
  title?: string;
  /** Ordered from the top (most abstract) to the bottom (closest to the machine). */
  rungs: Rung[];
  /** Index of the rung selected at first render. */
  initial?: number;
  caption?: string;
};

/**
 * A ladder of programming abstractions, top to bottom. Every rung shows the
 * same small program at that level; the rungs below the selected one are
 * marked as hidden from you. "Go down" walks one level closer to the machine.
 * SSR renders the initial rung.
 */
export function AbstractionLadder({ title, rungs, initial = 0, caption }: Props) {
  const [active, setActive] = useState(initial);
  const rung = rungs[active];
  const hiddenCount = rungs.length - 1 - active;

  const select = (index: number, via: string) => {
    if (index < 0 || index >= rungs.length) return;
    window.posthog?.capture("ladder_rung_select", { rung_id: rungs[index].id, via });
    setActive(index);
  };

  return (
    <figure suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={title ?? "Abstraction ladder"}>
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5">
        <div className="grid gap-5 md:grid-cols-[13rem_1fr]">
          <ol className="space-y-1.5" aria-label="Levels, most abstract first">
            {rungs.map((item, index) => {
              const selected = index === active;
              const below = index > active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(index, "rung")}
                    className={`touch-target focus-ring w-full grid grid-cols-[1fr_auto] items-baseline gap-2 border px-2.5 py-2 text-left transition-[opacity,border-color,background-color] duration-300 ${
                      selected
                        ? "border-lime-600 dark:border-lime-400 bg-white dark:bg-zinc-950"
                        : below
                          ? "border-dashed border-amber-500/60 dark:border-amber-400/50 bg-transparent opacity-80 hover:opacity-100"
                          : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span className={`text-sm leading-tight ${selected ? "text-heading font-medium" : "text-prose"}`}>
                      {item.label}
                      {below && <span className="sr-only"> (hidden from you)</span>}
                    </span>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        below ? "text-amber-700 dark:text-amber-400" : "text-meta"
                      }`}
                    >
                      {below ? "hidden" : item.era}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="min-w-0" aria-live="polite">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-lime-700 dark:text-lime-400">
                {rung.label} · {rung.era}
              </div>
              <div className="font-mono text-[10px] text-meta tabular-nums">
                {hiddenCount === 0 ? "nothing below" : `${hiddenCount} ${hiddenCount === 1 ? "level" : "levels"} below you`}
              </div>
            </div>

            <pre className="min-h-[12.5rem] overflow-x-auto border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-black px-3 py-3 font-mono text-[12px] leading-relaxed text-zinc-100">
              <code>{rung.code}</code>
            </pre>

            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                  Hidden from you
                </dt>
                <dd className="text-xs leading-snug text-prose">{rung.hidden}</dd>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                  You go down when
                </dt>
                <dd className="text-xs leading-snug text-prose">{rung.breaksWhen}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => select(active - 1, "up")}
                disabled={active === 0}
                className="touch-target focus-ring border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 font-mono text-xs text-heading hover:border-lime-600 dark:hover:border-lime-400 disabled:opacity-40 disabled:hover:border-zinc-300 dark:disabled:hover:border-zinc-700"
              >
                ↑ Up a level
              </button>
              <button
                type="button"
                onClick={() => select(active + 1, "down")}
                disabled={active === rungs.length - 1}
                className="touch-target focus-ring border border-lime-600 dark:border-lime-400 px-3 py-1.5 font-mono text-xs text-heading hover:bg-lime-600/10 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                ↓ Go down
              </button>
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
