import type { CSSProperties } from "react";

type Item = {
  title: string;
  body: string;
};

type Props = {
  items: Item[];
};

export function SignalList({ items }: Props) {
  return (
    <div className="article-reveal not-prose my-8 article-stagger border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
      {items.map((item, index) => (
        <div
          key={item.title}
          className="article-stagger-item flex gap-4 p-4 sm:p-5"
          style={{ "--i": index } as CSSProperties}
        >
          <div
            className="signal-list-mark shrink-0 w-12 h-1 mt-2 bg-lime-600 dark:bg-lime-400"
            style={{ "--i": index } as CSSProperties}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug">
              {item.title}
            </div>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
