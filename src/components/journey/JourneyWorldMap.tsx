import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoPath } from "d3-geo";
import type { FeatureCollection, LineString } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countries110 from "world-atlas/countries-110m.json";
import {
  canvasMapLeftFadePx,
  createCanvasProjection,
  pinLabel,
  resolveCanvasView,
  resolvePinLabelLayout,
  routeProgressPointCount,
  type ChapterId,
  type JourneyMapStep,
} from "@lib/journey-map";

type Props = {
  steps: JourneyMapStep[];
};

const landFeatures = feature(
  countries110 as unknown as Topology,
  (countries110 as unknown as Topology).objects.countries
) as FeatureCollection;

function useContainerSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 800, height: 520 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      setSize({
        width: Math.max(280, node.clientWidth),
        height: Math.max(320, node.clientHeight),
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

export default function JourneyWorldMap({ steps }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = steps[activeIndex];
  const view = useMemo(
    () => resolveCanvasView(activeStep),
    [activeStep]
  );

  const routePoints = useMemo(
    () => steps.map((step) => [step.lng, step.lat] as [number, number]),
    [steps]
  );

  const projection = useMemo(() => {
    return createCanvasProjection(width, height, routePoints, activeStep);
  }, [width, height, routePoints, activeStep]);

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

  const scrollToStep = useCallback(
    (index: number) => {
      const root = document.querySelector("[data-journey]");
      const target = root?.querySelector(
        `[data-journey-step-index="${index}"]`
      );
      if (!target) return;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    },
    [reducedMotion]
  );

  useEffect(() => {
    const root = document.querySelector("[data-journey]");
    if (!root) return;

    const stepNodes = root.querySelectorAll("[data-journey-step]");
    const chapterNodes = root.querySelectorAll("[data-journey-chapter]");
    const navLinks = root.querySelectorAll("[data-journey-chapter-link]");

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

          stepNodes.forEach((step) => {
            const stepIndex = Number(
              step.getAttribute("data-journey-step-index")
            );
            step.classList.toggle("is-active", step === entry.target);
            step.classList.toggle(
              "is-past",
              !Number.isNaN(stepIndex) && stepIndex < index
            );
          });
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
  }, []);

  const leftFadePx = canvasMapLeftFadePx(width);

  return (
    <div
      ref={containerRef}
      className="journey-world-map-wrap journey-world-map-wrap--fade-left"
      style={{
        ["--journey-fade-top" as string]: `${view.topFadePct}%`,
        ["--journey-fade-bottom" as string]: `${view.bottomFadePct}%`,
        ["--journey-fade-left" as string]: `${leftFadePx}px`,
      }}
      data-journey-world-map
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

        {routePath ? (
          <path className="journey-world-route-base" d={routePath} />
        ) : null}

        {progressPath ? (
          <path className="journey-world-route-progress" d={progressPath} />
        ) : null}

        {projectedPins.map(({ step, x, y, visible }) => {
          if (!visible) return null;

          const isActive = step.index === activeIndex;
          const isPast = step.index < activeIndex;
          const label = pinLabel(step);
          const labelLayout = resolvePinLabelLayout(
            { x, y, index: step.index, step },
            projectedPins.filter((pin) => pin.visible),
            isActive
          );

          return (
            <g
              key={step.index}
              className={[
                "journey-world-pin",
                isActive ? "is-active" : "",
                isPast ? "is-past" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              transform={`translate(${x} ${y})`}
              data-journey-map-marker={step.index}
              role="button"
              tabIndex={0}
              aria-label={`${step.kind}: ${step.title}`}
              onClick={() => scrollToStep(step.index)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                scrollToStep(step.index);
              }}
            >
              {isActive ? (
                <circle className="journey-world-pin-halo" r={10} cx={0} cy={0} />
              ) : null}
              <circle
                className="journey-world-pin-dot"
                r={isActive ? 5 : 4}
                cx={0}
                cy={0}
              />
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
        })}
      </svg>
    </div>
  );
}
