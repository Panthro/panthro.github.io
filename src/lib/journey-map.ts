import { geoNaturalEarth1 } from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type { MultiPoint } from "geojson";

export type ChapterId = "brazil" | "spain" | "switzerland";
export type StepKind = "study" | "career" | "project" | "talk";

export type JourneyMapStep = {
  index: number;
  chapter: ChapterId;
  kind: StepKind;
  title: string;
  lat: number;
  lng: number;
  place?: string;
  labelDx?: number;
  labelBelow?: boolean;
};

export type ChapterView = {
  center: [number, number];
  scale: number;
  topFadePct: number;
  bottomFadePct: number;
  fadeRight: boolean;
};

/** d3-geo projection presets — center is [longitude, latitude] */
export const CHAPTER_VIEW: Record<ChapterId, ChapterView> = {
  brazil: {
    center: [-48, -18],
    scale: 520,
    topFadePct: 28,
    bottomFadePct: 28,
    fadeRight: true,
  },
  spain: {
    center: [8, 50],
    scale: 920,
    topFadePct: 22,
    bottomFadePct: 30,
    fadeRight: false,
  },
  switzerland: {
    center: [8, 47],
    scale: 2200,
    topFadePct: 25,
    bottomFadePct: 25,
    fadeRight: false,
  },
};

/** Atlantic-wide view for full-bleed canvas — Brazil through Europe */
export const CANVAS_VIEW: ChapterView = {
  center: [-22, 20],
  scale: 420,
  topFadePct: 4,
  bottomFadePct: 12,
  fadeRight: false,
};

export function buildMapSteps(
  steps: Array<{
    chapter: ChapterId;
    kind: StepKind;
    title: string;
    lat: number;
    lng: number;
    place?: string;
    labelDx?: number;
    labelBelow?: boolean;
  }>
): JourneyMapStep[] {
  return steps.map((step, index) => ({
    index,
    chapter: step.chapter,
    kind: step.kind,
    title: step.title,
    lat: step.lat,
    lng: step.lng,
    place: step.place,
    labelDx: step.labelDx,
    labelBelow: step.labelBelow,
  }));
}

export function pinLabel(step: JourneyMapStep): string {
  return step.place ?? step.title;
}

type PinProjection = {
  x: number;
  y: number;
  index: number;
  step: Pick<JourneyMapStep, "labelDx" | "labelBelow">;
};

/** Spread labels in dense pin clusters — only matters for the active pin label */
export function resolvePinLabelLayout(
  pin: PinProjection,
  allPins: Array<Pick<PinProjection, "x" | "y">>,
  isActive: boolean
): { dx: number; dy: number; anchor: "start" | "end" | "middle" } {
  const fallbackAnchor =
    pin.step.labelDx !== undefined && pin.step.labelDx < 0 ? "end" : "start";
  const fallbackDx = pin.step.labelDx ?? 8;
  const fallbackDy = pin.step.labelBelow ? 14 : -10;

  if (!isActive) {
    return { dx: fallbackDx, dy: fallbackDy, anchor: fallbackAnchor };
  }

  const clusterRadius = 32;
  const cluster = allPins.filter(
    (other) =>
      !(other.x === pin.x && other.y === pin.y) &&
      Math.hypot(other.x - pin.x, other.y - pin.y) < clusterRadius
  );

  if (cluster.length === 0) {
    return { dx: fallbackDx, dy: fallbackDy, anchor: fallbackAnchor };
  }

  const centroidX =
    cluster.reduce((sum, other) => sum + other.x, pin.x) / (cluster.length + 1);
  const centroidY =
    cluster.reduce((sum, other) => sum + other.y, pin.y) / (cluster.length + 1);

  let dirX = pin.x - centroidX;
  let dirY = pin.y - centroidY;
  let length = Math.hypot(dirX, dirY);

  if (length < 0.01) {
    const angles = [-Math.PI / 4, Math.PI / 4, (-3 * Math.PI) / 4, (3 * Math.PI) / 4];
    const angle = angles[pin.index % angles.length] ?? -Math.PI / 4;
    dirX = Math.cos(angle);
    dirY = Math.sin(angle);
    length = 1;
  }

  dirX /= length;
  dirY /= length;

  const offset = 18;
  const dx = dirX * offset;
  const dy = dirY * offset;

  return {
    dx,
    dy,
    anchor: dx < -4 ? "end" : dx > 4 ? "start" : "middle",
  };
}

