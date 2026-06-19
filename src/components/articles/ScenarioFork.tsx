import type { CSSProperties } from "react";

type Path = {
  label: string;
  steps: string[];
  outcome: string;
};

type Props = {
  premise: string;
  wall: Path;
  bridge: Path;
};

export function ScenarioFork({ premise, wall, bridge }: Props) {
  return (
    <div
      className="article-reveal not-prose my-10 space-y-4"
      role="group"
      aria-label="Two responses to the same idea"
    >
      <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider uppercase">
        {premise}
      </p>
      <div className="article-stagger grid sm:grid-cols-2 border border-zinc-200 dark:border-zinc-800">
        <PathBlock path={wall} variant="wall" index={0} />
        <PathBlock path={bridge} variant="bridge" index={1} />
      </div>
    </div>
  );
}

type PathBlockProps = {
  path: Path;
  variant: "wall" | "bridge";
  index: number;
};

function PathBlock({ path, variant, index }: PathBlockProps) {
  const isBridge = variant === "bridge";

  return (
    <div
      className={`article-stagger-item article-stagger-item--${variant} p-5 sm:p-6 ${
        isBridge
          ? "bg-zinc-50 dark:bg-zinc-900/40 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800"
          : "bg-white dark:bg-zinc-950"
      }`}
      style={{ "--i": index } as CSSProperties}
    >
      <div
        className={`font-display text-lg sm:text-xl font-extrabold tracking-tight mb-4 ${
          isBridge ? "text-lime-700 dark:text-lime-400" : "text-zinc-500 dark:text-zinc-500"
        }`}
      >
        {path.label}
      </div>
      <ol className="space-y-3 mb-5">
        {path.steps.map((step, stepIndex) => (
          <li
            key={step}
            className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            <span
              className={`shrink-0 font-mono text-xs tabular-nums mt-0.5 ${
                isBridge ? "text-lime-700 dark:text-lime-400" : "text-zinc-400 dark:text-zinc-600"
              }`}
              aria-hidden="true"
            >
              {stepIndex + 1}.
            </span>
            {step}
          </li>
        ))}
      </ol>
      <div
        className={`pt-4 border-t text-sm leading-snug ${
          isBridge
            ? "border-lime-600/30 dark:border-lime-400/30 text-zinc-800 dark:text-zinc-200"
            : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
        }`}
      >
        <span className="font-mono text-xs uppercase tracking-wider block mb-1 text-zinc-500 dark:text-zinc-500">
          Outcome
        </span>
        {path.outcome}
      </div>
    </div>
  );
}
