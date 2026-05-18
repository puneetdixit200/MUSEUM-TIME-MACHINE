import type { EraConfig } from "@/data/eraConfig";

type EraIndicatorProps = {
  year: number;
  era: EraConfig;
  isTransitioning: boolean;
};

export function EraIndicator({
  year,
  era,
  isTransitioning,
}: EraIndicatorProps) {
  return (
    <div className="era-indicator" aria-live="polite">
      <span className="era-label">{era.label}</span>
      <span className={`era-year ${isTransitioning ? "is-spinning" : ""}`}>
        {year}
      </span>
    </div>
  );
}
