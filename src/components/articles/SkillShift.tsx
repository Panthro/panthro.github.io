import { useState } from "react";

type Skill = {
  name: string;
  /** Weight in the job before, 0–5. */
  before: number;
  /** Weight in the job now, 0–5. */
  now: number;
  note: string;
};

type Level = {
  id: string;
  label: string;
  /** One line on how the level changes overall. */
  summary?: string;
  skills: Skill[];
};

type Props = {
  title?: string;
  levels: Level[];
  /** Labels for the two bars. */
  beforeLabel?: string;
  nowLabel?: string;
  caption?: string;
};

const MAX = 5;

/**
 * How much each skill weighs in an engineer's job, before and now, per level.
 * Tabs switch level; each skill shows two bars and an arrow for the direction
 * of change. Skills are sorted by how much they grew.
 */
export function SkillShift({ title, levels, beforeLabel = "Before", nowLabel = "Now", caption }: Props) {
  const [active, setActive] = useState(0);
  const level = levels[active];
  const skills = [...level.skills].sort((a, b) => b.now - b.before - (a.now - a.before));

  const select = (index: number) => {
    window.posthog?.capture("skill_shift_level_selected", { level_id: levels[index].id });
    setActive(index);
  };

  return (
    <figure suppressHydrationWarning className="article-reveal not-prose my-12" aria-label={title ?? "Skill shift"}>
      {title && <div className="font-mono text-xs text-meta tracking-wider mb-4">{title}</div>}

      <div role="tablist" aria-label="Level" className="flex flex-wrap border border-b-0 border-zinc-200 dark:border-zinc-800">
        {levels.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`skills-${item.id}`}
              onClick={() => select(index)}
              className={`touch-target focus-ring flex-1 min-w-[4rem] px-3 py-2.5 font-mono text-xs text-left border-b-2 transition-colors ${
                selected
                  ? "border-lime-600 dark:border-lime-400 text-heading bg-zinc-50 dark:bg-zinc-900/40"
                  : "border-transparent text-meta hover:text-heading"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`skills-${level.id}`}
        role="tabpanel"
        className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 sm:px-5 pt-4 pb-5"
      >
        {level.summary && <p className="text-sm leading-snug text-heading mb-4">{level.summary}</p>}

        <div className="flex gap-4 mb-3 font-mono text-[10px] uppercase tracking-wider text-meta" aria-hidden="true">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 bg-zinc-400 dark:bg-zinc-600" />
            {beforeLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 bg-lime-600 dark:bg-lime-400" />
            {nowLabel}
          </span>
        </div>

        <ul className="space-y-3">
          {skills.map((skill) => {
            const delta = skill.now - skill.before;
            const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
            const tone =
              delta > 0
                ? "text-lime-700 dark:text-lime-400"
                : delta < 0
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-meta";
            return (
              <li
                key={`${level.id}-${skill.name}`}
                className="grid gap-x-3 gap-y-1 sm:grid-cols-[11rem_1fr] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-2"
              >
                <div className="flex items-baseline gap-2">
                  <span aria-hidden="true" className={`font-mono text-sm font-bold ${tone}`}>
                    {arrow}
                  </span>
                  <span className="text-sm leading-tight text-heading">{skill.name}</span>
                  <span className="sr-only">
                    : {beforeLabel.toLowerCase()} {skill.before} of {MAX}, {nowLabel.toLowerCase()} {skill.now} of {MAX}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="space-y-1" aria-hidden="true">
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-900">
                      <div
                        className="h-full bg-zinc-400 dark:bg-zinc-600 transition-[width] duration-300"
                        style={{ width: `${(skill.before / MAX) * 100}%` }}
                      />
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-900">
                      <div
                        className="h-full bg-lime-600 dark:bg-lime-400 transition-[width] duration-300"
                        style={{ width: `${(skill.now / MAX) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-1.5 text-xs leading-snug text-prose">{skill.note}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{caption}</figcaption>
      )}
    </figure>
  );
}
