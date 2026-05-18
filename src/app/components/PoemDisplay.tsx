"use client";

import { BookOpen, Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import type { PoemData } from "@/lib/timeMachine";

type PoemDisplayProps = {
  poem: PoemData | null;
  isTransitioning: boolean;
  isReading: boolean;
  readingLineIndex: number;
  onToggleReading: () => void;
};

export function PoemDisplay({
  poem,
  isTransitioning,
  isReading,
  readingLineIndex,
  onToggleReading,
}: PoemDisplayProps) {
  return (
    <section
      className={`poem-container ${isTransitioning ? "is-leaving" : ""}`}
      aria-live="polite"
    >
      <div className="poem-heading">
        <div>
          <p className="poem-source">{poem?.source ?? "PoetryDB"}</p>
          <h1>{poem?.title ?? "Finding a voice from this era"}</h1>
          <p>{poem?.author ?? "Museum Time Machine"}</p>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={onToggleReading}
          disabled={!poem}
          aria-label={isReading ? "Pause poem reading" : "Read poem aloud"}
          title={isReading ? "Pause poem reading" : "Read poem aloud"}
        >
          {!poem ? (
            <BookOpen size={18} />
          ) : isReading ? (
            <Pause size={18} />
          ) : (
            <Play size={18} />
          )}
        </button>
      </div>
      <div className="poem-lines">
        {poem?.lines.map((line, index) => (
          <p
            className={readingLineIndex === index ? "is-reading" : ""}
            key={`${line}-${index}`}
            style={{ "--line-delay": `${index * 100}ms` } as CSSProperties}
          >
            {line}
          </p>
        )) ?? (
          <div className="hourglass" aria-label="Loading poem">
            <span />
          </div>
        )}
      </div>
    </section>
  );
}
