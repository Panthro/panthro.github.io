import type { CSSProperties } from "react";

type Step = {
  id: string;
  label: string;
  sublabel?: string;
};

type Props = {
  title?: string;
  steps: Step[];
};

export function FlowDiagram({ title, steps }: Props) {
  return (
    <div className="article-reveal not-prose my-8" role="img" aria-label={title ?? "Architecture flow diagram"}>
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">{title}</div>
      )}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-max gap-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="flow-step flex items-center"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="border border-zinc-300 dark:border-zinc-700 px-3 py-2 min-w-[5.5rem] text-center bg-zinc-50 dark:bg-zinc-900/40">
                  <div className="font-mono text-xs font-semibold text-zinc-900 dark:text-white">{step.label}</div>
                  {step.sublabel && (
                    <div className="font-mono text-[0.625rem] text-zinc-500 dark:text-zinc-500 mt-0.5">
                      {step.sublabel}
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="px-1.5 font-mono text-zinc-400 dark:text-zinc-600 text-sm" aria-hidden="true">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
