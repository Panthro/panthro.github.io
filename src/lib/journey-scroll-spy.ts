export type JourneyActiveStepEvent = CustomEvent<{ index: number }>;

export const JOURNEY_ACTIVE_STEP_EVENT = "journey:active-step";

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

/** Top-anchor scroll spy — runs outside React so dev hydration cannot break it */
export function startJourneyScrollSpy(): () => void {
  let frame = 0;
  let lastIndex = -1;
  let mounted = true;

  const tick = () => {
    if (!mounted) return;

    const root = document.querySelector("[data-journey]");
    if (root) {
      const index = pickActiveStepIndex(root);
      if (index !== lastIndex) {
        lastIndex = index;
        dispatchActiveStep(root, index);
      }
    }

    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  return () => {
    mounted = false;
    cancelAnimationFrame(frame);
  };
}
