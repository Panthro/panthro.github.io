import type { StepKind } from "@lib/journey-map";

export type JourneyPinKind = StepKind;

export const JOURNEY_PIN_KIND_LABELS: Record<JourneyPinKind, string> = {
  study: "study",
  career: "work",
  project: "launch",
  talk: "talk",
};
