import { useState } from "react";

type Result = "pass" | "block" | "skip" | "human";

type Layer = {
  id: string;
  label: string;
  /** What this layer looks at, in a few words. */
  checks: string;
  /** How long it usually takes, e.g. "~1 min". */
  time?: string;
};

type Scenario = {
  id: string;
  label: string;
  /** Result per layer id; layers missing from the map count as passed. */
  results: Record<string, Result>;
  /** Why a blocking or human layer stopped it. */
  notes?: Record<string, string>;
  outcome: string;
};

type Props = {
  title?: string;
  layers: Layer[];
  scenarios: Scenario[];
  caption?: string;
};

const RESULT: Record<Result, { mark: string; word: string; text: string; border: string }> = {
  pass: { mark: "✓", word: "passed", text: "text-lime-700 dark:text-lime-400", border: "border-lime-600 dark:border-lime-400" },
  block: { mark: "✕", word: "blocked", text: "text-red-700 dark:text-red-400", border: "border-red-600 dark:border-red-400" },
  human: { mark: "!", word: "needs a human", text: "text-amber-700 dark:text-amber-400", border: "border-amber-600 dark:border-amber-400" },
  skip: { mark: "–", word: "not reached", text: "text-meta", border: "border-zinc-300 dark:border-zinc-700" },
};

/**
 * A pull request passing down a stack of merge gates. Scenario tabs swap the
 * kind of change; the first layer that blocks or asks for a human stops the
 * stack, and everything below it is shown as not reached.
 */
export function GateStack({ title, layers, scenarios, caption }: Props) {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];

  const stopIndex = layers.findIndex((layer) => {
    const result = scenario.results[layer.id];
    return result === "block" || result === "human";
  });

  const resultFor = (index: number): Result => {
    if (stopIndex !== -1 && index > stopIndex) return "skip";
    return scenario.results[layers[index].id] ?? "pass";
  };

  const final: Result = stopIndex === -1 ? "pass" : resultFor(stopIndex);

  const select = (index: number) => {
    window.posthog?.capture("gate_stack_scenario_selected", { scenario_id: scenarios[index].id });
    setActive(index);
  };

  return (
    <figure suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={title ?? "Merge gates"}>
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div role="tablist" aria-label="Kind of change" className="flex flex-wrap border border-b-0 border-zinc-200 dark:border-zinc-800">
        {scenarios.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`gates-${item.id}`}
              onClick={() => select(index)}
              className={`touch-target focus-ring flex-1 min-w-[8rem] px-3 py-2.5 font-mono text-xs text-left border-b-2 transition-colors ${
                selected
                  ? "border-lime-600 dark:border-lime-400 text-heading bg-zinc-50 dark:bg-zinc-900/40"
                  : "border-transparent text-meta hover:text-heading"
              }`}
            >
              <span className="text-[10px] mr-1.5 opacity-60">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`gates-${scenario.id}`}
        role="tabpanel"
        className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5"
      >
        <ol className="space-y-1.5">
          {layers.map((layer, index) => {
            const result = resultFor(index);
            const style = RESULT[result];
            const note = scenario.notes?.[layer.id];
            const reached = result !== "skip";
            return (
              <li
                key={`${scenario.id}-${layer.id}`}
                className={`grid grid-cols-[1.75rem_1fr_auto] items-start gap-3 border bg-white dark:bg-zinc-950 px-2.5 py-2 transition-opacity duration-300 ${
                  result === "block" || result === "human" ? style.border : "border-zinc-200 dark:border-zinc-800"
                } ${reached ? "opacity-100" : "opacity-45"}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex size-5 items-center justify-center border text-[11px] font-bold leading-none ${style.border} ${style.text}`}
                >
                  {style.mark}
                </span>
                <div className="min-w-0">
                  <div className="text-sm leading-snug text-heading">
                    {layer.label}
                    <span className="sr-only">: {style.word}</span>
                  </div>
                  <div className="text-xs leading-snug text-prose">{layer.checks}</div>
                  {note && reached && <div className={`mt-1 text-xs leading-snug ${style.text}`}>{note}</div>}
                </div>
                {layer.time && <span className="pt-0.5 font-mono text-[10px] text-meta tabular-nums whitespace-nowrap">{layer.time}</span>}
              </li>
            );
          })}
        </ol>

        <div aria-live="polite" className={`mt-5 border bg-white dark:bg-zinc-950 px-3 sm:px-4 py-3 ${RESULT[final].border}`}>
          <div className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${RESULT[final].text}`}>
            {final === "pass" ? "✓ Merged" : final === "block" ? "✕ Blocked" : "! Waits for a human"}
          </div>
          <div className="text-sm leading-snug text-heading">{scenario.outcome}</div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
