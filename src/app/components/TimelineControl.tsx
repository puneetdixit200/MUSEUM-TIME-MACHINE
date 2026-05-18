"use client";

import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import type { CSSProperties } from "react";
import {
  CENTURY_STEP,
  MAX_YEAR,
  MIN_YEAR,
  getCenturyRange,
} from "@/data/eraConfig";
import { timelinePercent } from "@/lib/timeMachine";

type TimelineControlProps = {
  year: number;
  isAutoWalking: boolean;
  onYearChange: (year: number) => void;
  onStepCentury: (direction: -1 | 1) => void;
  onToggleAutoWalk: () => void;
};

const CENTURY_MARKS = Array.from(
  { length: (MAX_YEAR - MIN_YEAR) / CENTURY_STEP + 1 },
  (_, index) => MIN_YEAR + index * CENTURY_STEP,
);

export function TimelineControl({
  year,
  isAutoWalking,
  onYearChange,
  onStepCentury,
  onToggleAutoWalk,
}: TimelineControlProps) {
  const range = getCenturyRange(year);
  const percent = timelinePercent(year);

  return (
    <div className="timeline-wrap">
      <button
        className="control-button timeline-prev"
        type="button"
        onClick={() => onStepCentury(-1)}
        disabled={year <= MIN_YEAR}
        aria-label="Previous Century"
      >
        <ChevronLeft size={18} />
        <span>Previous Century</span>
      </button>
      <div className="timeline-control">
        <div className="timeline-meta">
          <span>{range.label}</span>
          <span>{MIN_YEAR} - {MAX_YEAR}</span>
        </div>
        <div className="timeline-track">
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            aria-label="Choose year"
          />
          <span
            className="timeline-marker"
            style={
              {
                left: `${percent}%`,
                "--year-percent": percent,
              } as CSSProperties
            }
          />
          <div className="timeline-ticks" aria-hidden="true">
            {CENTURY_MARKS.map((mark) => (
              <span key={mark} style={{ left: `${timelinePercent(mark)}%` }}>
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="timeline-actions">
        <button
          className="control-button timeline-next"
          type="button"
          onClick={() => onStepCentury(1)}
          disabled={year >= MAX_YEAR}
          aria-label="Next Century"
        >
          <span>Next Century</span>
          <ChevronRight size={18} />
        </button>
        <button
          className={`icon-button auto-button ${isAutoWalking ? "is-active" : ""}`}
          type="button"
          onClick={onToggleAutoWalk}
          aria-label={
            isAutoWalking ? "Stop random walk through time" : "Start random walk"
          }
          title={isAutoWalking ? "Stop random walk" : "Random walk through time"}
        >
          <Shuffle size={18} />
        </button>
      </div>
    </div>
  );
}
