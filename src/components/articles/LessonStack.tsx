import type { CSSProperties } from "react";

type Lesson = {
  title: string;
  body: string;
};

type Props = {
  title?: string;
  lessons: Lesson[];
};

export function LessonStack({ title, lessons }: Props) {
  return (
    <div className="article-reveal not-prose my-8" role="list" aria-label={title ?? "Lessons learned"}>
      {title && (
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider mb-4">{title}</div>
      )}
      <div className="article-stagger space-y-3">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.title}
            className="article-stagger-item pl-4 border-l border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300"
            style={{ "--i": index } as CSSProperties}
            role="listitem"
          >
            <div className="font-display font-bold text-sm text-zinc-900 dark:text-white">{lesson.title}</div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{lesson.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
