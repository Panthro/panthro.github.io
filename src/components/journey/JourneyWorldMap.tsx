import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoPath } from "d3-geo";
import type { FeatureCollection, LineString } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countries110 from "world-atlas/countries-110m.json";
import {
  CANVAS_VIEW,
  canvasMapLeftFadePx,
  createCanvasProjection,
  createFlowProjection,
  lerpChapterView,
  pinLabel,
  resolveCanvasView,
  resolveChapterFrame,
  resolvePinLabelLayout,
  routeProgressPointCount,
  type ChapterId,
  type ChapterView,
  type JourneyMapStep,
} from "@lib/journey-map";
import {
  JOURNEY_ACTIVE_INDEX_ATTR,
  JOURNEY_ACTIVE_STEP_EVENT,
  type JourneyActiveStepEvent,
} from "@lib/journey-scroll-spy";

type Props = {
  steps: JourneyMapStep[];
  variant?: "canvas" | "flow";
};

const landFeatures = feature(
  countries110 as unknown as Topology,
  (countries110 as unknown as Topology).objects.countries
) as FeatureCollection;

/** Long enough to read as travel between continents, short enough not to stall. */
const CHAPTER_TRANSITION_MS = 900;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function useContainerSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 800, height: 520 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      setSize((current) => {
        const width = Math.max(280, node.clientWidth);
        const height = Math.max(320, node.clientHeight);
        if (current.width === width && current.height === height) return current;
        return { width, height };
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function JourneyWorldMap({ steps, variant = "flow" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayView, setDisplayView] = useState<ChapterView>(CANVAS_VIEW);
  const displayViewRef = useRef(displayView);
  const lastChapterRef = useRef<ChapterId | null>(null);
  const syncStepStateRef = useRef<(index: number) => void>(() => {});

  const activeStep = steps[activeIndex];
  const isFlow = variant === "flow";
  const activeChapter: ChapterId =
    activeStep?.chapter ?? steps[0]?.chapter ?? "brazil";

  const routePoints = useMemo(
    () => steps.map((step) => [step.lng, step.lat] as [number, number]),
    [steps]
  );

  const chapterPoints = useMemo(
    () =>
      steps
        .filter((step) => step.chapter === activeChapter)
        .map((step) => [step.lng, step.lat] as [number, number]),
    [steps, activeChapter]
  );

  const canvasTargetView = useMemo(
    () => resolveCanvasView(activeStep),
    [activeStep]
  );

  // Frame is a function of the *chapter*, not the step: the camera holds still
  // while a chapter is read and travels only when the reader changes region.
  const flowTargetView = useMemo(
    () => resolveChapterFrame(activeChapter, chapterPoints, width, height),
    [activeChapter, chapterPoints, width, height]
  );

  const targetView = isFlow ? flowTargetView : canvasTargetView;

  useEffect(() => {
    displayViewRef.current = displayView;
  }, [displayView]);

  useEffect(() => {
    const previousChapter = lastChapterRef.current;
    lastChapterRef.current = activeChapter;

    const snap = () => {
      setDisplayView(targetView);
      displayViewRef.current = targetView;
    };

    // First paint (correct framing on arrival, including deep links) and resizes
    // both snap; only a genuine chapter change animates.
    const chapterChanged =
      previousChapter !== null && previousChapter !== activeChapter;

    if (reducedMotion || !chapterChanged) {
      snap();
      return;
    }

    const from = displayViewRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = easeInOutCubic(
        Math.min(1, (now - start) / CHAPTER_TRANSITION_MS)
      );
      const next = lerpChapterView(from, targetView, progress);
      setDisplayView(next);
      displayViewRef.current = next;

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [targetView, activeChapter, reducedMotion]);

  const projection = useMemo(() => {
    if (isFlow) {
      return createFlowProjection(width, height, displayView);
    }

    return createCanvasProjection(width, height, routePoints, activeStep);
  }, [isFlow, width, height, displayView, routePoints, activeStep]);

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  const landPath = useMemo(() => pathGenerator(landFeatures) ?? "", [pathGenerator]);

  const routePath = useMemo(() => {
    if (routePoints.length < 2) return "";
    const line: LineString = {
      type: "LineString",
      coordinates: routePoints,
    };
    return pathGenerator(line) ?? "";
  }, [pathGenerator, routePoints]);

  const progressCount = routeProgressPointCount(steps, activeIndex);
  const progressPoints = routePoints.slice(0, progressCount);
  const progressPath = useMemo(() => {
    if (progressPoints.length < 2) return "";
    const line: LineString = {
      type: "LineString",
      coordinates: progressPoints,
    };
    return pathGenerator(line) ?? "";
  }, [pathGenerator, progressPoints]);

  const projectedPins = useMemo(() => {
    return steps.map((step) => {
      const projected = projection([step.lng, step.lat]);
      const rawX = projected?.[0];
      const rawY = projected?.[1];
      const x: number =
        typeof rawX === "number" && Number.isFinite(rawX) ? rawX : 0;
      const y: number =
        typeof rawY === "number" && Number.isFinite(rawY) ? rawY : 0;
      return {
        step,
        x,
        y,
        visible:
          typeof rawX === "number" &&
          typeof rawY === "number" &&
          Number.isFinite(rawX) &&
          Number.isFinite(rawY),
      };
    });
  }, [projection, steps]);

  const chapterPins = useMemo(
    () =>
      projectedPins.filter(
        (pin) => pin.visible && pin.step.chapter === activeChapter
      ),
    [projectedPins, activeChapter]
  );

  const activePin = chapterPins.find((pin) => pin.step.index === activeIndex);

  const scrollToStep = useCallback(
    (index: number) => {
      const root = document.querySelector("[data-journey]");
      const target = root?.querySelector(
        `[data-journey-step-index="${index}"]`
      );
      if (!target) return;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reducedMotion]
  );

  const syncStepState = useCallback((index: number) => {
    const root = document.querySelector("[data-journey]");
    if (!root) return;

    const stepNodes = root.querySelectorAll("[data-journey-step]");
    const navLinks = root.querySelectorAll("[data-journey-chapter-link]");
    const activeStepNode = steps[index];

    stepNodes.forEach((step) => {
      const stepIndex = Number(step.getAttribute("data-journey-step-index"));
      step.classList.toggle(
        "is-active",
        stepIndex === index
      );
      step.classList.toggle(
        "is-past",
        !Number.isNaN(stepIndex) && stepIndex < index
      );
    });

    if (activeStepNode) {
      navLinks.forEach((link) => {
        const isActive =
          link.getAttribute("data-journey-chapter-link") ===
          activeStepNode.chapter;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  }, [steps]);

  syncStepStateRef.current = syncStepState;

  useEffect(() => {
    syncStepState(activeIndex);
  }, [activeIndex, syncStepState]);

  useEffect(() => {
    if (!isFlow) {
      const root = document.querySelector("[data-journey]");
      if (!root) return;

      const stepNodes = root.querySelectorAll("[data-journey-step]");
      const chapterNodes = root.querySelectorAll("[data-journey-chapter]");

      if (stepNodes.length === 0) return;

      const stepObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = Number(
              entry.target.getAttribute("data-journey-step-index")
            );
            if (Number.isNaN(index)) return;

            setActiveIndex(index);
            syncStepState(index);
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );

      stepNodes.forEach((node) => stepObserver.observe(node));

      const chapterObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
            );

          if (visible.length === 0) return;

          const chapter = visible[0].target.getAttribute(
            "data-journey-chapter"
          ) as ChapterId | null;
          if (!chapter) return;

          const navLinks = root.querySelectorAll("[data-journey-chapter-link]");
          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("data-journey-chapter-link") === chapter;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
      );

      chapterNodes.forEach((node) => chapterObserver.observe(node));

      return () => {
        stepObserver.disconnect();
        chapterObserver.disconnect();
      };
    }

    const root = document.querySelector("[data-journey]");
    if (!root) return;

    const pageRoot = root as HTMLElement;
    let lastSpyIndex = -1;

    const applyIndex = (index: number) => {
      if (index === lastSpyIndex) return;
      lastSpyIndex = index;
      setActiveIndex(index);
      syncStepStateRef.current(index);
    };

    const onActiveStep = (event: Event) => {
      const index = (event as JourneyActiveStepEvent).detail.index;
      if (Number.isNaN(index)) return;
      applyIndex(index);
    };

    root.addEventListener(JOURNEY_ACTIVE_STEP_EVENT, onActiveStep);

    // The spy may have dispatched before this island hydrated; the attribute is
    // the durable mirror of that state. A MutationObserver covers the (rare)
    // case of the attribute changing without an event reaching us — and, unlike
    // the rAF poll it replaces, it costs nothing while the page sits idle.
    const readDatasetIndex = () => {
      const index = Number(pageRoot.dataset.journeyActiveIndex);
      if (Number.isNaN(index)) return;
      applyIndex(index);
    };

    readDatasetIndex();

    const attributeObserver = new MutationObserver(readDatasetIndex);
    attributeObserver.observe(pageRoot, {
      attributes: true,
      attributeFilter: [JOURNEY_ACTIVE_INDEX_ATTR],
    });

    return () => {
      root.removeEventListener(JOURNEY_ACTIVE_STEP_EVENT, onActiveStep);
      attributeObserver.disconnect();
    };
  }, [isFlow, syncStepState]);

  const leftFadePx = canvasMapLeftFadePx(width);
  const fadeTop = isFlow ? displayView.topFadePct : canvasTargetView.topFadePct;
  const fadeBottom = isFlow
    ? displayView.bottomFadePct
    : canvasTargetView.bottomFadePct;

  return (
    <div
      ref={containerRef}
      className={
        isFlow
          ? "journey-world-map-wrap"
          : "journey-world-map-wrap journey-world-map-wrap--fade-left"
      }
      style={{
        ["--journey-fade-top" as string]: `${fadeTop}%`,
        ["--journey-fade-bottom" as string]: `${fadeBottom}%`,
        ...(isFlow
          ? {}
          : { ["--journey-fade-left" as string]: `${leftFadePx}px` }),
      }}
      data-journey-world-map
      data-journey-map-chapter={activeChapter}
    >
      <svg
        className="journey-world-map-svg"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path className="journey-world-land" d={landPath} />

        <g className="journey-world-routes">
          {routePath ? (
            <path className="journey-world-route-base" d={routePath} />
          ) : null}

          {progressPath ? (
            <path className="journey-world-route-progress" d={progressPath} />
          ) : null}
        </g>

        {/* Chapter context: every landmark in the region the reader is in, so a
            pin reads as a place on a map rather than a lone dot. */}
        <g className="journey-world-pins journey-world-pins--context">
          {chapterPins.map(({ step, x, y }) => {
            if (step.index === activeIndex) return null;

            return (
              <circle
                key={step.index}
                className={[
                  "journey-world-pin-ghost",
                  `journey-world-pin--${step.kind}`,
                  step.index < activeIndex ? "is-past" : "is-future",
                ].join(" ")}
                r={3}
                cx={x}
                cy={y}
              />
            );
          })}
        </g>

        <g className="journey-world-pins">
          {activePin ? (
            (() => {
              const { step, x, y } = activePin;
              const label = pinLabel(step);
              const labelLayout = resolvePinLabelLayout(
                { x, y, index: step.index, step },
                chapterPins,
                true
              );

              return (
                <g
                  key={step.index}
                  className={[
                    "journey-world-pin",
                    "is-active",
                    `journey-world-pin--${step.kind}`,
                  ].join(" ")}
                  transform={`translate(${x} ${y})`}
                  data-journey-map-marker={step.index}
                  /* The SVG is aria-hidden and the timeline carries the content,
                     so the pin must not be focusable — a focusable node inside an
                     aria-hidden subtree is reachable by keyboard but invisible to
                     assistive tech. Click stays as a pointer-only shortcut. */
                  onClick={() => scrollToStep(step.index)}
                >
                  <circle className="journey-world-pin-halo" r={13} cx={0} cy={0} />
                  <circle className="journey-world-pin-dot" r={7} cx={0} cy={0} />
                  <text
                    className="journey-world-pin-label"
                    x={labelLayout.dx}
                    y={labelLayout.dy}
                    textAnchor={labelLayout.anchor}
                  >
                    {label}
                  </text>
                </g>
              );
            })()
          ) : null}
        </g>
      </svg>
    </div>
  );
}
