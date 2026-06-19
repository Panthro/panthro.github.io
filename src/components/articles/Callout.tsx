import type { ReactNode } from "react";

type CalloutType = "note" | "warning" | "tip" | "info";

const config: Record<CalloutType, { label: string; labelClass: string; borderClass: string; bgClass: string }> = {
  note: {
    label: "Note",
    labelClass: "text-lime-700 dark:text-lime-400",
    borderClass: "border border-zinc-300 dark:border-zinc-700",
    bgClass: "bg-zinc-100 dark:bg-zinc-900/60",
  },
  warning: {
    label: "Warning",
    labelClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border border-amber-300 dark:border-amber-900/50",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
  },
  tip: {
    label: "Tip",
    labelClass: "text-sky-700 dark:text-sky-400",
    borderClass: "border border-sky-200 dark:border-sky-900/50",
    bgClass: "bg-sky-50 dark:bg-sky-950/20",
  },
  info: {
    label: "Info",
    labelClass: "text-zinc-600 dark:text-zinc-400",
    borderClass: "border border-zinc-300 dark:border-zinc-700",
    bgClass: "bg-zinc-50 dark:bg-zinc-900/40",
  },
};

type Props = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

export function Callout({ type = "note", title, children }: Props) {
  const { label, labelClass, borderClass, bgClass } = config[type];

  return (
    <div className={`article-reveal not-prose my-6 p-4 ${borderClass} ${bgClass}`}>
      <div className={`font-mono text-xs font-semibold tracking-wider uppercase mb-2 ${labelClass}`}>
        {title ?? label}
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
