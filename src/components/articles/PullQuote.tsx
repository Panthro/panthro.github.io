type Props = {
  children: string;
  attribution?: string;
};

export function PullQuote({ children, attribution }: Props) {
  return (
    <figure className="article-reveal not-prose my-10 border-t border-b border-zinc-200 dark:border-zinc-800 py-8">
      <blockquote className="font-display text-2xl sm:text-[1.75rem] font-extrabold leading-snug tracking-tight text-zinc-900 dark:text-white text-pretty">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 font-mono text-xs text-zinc-600 dark:text-zinc-500">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