export function routeProgressPointCount(
  steps: JourneyMapStep[],
  activeIndex: number
): number {
  if (steps.length === 0) return 0;
  return Math.min(steps.length, Math.max(1, activeIndex + 1));
}

/** Canvas layout: global view with a subtle nudge toward the active pin */
export function resolveCanvasView(
  activeStep?: Pick<JourneyMapStep, "lat" | "lng">
): ChapterView {
  if (!activeStep) return CANVAS_VIEW;

  return {
    ...CANVAS_VIEW,
    center: [
      CANVAS_VIEW.center[0] * 0.85 + activeStep.lng * 0.15,
      CANVAS_VIEW.center[1] * 0.85 + activeStep.lat * 0.15,
    ],
  };
}

/** Left scrim width — capped so ultrawide viewports do not mask half the map */
export function canvasMapLeftFadePx(width: number): number {
  return Math.min(Math.max(width * 0.38, 240), 520);
}

/** Fit the full route inside the visible map area (right of the content column) */
export function createCanvasProjection(
  width: number,
  height: number,
  routePoints: [number, number][],
  activeStep?: Pick<JourneyMapStep, "lat" | "lng">
): GeoProjection {
  const leftPad = canvasMapLeftFadePx(width);
  const headerPad = 72;
  const topPad = Math.max(headerPad, height * 0.05);
  const bottomPad = Math.max(40, height * 0.1);
  const rightPad = Math.max(28, width * 0.04);

  const projection = geoNaturalEarth1();

  if (routePoints.length >= 2) {
    const points: MultiPoint = {
      type: "MultiPoint",
      coordinates: routePoints,
    };

    projection.fitExtent(
      [
        [leftPad, topPad],
        [width - rightPad, height - bottomPad],
      ],
      points
    );
  } else {
    projection
      .center(CANVAS_VIEW.center)
      .scale(CANVAS_VIEW.scale)
      .translate([width / 2, height / 2]);
  }

  if (activeStep) {
    const projected = projection([activeStep.lng, activeStep.lat]);
    if (projected) {
      const [tx, ty] = projection.translate();
      projection.translate([
        tx + (width * 0.58 - projected[0]) * 0.08,
        ty + (height * 0.52 - projected[1]) * 0.08,
      ]);
    }
  }

  return projection;
}

export function lerpChapterView(
  from: ChapterView,
  to: ChapterView,
  t: number
): ChapterView {
  const blend = Math.min(1, Math.max(0, t));
  return {
    center: [
      from.center[0] + (to.center[0] - from.center[0]) * blend,
      from.center[1] + (to.center[1] - from.center[1]) * blend,
    ],
    scale: from.scale + (to.scale - from.scale) * blend,
    topFadePct: to.topFadePct,
    bottomFadePct: to.bottomFadePct,
    fadeRight: to.fadeRight,
  };
}

const FLOW_PANEL_REFERENCE = 560;

/** Normalize chapter preset scale for a half-viewport map panel */
export function flowScaleForPanel(presetScale: number, panelSize: number): number {
  return presetScale * (panelSize / FLOW_PANEL_REFERENCE);
}

/**
 * Smallest geographic span a chapter frame may show, in degrees.
 *
 * Brazil's four landmarks sit inside ~0.7° of each other and Switzerland is a
 * single point; fitting either literally would zoom past any recognizable
 * coastline or border. The floor is what makes the frame read as a *place* —
 * roughly "southeast Brazil", "western Europe", "the Alps".
 */
const CHAPTER_MIN_SPAN_DEG: Record<ChapterId, number> = {
  brazil: 17,
  spain: 15,
  switzerland: 9,
};

