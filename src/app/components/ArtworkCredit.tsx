import type { ArtworkData } from "@/lib/timeMachine";

type ArtworkCreditProps = {
  artwork: ArtworkData | null;
};

export function ArtworkCredit({ artwork }: ArtworkCreditProps) {
  if (!artwork) {
    return (
      <aside className="artwork-credit" aria-live="polite">
        <span>Searching museum collections</span>
      </aside>
    );
  }

  return (
    <aside className="artwork-credit" aria-live="polite">
      <span className="credit-title">{artwork.title}</span>
      <span>{artwork.artist}</span>
      <span>{artwork.date}</span>
      <span>{artwork.source}</span>
    </aside>
  );
}
