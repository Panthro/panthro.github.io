import type { CSSProperties } from "react";

type Cell = "given" | "shared" | "owned";

type Row = {
  level: string;
  cells: Cell[];
};

type Props = {
  title?: string;
  stages: string[];
  rows: Row[];
  caption?: string;
};

const LABEL: Record<Cell, string> = {
  given: "given",
  shared: "shared",
  owned: "owned",
};

export function OwnershipLadder({ title, stages, rows, caption }: Props) {
  const lastStage = stages.length - 1;

  return (
    <div className="article-reveal not-prose my-10">
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">
          {title}
        </div>
      )}
      <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[36rem] border border-zinc-200 dark:border-zinc-800 text-sm table-fixed">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/40">
              <th
                scope="col"
                className="w-24 font-mono text-xs font-semibold text-zinc-500 px-3 py-2 border-b border-r border-zinc-200 dark:border-zinc-800 text-left"
              >
                Level
              </th>
              {stages.map((stage, index) => (
                <th
                  key={stage}
                  scope="col"
                  className="font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-2 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 text-left leading-snug"
                >
                  <span className="text-zinc-400 dark:text-zinc-600 tabular-nums mr-1">{index + 1}</span>
                  {stage}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.level}>
                <th
                  scope="row"
                  className="font-mono text-xs text-heading px-3 py-3 border-b border-r border-zinc-200 dark:border-zinc-800 text-left align-middle"
                >
                  {row.level}
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={stages[cellIndex]}
                    className={`relative px-3 py-3 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 align-middle ${
                      cell === "given" ? "ownership-hatch" : ""
                    }`}
                  >
                    {cell !== "given" && (
                      <span
                        aria-hidden="true"
                        className={`ownership-fill absolute inset-0 ${
                          cell === "owned"
                            ? "bg-lime-500/15 dark:bg-lime-400/10"
                            : "bg-lime-500/[0.07] dark:bg-lime-400/[0.05]"
                        }`}
                        // Ownership creeps leftward up the pipeline: right-most cells fill first.
                        style={{ "--i": rowIndex * 2 + (lastStage - cellIndex) } as CSSProperties}
                      />
                    )}
                    <span
                      className={`relative font-mono text-[11px] uppercase tracking-wider ${
                        cell === "owned"
                          ? "text-lime-700 dark:text-lime-400"
                          : cell === "shared"
                            ? "text-zinc-700 dark:text-zinc-300"
                            : "text-zinc-500"
                      }`}
                    >
                      {LABEL[cell]}
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
