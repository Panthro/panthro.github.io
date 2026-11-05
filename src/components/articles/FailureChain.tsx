import { useState } from "react";

type Control = {
  id: string;
  label: string;
  detail?: string;
};

type Step = {
  text: string;
  detail?: string;
  /** Control ids that would have stopped the chain at this step. */
  stoppedBy?: string[];
  /** What the damage would have been if the chain stopped here. */
  contained?: string;
};

type Scenario = {
  id: string;
  label: string;
  steps: Step[];
  outcome: string;
};

type Props = {
  title?: string;
  controls: Control[];
  scenarios: Scenario[];
  caption?: string;
};

/**
 * An incident replayed as a chain of steps, with toggleable controls. Turning a
 * control on breaks the chain at the first step it applies to and greys out
 * everything after it. SSR renders the first scenario with no controls on,
 * which is the incident as it happened.
 */
export function FailureChain({ title, controls, scenarios, caption }: Props) {
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState<string[]>([]);
  const scenario = scenarios[active];

  const breakIndex = scenario.steps.findIndex((step) =>
    (step.stoppedBy ?? []).some((id) => enabled.includes(id))
  );
  const broken = breakIndex !== -1;
  const breakStep = broken ? scenario.steps[breakIndex] : undefined;
  const breaker = breakStep
    ? controls.find((control) => enabled.includes(control.id) && breakStep.stoppedBy?.includes(control.id))
    : undefined;

  const toggle = (id: string) => {
    const next = enabled.includes(id) ? enabled.filter((item) => item !== id) : [...enabled, id];
    window.posthog?.capture("failure_chain_control_toggled", {
      control_id: id,
      enabled: next.includes(id),
      scenario_id: scenario.id,
    });
    setEnabled(next);
  };

  const select = (index: number) => {
    window.posthog?.capture("failure_chain_scenario_selected", { scenario_id: scenarios[index].id });
    setActive(index);
  };

  return (
    <figure
      suppressHydrationWarning
      className="article-reveal not-prose my-12"
      aria-label={title ?? "Incident failure chain"}
    >
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      {scenarios.length > 1 && (
        <div role="tablist" aria-label="Incident" className="flex flex-wrap border border-b-0 border-zinc-200 dark:border-zinc-800">
          {scenarios.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`chain-${item.id}`}
                onClick={() => select(index)}
                className={`touch-target focus-ring flex-1 min-w-[7rem] px-3 py-2.5 font-mono text-xs text-left border-b-2 transition-colors ${
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
      )}

      <div
        id={`chain-${scenario.id}`}
        role={scenarios.length > 1 ? "tabpanel" : undefined}
        className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5"
      >
        <div className="font-mono text-[10px] uppercase tracking-wider text-meta mb-2">Controls in place</div>
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Controls">
          {controls.map((control) => {
            const on = enabled.includes(control.id);
            return (
              <button
                key={control.id}
                type="button"
                aria-pressed={on}
                title={control.detail}
                onClick={() => toggle(control.id)}
                className={`touch-target focus-ring inline-flex items-center gap-2 border px-2.5 py-1.5 font-mono text-[11px] text-left transition-colors ${
                  on
                    ? "border-lime-600 dark:border-lime-400 text-heading bg-white dark:bg-zinc-950"
                    : "border-zinc-300 dark:border-zinc-700 text-meta hover:text-heading"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex size-3.5 shrink-0 items-center justify-center border text-[9px] font-bold leading-none ${
                    on ? "border-lime-600 dark:border-lime-400 text-lime-700 dark:text-lime-400" : "border-zinc-400 dark:border-zinc-600"
                  }`}
                >
                  {on ? "✓" : ""}
                </span>
                {control.label}
              </button>
            );
          })}
        </div>

        <ol className="relative">
          {scenario.steps.map((step, index) => {
            const isBreak = index === breakIndex;
            const skipped = broken && index > breakIndex;
            return (
              <li key={`${scenario.id}-${index}`} className="relative grid grid-cols-[1.75rem_1fr] gap-3 pb-3 last:pb-0">
                {index < scenario.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[0.8125rem] top-7 bottom-0 border-l ${
                      broken && index >= breakIndex ? "border-dashed border-zinc-300 dark:border-zinc-700" : "border-zinc-400 dark:border-zinc-600"
                    }`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative z-10 inline-flex size-7 items-center justify-center border font-mono text-[11px] tabular-nums transition-colors ${
                    isBreak
                      ? "border-lime-600 dark:border-lime-400 text-lime-700 dark:text-lime-400 bg-white dark:bg-zinc-950"
                      : skipped
                        ? "border-zinc-300 dark:border-zinc-700 text-meta bg-zinc-50 dark:bg-zinc-900"
                        : "border-zinc-400 dark:border-zinc-600 text-heading bg-white dark:bg-zinc-950"
                  }`}
                >
                  {isBreak ? "■" : String(index + 1).padStart(2, "0")}
                </span>
                <div className={`min-w-0 pt-0.5 transition-opacity duration-300 ${skipped ? "opacity-40" : "opacity-100"}`}>
                  <div className={`text-sm leading-snug text-heading ${skipped ? "line-through decoration-zinc-400" : ""}`}>
                    {skipped && <span className="sr-only">Never happens: </span>}
                    {step.text}
                  </div>
                  {step.detail && <div className="mt-0.5 text-xs leading-relaxed text-prose">{step.detail}</div>}
                  {isBreak && breaker && (
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-lime-700 dark:text-lime-400">
                      Stopped here by {breaker.label}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div
          aria-live="polite"
          className={`mt-5 border bg-white dark:bg-zinc-950 px-3 sm:px-4 py-3 transition-colors ${
            broken ? "border-lime-600 dark:border-lime-400" : "border-red-600 dark:border-red-400"
          }`}
        >
          <div
            className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
              broken ? "text-lime-700 dark:text-lime-400" : "text-red-700 dark:text-red-400"
            }`}
          >
            {broken ? `✓ Contained at step ${String(breakIndex + 1).padStart(2, "0")}` : "✕ What happened"}
          </div>
          <div className="text-sm leading-snug text-heading">
            {broken ? breakStep?.contained ?? "The rest of the chain never runs." : scenario.outcome}
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
