"use client";

/* eslint-disable @next/next/no-img-element */

import type { SyntheticEvent } from "react";
import type { ArtworkData } from "@/lib/timeMachine";

type ArtworkBackgroundProps = {
  artwork: ArtworkData | null;
  previousArtwork: ArtworkData | null;
  isTransitioning: boolean;
};

export function ArtworkBackground({
  artwork,
  previousArtwork,
  isTransitioning,
}: ArtworkBackgroundProps) {
  function handleImageError(
    event: SyntheticEvent<HTMLImageElement>,
    failedArtwork: ArtworkData,
  ) {
    const image = event.currentTarget;
    const fallbackUrl = failedArtwork.fallbackImageUrl;

    if (fallbackUrl && image.src !== fallbackUrl) {
      image.src = fallbackUrl;
      return;
    }

    image.style.opacity = "0";
  }

  return (
    <div className="artwork-background" aria-hidden="true">
      {previousArtwork ? (
        <img
          className={`artwork-layer artwork-layer-previous ${
            isTransitioning ? "is-visible" : ""
          }`}
          src={previousArtwork.previewImageUrl ?? previousArtwork.imageUrl}
          loading="lazy"
          decoding="async"
          onError={(event) => handleImageError(event, previousArtwork)}
          alt=""
        />
      ) : null}
      {artwork ? (
        <img
          key={artwork.id}
          className={`artwork-layer artwork-layer-current ${
            isTransitioning ? "is-arriving" : "is-visible"
          }`}
          src={artwork.previewImageUrl ?? artwork.imageUrl}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(event) => handleImageError(event, artwork)}
          alt=""
        />
      ) : (
        <div className="artwork-empty" />
      )}
      <div className="background-dim" />
      <div className="age-grain" />
      <div className="vignette" />
    </div>
  );
}
