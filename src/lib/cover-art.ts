/**
 * Deterministic, text-free cover artwork for articles.
 *
 * A dot grid with a small network laid over it: square nodes joined by
 * orthogonal routes (a spanning tree), one route traced in Signal Green and
 * ending in a filled node. Seeded from the article slug, so every article gets
 * a stable, distinct image with no assets to maintain.
 *
 * Two renderers share one layout:
 * - `inline`: Tailwind classes, so the header art follows light/dark theme.
 * - `og`: fixed dark-surface hex colors for the build-time share image.
 */

type Point = { x: number; y: number };

type Layout = {
  width: number;
  height: number;
  step: number;
  nodes: Point[];
  routes: Point[][];
  accent: Point[];
  accentEnd: Point;
};

export type CoverOptions = {
  width: number;
  height: number;
  /** Grid pitch in viewBox units. */
  step?: number;
  /** Grid cells kept clear of nodes on the left (e.g. behind OG title text). */
  clearLeft?: number;
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layout(seed: string, opts: CoverOptions): Layout {
  const { width, height, step = 30, clearLeft = 0 } = opts;
  const rand = prng(hash(seed));
  const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

  const cols = Math.floor(width / step);
  const rows = Math.floor(height / step);
  const count = int(7, 10);

  // Nodes on grid intersections, at least two cells apart from each other.
  const nodes: Point[] = [];
  for (let tries = 0; nodes.length < count && tries < 500; tries++) {
    const p = { x: int(2 + clearLeft, cols - 2) * step, y: int(2, rows - 2) * step };
    if (nodes.every((n) => Math.abs(n.x - p.x) + Math.abs(n.y - p.y) >= step * 4)) {
      nodes.push(p);
    }
  }

  // Spanning tree: each node joins its nearest predecessor with an L-route.
  const parent: number[] = [-1];
  const routes: Point[][] = [];
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i]!;
    let best = 0;
    for (let j = 1; j < i; j++) {
      const d = (n: Point) => Math.abs(n.x - a.x) + Math.abs(n.y - a.y);
      if (d(nodes[j]!) < d(nodes[best]!)) best = j;
    }
    parent.push(best);
    const b = nodes[best]!;
    const corner = rand() < 0.5 ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
    routes.push([a, corner, b]);
  }

  // Accent: the tree path from node 0 to the node with the deepest ancestry.
  const depth = (i: number): number => (parent[i]! < 0 ? 0 : 1 + depth(parent[i]!));
  let end = 0;
  for (let i = 1; i < nodes.length; i++) if (depth(i) > depth(end)) end = i;
  const accent: Point[] = [];
  for (let i = end; i > 0; i = parent[i]!) accent.push(...routes[i - 1]!.slice(0, 2));
  accent.push(nodes[0]!);

  return { width, height, step, nodes, routes, accent, accentEnd: nodes[end]! };
}

type Paint = {
  dot: string;
  route: string;
  node: string;
  accentStroke: string;
  accentFill: string;
};

const INLINE: Paint = {
  dot: 'class="fill-zinc-300 dark:fill-zinc-800"',
  route: 'class="stroke-zinc-300 dark:stroke-zinc-700"',
  node: 'class="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-950 dark:stroke-zinc-600"',
  accentStroke: 'class="stroke-lime-600 dark:stroke-lime-400"',
  accentFill: 'class="fill-lime-600 dark:fill-lime-400"',
};

const OG: Paint = {
  dot: 'fill="#27272a"',
  route: 'stroke="#3f3f46"',
  node: 'fill="#09090b" stroke="#52525b"',
  accentStroke: 'stroke="#a3e635"',
  accentFill: 'fill="#a3e635"',
};

const pts = (p: Point[]) => p.map(({ x, y }) => `${x},${y}`).join(" ");

export function coverSvg(
  seed: string,
  opts: CoverOptions,
  variant: "inline" | "og" = "inline"
): string {
  const l = layout(seed, opts);
  const paint = variant === "inline" ? INLINE : OG;
  const strokeW = variant === "inline" ? 1 : 2;
  const line = (w: number) =>
    `fill="none" stroke-width="${w}" vector-effect="non-scaling-stroke" stroke-linejoin="miter"`;
  const s = l.step;
  const half = 5;

  const dots: string[] = [];
  for (let x = s; x < l.width; x += s) {
    for (let y = s; y < l.height; y += s) dots.push(`M${x - 1} ${y - 1}h2v2h-2z`);
  }

  const routes = l.routes
    .map((r) => `<polyline points="${pts(r)}" ${paint.route} ${line(strokeW)}/>`)
    .join("");
  const nodes = l.nodes
    .map(
      (n) =>
        `<rect x="${n.x - half}" y="${n.y - half}" width="${half * 2}" height="${half * 2}" ${paint.node} stroke-width="${strokeW}" vector-effect="non-scaling-stroke"/>`
    )
    .join("");
  const e = l.accentEnd;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" preserveAspectRatio="xMidYMid slice">`,
    `<path d="${dots.join("")}" ${paint.dot}/>`,
    routes,
    nodes,
    `<polyline points="${pts(l.accent)}" ${paint.accentStroke} ${line(strokeW * 2)}/>`,
    `<rect x="${e.x - half - 2}" y="${e.y - half - 2}" width="${(half + 2) * 2}" height="${(half + 2) * 2}" ${paint.accentFill}/>`,
    `</svg>`,
  ].join("");
}
