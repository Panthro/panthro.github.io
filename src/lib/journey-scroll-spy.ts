export type JourneyActiveStepEvent = CustomEvent<{ index: number }>;

export const JOURNEY_ACTIVE_STEP_EVENT = "journey:active-step";

/** Mirror of the dispatched event — lets late-mounting islands read the state. */
export const JOURNEY_ACTIVE_INDEX_ATTR = "data-journey-active-index";

export function pickActiveStepIndex(root: Element): number {
  const stepNodes = root.querySelectorAll("[data-journey-step]");
  if (stepNodes.length === 0) return 0;

  const page = root.closest(".journey-page");
  const headerOffsetRaw = page
    ? getComputedStyle(page).getPropertyValue("--journey-header-offset")
    : "";
  const headerOffset = Number.parseFloat(headerOffsetRaw) || 80;
  const anchorY = headerOffset + 24;

  let activeIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  stepNodes.forEach((node) => {
    const index = Number(node.getAttribute("data-journey-step-index"));
    if (Number.isNaN(index)) return;

    const distance = Math.abs(node.getBoundingClientRect().top - anchorY);
    if (distance < bestDistance) {
      bestDistance = distance;
      activeIndex = index;
    }
  });

  return activeIndex;
}

export function dispatchActiveStep(root: Element, index: number): void {
  const page = root as HTMLElement;
  page.dataset.journeyActiveIndex = String(index);
  page.dispatchEvent(
    new CustomEvent(JOURNEY_ACTIVE_STEP_EVENT, { detail: { index } })
  );
}

/**
 * Top-anchor scroll spy — runs outside React so dev hydration cannot break it.
 *
 * Measurement is scroll-driven and coalesced through a single animation frame:
 * an idle tab does zero work. `getBoundingClientRect()` forces layout, so it must
 * never run on a free-running rAF loop.
 */
export function startJourneyScrollSpy(): () => void {
  let frame = 0;
  let lastIndex = -1;
  let mounted = true;

  const measure = () => {
    frame = 0;
    if (!mounted) return;

    const root = document.querySelector("[data-journey]");
    if (!root) return;

    const index = pickActiveStepIndex(root);
    if (index === lastIndex) return;

    lastIndex = index;
    dispatchActiveStep(root, index);
  };

  const schedule = () => {
    if (!mounted || frame !== 0 || document.hidden) return;
    frame = requestAnimationFrame(measure);
  };

  const onVisibilityChange = () => {
    if (!document.hidden) schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("orientationchange", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("load", schedule);
  document.addEventListener("visibilitychange", onVisibilityChange);

  // Late layout shifts (web fonts, sticky map sizing) move the step boxes.
  document.fonts?.ready.then(schedule).catch(() => {});

  // Synchronous first read: the map must be framed correctly on arrival,
  // including deep links and restored scroll positions.
  measure();

  return () => {
    mounted = false;
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("orientationchange", schedule);
    window.removeEventListener("hashchange", schedule);
    window.removeEventListener("load", schedule);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
