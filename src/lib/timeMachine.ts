import { MAX_YEAR, MIN_YEAR, getCenturyRange } from "@/data/eraConfig";

export type ArtworkData = {
  id: string;
  title: string;
  artist: string;
  date: string;
  year: number;
  medium: string;
  department: string;
  imageUrl: string;
  source: string;
  sourceUrl?: string;
  dimensions?: string;
  culture?: string;
  repository?: string;
};

export type PoemData = {
  title: string;
  author: string;
  lines: string[];
  lineCount: number;
  source: string;
};

export type AudioStation = {
  name: string;
  streamUrl: string;
  homepage?: string;
};

const FALLBACK_ARTWORKS: ArtworkData[] = [
  {
    id: "fallback-renaissance",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    date: "c. 1503-1519",
    year: 1503,
    medium: "Oil on poplar panel",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
    source: "Curated fallback",
    repository: "Musee du Louvre",
  },
  {
    id: "fallback-baroque",
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    date: "1642",
    year: 1642,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/The_Nightwatch_by_Rembrandt.jpg",
    source: "Curated fallback",
    repository: "Rijksmuseum",
  },
  {
    id: "fallback-romantic",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    date: "1889",
    year: 1889,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    source: "Curated fallback",
    repository: "Museum of Modern Art",
  },
  {
    id: "fallback-modern",
    title: "Composition with Red, Blue and Yellow",
    artist: "Piet Mondrian",
    date: "1930",
    year: 1930,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
    source: "Curated fallback",
    repository: "Kunsthaus Zurich",
  },
  {
    id: "fallback-medieval",
    title: "The Wilton Diptych",
    artist: "Unknown English or French artist",
    date: "c. 1395-1399",
    year: 1395,
    medium: "Tempera on oak",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Wilton_diptych.jpg",
    source: "Curated fallback",
    repository: "National Gallery, London",
  },
];

export const FALLBACK_POEMS: PoemData[] = [
  {
    title: "Sonnet 18",
    author: "William Shakespeare",
    source: "Curated fallback",
    lineCount: 14,
    lines: [
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate:",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date;",
      "Sometime too hot the eye of heaven shines,",
      "And often is his gold complexion dimm'd;",
      "And every fair from fair sometime declines,",
      "By chance or nature's changing course untrimm'd;",
      "But thy eternal summer shall not fade,",
      "Nor lose possession of that fair thou owest;",
      "Nor shall death brag thou wanderest in his shade,",
      "When in eternal lines to time thou growest:",
      "So long as men can breathe or eyes can see,",
      "So long lives this, and this gives life to thee.",
    ],
  },
  {
    title: "Aedh Wishes for the Cloths of Heaven",
    author: "W. B. Yeats",
    source: "Curated fallback",
    lineCount: 8,
    lines: [
      "Had I the heavens' embroidered cloths,",
      "Enwrought with golden and silver light,",
      "The blue and the dim and the dark cloths",
      "Of night and light and the half-light,",
      "I would spread the cloths under your feet:",
      "But I, being poor, have only my dreams;",
      "I have spread my dreams under your feet;",
      "Tread softly because you tread on my dreams.",
    ],
  },
  {
    title: "The Road Not Taken",
    author: "Robert Frost",
    source: "Curated fallback",
    lineCount: 20,
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "Then took the other, as just as fair,",
      "And having perhaps the better claim,",
      "Because it was grassy and wanted wear;",
      "Though as for that the passing there",
      "Had worn them really about the same,",
      "And both that morning equally lay",
      "In leaves no step had trodden black.",
    ],
  },
];

export function clampYear(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
}

export function timelinePercent(year: number): number {
  const clamped = clampYear(year);
  return Number(
    (((clamped - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100).toFixed(2),
  );
}

export function normalizeAicImageUrl(imageId: string | null): string | null {
  if (!imageId) {
    return null;
  }

  return `https://www.artic.edu/iiif/2/${imageId}/full/1200,/0/default.jpg`;
}

export function limitPoemLines(lines: string[], maxLines = 18): string[] {
  return lines.map((line) => line.trim()).filter(Boolean).slice(0, maxLines);
}

export function createFallbackArtwork(year: number): ArtworkData {
  const { start } = getCenturyRange(year);
  const match =
    FALLBACK_ARTWORKS.find(
      (artwork) => artwork.year >= start && artwork.year <= start + 99,
    ) ??
    FALLBACK_ARTWORKS.find((artwork) => Math.abs(artwork.year - year) < 100) ??
    FALLBACK_ARTWORKS[2];

  return {
    ...match,
    id: `${match.id}-${year}`,
  };
}

export function createFallbackPoem(year: number): PoemData {
  if (year < 1750) {
    return FALLBACK_POEMS[0];
  }

  if (year < 1900) {
    return FALLBACK_POEMS[1];
  }

  return FALLBACK_POEMS[2];
}
