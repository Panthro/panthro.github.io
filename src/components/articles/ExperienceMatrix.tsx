import type { CSSProperties } from "react";

type Props = {
  title?: string;
  columns: string[];
  rows?: number;
  caption?: string;
};

export function ExperienceMatrix({ title, columns, rows = 4, caption }: Props) {
  return (
    <div className="article-reveal not-prose my-8">
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">
          {title}
        </div>
      )}
      <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[36rem] border border-zinc-200 dark:border-zinc-800 text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/40">
              <th
                scope="col"
                className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-500 px-3 py-2 border-b border-r border-zinc-200 dark:border-zinc-800 text-left w-24"
              >
                Story
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-2 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 text-left min-w-[7rem]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="article-stagger">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr
                key={rowIndex}
                className="article-stagger-item"
                style={{ "--i": rowIndex } as CSSProperties}
              >
                <th
                  scope="row"
                  className="font-mono text-xs text-lime-700 dark:text-lime-400 px-3 py-3 border-b border-r border-zinc-200 dark:border-zinc-800 align-top"
                >
                  {String(rowIndex + 1).padStart(2, "0")}
                </th>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-3 py-3 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 align-top"
                  >
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 italic">
                      your story
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
}