/** Fraction of the panel reserved as breathing room around a chapter frame. */
const CHAPTER_FRAME_PAD = 0.16;

/**
 * Chapter-scoped framing: one regional view per chapter, not one global frame.
 *
 * A single projection containing both São Paulo and Basel spends most of its
 * area on the Atlantic. Framing per chapter puts the pins at a legible scale and
 * turns the camera move into part of the narrative — the frame travels when the
 * reader changes continent, and holds still while they read a chapter.
 */
export function resolveChapterFrame(
  chapter: ChapterId,
  points: [number, number][],
  width: number,
  height: number
): ChapterView {
  const preset = CHAPTER_VIEW[chapter];
  if (points.length === 0) return preset;

  const lngs = points.map((point) => point[0]);
  const lats = points.map((point) => point[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const minSpan = CHAPTER_MIN_SPAN_DEG[chapter];
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const halfLng = Math.max((maxLng - minLng) / 2, minSpan / 2);
  const halfLat = Math.max((maxLat - minLat) / 2, minSpan / 2);

  const corners: [number, number][] = [
    [centerLng - halfLng, centerLat - halfLat],
    [centerLng + halfLng, centerLat - halfLat],
    [centerLng + halfLng, centerLat + halfLat],
    [centerLng - halfLng, centerLat + halfLat],
  ];

  const projection = geoNaturalEarth1();
  projection.fitExtent(
    [
      [width * CHAPTER_FRAME_PAD, height * CHAPTER_FRAME_PAD],
      [width * (1 - CHAPTER_FRAME_PAD), height * (1 - CHAPTER_FRAME_PAD)],
    ],
    { type: "MultiPoint", coordinates: corners }
  );

  const fittedScale = projection.scale();
  if (!Number.isFinite(fittedScale) || fittedScale <= 0) return preset;

  const panelSize = Math.min(width, height);
  const inverted = projection.invert?.([width / 2, height / 2]);
  const center: [number, number] =
    inverted && Number.isFinite(inverted[0]) && Number.isFinite(inverted[1])
      ? [inverted[0], inverted[1]]
      : [centerLng, centerLat];

  return {
    center,
    scale: fittedScale * (FLOW_PANEL_REFERENCE / panelSize),
    topFadePct: 8,
    bottomFadePct: 12,
    fadeRight: false,
  };
}

/** Build projection from a ChapterView for the sticky map panel (no left gutter) */
export function createFlowProjection(
  width: number,
  height: number,
  view: ChapterView
): GeoProjection {
  const panelSize = Math.min(width, height);

  return geoNaturalEarth1()
    .center(view.center)
    .scale(flowScaleForPanel(view.scale, panelSize))
    .translate([width / 2, height / 2]);
}

/** Astro glob loader keeps geo fields on rendered frontmatter, not always on entry.data */
export function journeyGeoFields(entry: {
  data: {
    chapter: ChapterId;
    kind: StepKind;
    title: string;
    place?: string;
    labelDx?: number;
    labelBelow?: boolean;
    lat?: number;
    lng?: number;
  };
  rendered?: {
    metadata?: Record<string, unknown>;
  };
}): Pick<
  JourneyMapStep,
  "chapter" | "kind" | "title" | "lat" | "lng" | "place" | "labelDx" | "labelBelow"
> {
  const metadata = entry.rendered?.metadata;
  const frontmatter =
    metadata && typeof metadata === "object" && "frontmatter" in metadata
      ? (metadata.frontmatter as Record<string, unknown> | undefined)
      : undefined;
  const lat = Number(entry.data.lat ?? frontmatter?.lat);
  const lng = Number(entry.data.lng ?? frontmatter?.lng);

  return {
    chapter: entry.data.chapter,
    kind: entry.data.kind,
    title: entry.data.title,
    lat,
    lng,
    place: (entry.data.place ?? frontmatter?.place) as string | undefined,
    labelDx: (entry.data.labelDx ?? frontmatter?.labelDx) as number | undefined,
    labelBelow: (entry.data.labelBelow ?? frontmatter?.labelBelow) as
      | boolean
      | undefined,
  };
}
