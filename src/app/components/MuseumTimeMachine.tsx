"use client";

import { GitBranch, Search } from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MAX_YEAR,
  MIN_YEAR,
  getAgeIntensity,
  getCenturyRange,
  getEraForYear,
  getHistoricalEventsForYear,
} from "@/data/eraConfig";
import type { ArtworkData, AudioStation, PoemData } from "@/lib/timeMachine";
import { clampYear } from "@/lib/timeMachine";
import { AmbientAudio } from "./AmbientAudio";
import { ArtworkBackground } from "./ArtworkBackground";
import { ArtworkCredit } from "./ArtworkCredit";
import { DetailPlacard } from "./DetailPlacard";
import { DustParticles } from "./DustParticles";
import { EraIndicator } from "./EraIndicator";
import { HistoricalPanel } from "./HistoricalPanel";
import { PoemDisplay } from "./PoemDisplay";
import { TimelineControl } from "./TimelineControl";

type LensState = {
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
} | null;

const CENTURY_YEARS = Array.from(
  { length: (MAX_YEAR - MIN_YEAR) / 100 + 1 },
  (_, index) => MIN_YEAR + index * 100 + 23,
).map(clampYear);

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function MuseumTimeMachine() {
  const [year, setYear] = useState(1503);
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [poem, setPoem] = useState<PoemData | null>(null);
  const [station, setStation] = useState<AudioStation | null>(null);
  const [previousArtwork, setPreviousArtwork] = useState<ArtworkData | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [lens, setLens] = useState<LensState>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingLineIndex, setReadingLineIndex] = useState(-1);

  const artworkRef = useRef<ArtworkData | null>(null);
  const speechUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const era = getEraForYear(year);
  const ageIntensity = getAgeIntensity(year);
  const events = getHistoricalEventsForYear(year);

  const beginEraTransition = useCallback(() => {
    setIsTransitioning(true);
    setPreviousArtwork(artworkRef.current);
    setPoem(null);
    setReadingLineIndex(-1);
    window.speechSynthesis?.cancel();
    setIsReading(false);
  }, []);

  const commitYear = useCallback(
    (nextYear: number) => {
      beginEraTransition();
      setYear(clampYear(nextYear));
    },
    [beginEraTransition],
  );

  const stepCentury = useCallback(
    (direction: -1 | 1) => {
      beginEraTransition();
      setYear((current) => clampYear(current + direction * 100));
    },
    [beginEraTransition],
  );

  useEffect(() => {
    const controller = new AbortController();
    const range = getCenturyRange(year);

    Promise.all([
      fetchJson<ArtworkData>(
        `/api/artwork?year=${year}&yearStart=${range.start}&yearEnd=${range.end}`,
        controller.signal,
      ),
      fetchJson<PoemData>(`/api/poem?year=${year}`, controller.signal),
      fetchJson<AudioStation | null>(`/api/audio?year=${year}`, controller.signal),
    ])
      .then(([nextArtwork, nextPoem, nextStation]) => {
        artworkRef.current = nextArtwork;
        setArtwork(nextArtwork);
        setPoem(nextPoem);
        setStation(nextStation);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      })
      .finally(() => {
        window.setTimeout(() => {
          if (!controller.signal.aborted) {
            setIsTransitioning(false);
          }
        }, 450);
      });

    return () => controller.abort();
  }, [year]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        stepCentury(-1);
      }

      if (event.key === "ArrowRight") {
        stepCentury(1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stepCentury]);

  useEffect(() => {
    if (!isAutoWalking) {
      return;
    }

    const interval = window.setInterval(() => {
      const next = CENTURY_YEARS[Math.floor(Math.random() * CENTURY_YEARS.length)];
      commitYear(next === year ? clampYear(year + 100) : next);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [commitYear, isAutoWalking, year]);

  function updateLens(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    setLens({
      x,
      y,
      xPercent: ((x - rect.left) / rect.width) * 100,
      yPercent: ((y - rect.top) / rect.height) * 100,
    });
  }

  function stopReading() {
    window.speechSynthesis?.cancel();
    speechUtterancesRef.current = [];
    setIsReading(false);
    setReadingLineIndex(-1);
  }

  function toggleReading() {
    if (!poem) {
      return;
    }

    if (isReading) {
      stopReading();
      return;
    }

    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    const preferredVoice =
      voices.find((voice) => voice.lang === "en-GB") ??
      voices.find((voice) => voice.lang.startsWith("en"));
    const utterances = poem.lines.map((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.rate = 0.86;
      utterance.pitch = 0.92;
      utterance.volume = 0.9;
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setReadingLineIndex(index);
      utterance.onend = () => {
        if (index === poem.lines.length - 1) {
          setIsReading(false);
          setReadingLineIndex(-1);
        }
      };
      return utterance;
    });

    speechUtterancesRef.current = utterances;
    setIsReading(true);
    utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
  }

  return (
    <main
      className="time-machine"
      data-era={era.key}
      onDoubleClick={() => setIsDetailOpen(true)}
      onPointerLeave={() => setLens(null)}
      onPointerMove={updateLens}
      style={
        {
          "--era-color": era.baseColor,
          "--era-accent": era.accentColor,
          "--era-parchment": era.parchmentColor,
          "--era-font": era.fontVar,
          "--age-intensity": ageIntensity,
          "--age-blur": `${5 + ageIntensity * 7}px`,
          "--age-saturate": 1 - ageIntensity * 0.35,
          "--age-sepia": ageIntensity * 0.38,
          "--grain-opacity": 0.08 + ageIntensity * 0.34,
          "--dust-opacity": 0.35 + ageIntensity * 0.42,
          cursor: era.cursor,
        } as CSSProperties
      }
    >
      <ArtworkBackground
        artwork={artwork}
        previousArtwork={previousArtwork}
        isTransitioning={isTransitioning}
      />
      <DustParticles />
      <ArtworkCredit artwork={artwork} />
      <EraIndicator year={year} era={era} isTransitioning={isTransitioning} />
      <HistoricalPanel
        year={year}
        events={events}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen((current) => !current)}
      />
      {artwork && lens ? (
        <div
          className="art-lens"
          style={
            {
              left: lens.x,
              top: lens.y,
              backgroundImage: `url(${
                artwork.previewImageUrl ?? artwork.fallbackImageUrl ?? artwork.imageUrl
              })`,
              backgroundPosition: `${lens.xPercent}% ${lens.yPercent}%`,
          } as CSSProperties
          }
          aria-hidden="true"
        />
      ) : null}
      <div className="center-stage">
        <PoemDisplay
          poem={poem}
          isTransitioning={isTransitioning}
          isReading={isReading}
          readingLineIndex={readingLineIndex}
          onToggleReading={toggleReading}
        />
      </div>
      <div className="bottom-controls">
        <TimelineControl
          year={year}
          isAutoWalking={isAutoWalking}
          onYearChange={commitYear}
          onStepCentury={stepCentury}
          onToggleAutoWalk={() => setIsAutoWalking((current) => !current)}
        />
        <AmbientAudio
          station={station}
          enabled={isAudioEnabled}
          onToggle={() => setIsAudioEnabled((current) => !current)}
        />
      </div>
      <a
        className="github-link"
        href="https://github.com/puneetdixit200"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub puneetdixit200"
        title="GitHub puneetdixit200"
      >
        <GitBranch size={17} />
        <span>@puneetdixit200</span>
      </a>
      {isTransitioning ? (
        <div className="loading-rune" aria-label="Loading era">
          <Search size={20} />
        </div>
      ) : null}
      <DetailPlacard
        artwork={artwork}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </main>
  );
}
