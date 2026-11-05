import { useState, type ReactNode } from "react";

type Layer = {
  id: string;
  label: string;
  detail?: string;
  /** The worst case if this is the outermost layer the actor can reach. */
  loss: string;
};

type Control = {
  id: string;
  label: string;
  detail?: string;
  /** Layer ids this control puts out of reach. */
  protects: string[];
};

type Props = {
  title?: string;
  /** What sits at the centre, e.g. "Agent's credential". */
  actor: string;
  /** Ordered from the innermost layer outwards. */
  layers: Layer[];
  controls: Control[];
  caption?: string;
};

/**
 * Nested boxes showing how far one credential can reach. Reach is contiguous:
 * it stops at the first layer any enabled control protects, and everything
 * outside that is safe too. SSR renders every control off, the full radius.
 */
export function BlastRadius({ title, actor, layers, controls, caption }: Props) {
  const [enabled, setEnabled] = useState<string[]>([]);

  const protectorOf = (layerId: string) =>
    controls.find((control) => enabled.includes(control.id) && control.protects.includes(layerId));

  const firstSafe = layers.findIndex((layer) => protectorOf(layer.id));
  const reached = firstSafe === -1 ? layers.length : firstSafe;
  const worst = layers[Math.max(reached - 1, 0)];
  const stopper = firstSafe === -1 ? undefined : protectorOf(layers[firstSafe].id);

  const toggle = (id: string) => {
    const next = enabled.includes(id) ? enabled.filter((item) => item !== id) : [...enabled, id];
    window.posthog?.capture("blast_radius_control_toggled", { control_id: id, enabled: next.includes(id) });
    setEnabled(next);
  };

  const ring = (index: number, inner: ReactNode): ReactNode => {
    const layer = layers[index];
    const inReach = index < reached;
    const node = (
      <div
        className={`border p-2 sm:p-3 transition-colors duration-300 ${
          inReach
            ? "border-red-600/70 dark:border-red-400/70 bg-red-50/60 dark:bg-red-950/20"
            : "border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
        }`}
      >
        {inner}
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <span className={`text-xs sm:text-sm font-medium leading-snug ${inReach ? "text-heading" : "text-meta"}`}>
            {layer.label}
            {layer.detail && <span className="font-normal text-meta"> · {layer.detail}</span>}
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              inReach ? "text-red-700 dark:text-red-400" : "text-lime-700 dark:text-lime-400"
            }`}
          >
            {inReach ? "in reach" : "out of reach"}
          </span>
        </div>
      </div>
    );
    return index === layers.length - 1 ? node : ring(index + 1, node);
  };

  const core = (
    <div className="border border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-950 px-2.5 py-2 font-mono text-[11px] text-heading">
      {actor}
    </div>
  );

  return (
    <figure suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={title ?? "Blast radius"}>
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5">
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

        {ring(0, core)}

        <div
          aria-live="polite"
          className={`mt-5 border bg-white dark:bg-zinc-950 px-3 sm:px-4 py-3 transition-colors ${
            stopper ? "border-lime-600 dark:border-lime-400" : "border-red-600 dark:border-red-400"
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                stopper ? "text-lime-700 dark:text-lime-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              Worst case
            </span>
            {stopper && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-meta">
                Capped by <span className="text-lime-700 dark:text-lime-400">{stopper.label}</span>
              </span>
            )}
          </div>
          <div className="text-sm leading-snug text-heading">{worst.loss}</div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
