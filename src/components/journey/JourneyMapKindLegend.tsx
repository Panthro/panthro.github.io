import {
  JOURNEY_PIN_KIND_LABELS,
  type JourneyPinKind,
} from "@lib/journey-pin-icons";

const LEGEND_KINDS: JourneyPinKind[] = ["study", "career", "project", "talk"];

export default function JourneyMapKindLegend() {
  return (
    <ul className="journey-map-legend" aria-label="Map marker types">
      {LEGEND_KINDS.map((kind) => (
        <li key={kind} className="journey-map-legend-item">
          <span
            className={`journey-map-legend-dot journey-map-legend-dot--${kind}`}
            aria-hidden="true"
          />
          <span className="journey-map-legend-label">
            {JOURNEY_PIN_KIND_LABELS[kind]}
          </span>
        </li>
      ))}
    </ul>
  );
}
