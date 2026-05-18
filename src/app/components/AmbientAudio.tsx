"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import type { AudioStation } from "@/lib/timeMachine";

type AmbientAudioProps = {
  station: AudioStation | null;
  enabled: boolean;
  onToggle: () => void;
};

export function AmbientAudio({
  station,
  enabled,
  onToggle,
}: AmbientAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0.18;

    if (!enabled || !station?.streamUrl) {
      audio.pause();
      return;
    }

    audio.load();
    void audio.play().catch(() => {
      audio.pause();
    });
  }, [enabled, station?.streamUrl]);

  return (
    <div className="audio-control">
      <audio ref={audioRef} loop preload="none" src={station?.streamUrl} />
      <button
        className="icon-button"
        type="button"
        onClick={onToggle}
        title={enabled ? "Mute ambient audio" : "Play ambient audio"}
        aria-label={enabled ? "Mute ambient audio" : "Play ambient audio"}
      >
        {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <span>{enabled && station ? station.name : "Silent"}</span>
    </div>
  );
}
