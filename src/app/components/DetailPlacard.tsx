"use client";

/* eslint-disable @next/next/no-img-element */

import { X } from "lucide-react";
import type { ArtworkData } from "@/lib/timeMachine";

type DetailPlacardProps = {
  artwork: ArtworkData | null;
  isOpen: boolean;
  onClose: () => void;
};

export function DetailPlacard({
  artwork,
  isOpen,
  onClose,
}: DetailPlacardProps) {
  if (!isOpen || !artwork) {
    return null;
  }

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <button
        className="icon-button detail-close"
        type="button"
        onClick={onClose}
        aria-label="Close artwork details"
        title="Close artwork details"
      >
        <X size={18} />
      </button>
      <img className="detail-image" src={artwork.imageUrl} alt={artwork.title} />
      <section className="detail-placard">
        <p className="detail-kicker">{artwork.source}</p>
        <h2>{artwork.title}</h2>
        <dl>
          <div>
            <dt>Artist</dt>
            <dd>{artwork.artist}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{artwork.date}</dd>
          </div>
          <div>
            <dt>Medium</dt>
            <dd>{artwork.medium}</dd>
          </div>
          <div>
            <dt>Collection</dt>
            <dd>{artwork.repository || artwork.department}</dd>
          </div>
          {artwork.dimensions ? (
            <div>
              <dt>Dimensions</dt>
              <dd>{artwork.dimensions}</dd>
            </div>
          ) : null}
        </dl>
      </section>
    </div>
  );
}
