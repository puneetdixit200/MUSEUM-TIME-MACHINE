"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";

type HistoricalPanelProps = {
  year: number;
  events: string[];
  isOpen: boolean;
  onToggle: () => void;
};

export function HistoricalPanel({
  year,
  events,
  isOpen,
  onToggle,
}: HistoricalPanelProps) {
  return (
    <aside className={`history-panel ${isOpen ? "is-open" : ""}`}>
      <button
        className="icon-button history-toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide historical events" : "Show historical events"}
        title={isOpen ? "Hide historical events" : "Show historical events"}
      >
        {isOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
      </button>
      <div className="history-content">
        <p className="history-kicker">What was happening</p>
        <h2>{year}</h2>
        <ul>
          {events.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
