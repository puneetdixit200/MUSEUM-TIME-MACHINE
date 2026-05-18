export const MIN_YEAR = 1000;
export const MAX_YEAR = 2000;
export const CENTURY_STEP = 100;

export type EraKey =
  | "medieval"
  | "renaissance"
  | "baroque"
  | "romantic"
  | "modern";

export type EraConfig = {
  key: EraKey;
  label: string;
  start: number;
  end: number;
  baseColor: string;
  accentColor: string;
  parchmentColor: string;
  fontVar: string;
  cursor: string;
  poets: string[];
  audioTags: string[];
};

export type CenturyRange = {
  start: number;
  end: number;
  label: string;
};

export const ERAS: EraConfig[] = [
  {
    key: "medieval",
    label: "Medieval",
    start: 1000,
    end: 1399,
    baseColor: "#2a1f14",
    accentColor: "#c49a62",
    parchmentColor: "rgba(235, 202, 144, 0.14)",
    fontVar: "var(--font-playfair)",
    cursor: "crosshair",
    poets: ["William Shakespeare", "John Milton"],
    audioTags: ["medieval", "early music", "chant"],
  },
  {
    key: "renaissance",
    label: "Renaissance",
    start: 1400,
    end: 1599,
    baseColor: "#1f0a0a",
    accentColor: "#d09b6b",
    parchmentColor: "rgba(255, 235, 188, 0.12)",
    fontVar: "var(--font-playfair)",
    cursor: "cell",
    poets: ["William Shakespeare", "John Milton"],
    audioTags: ["renaissance", "classical"],
  },
  {
    key: "baroque",
    label: "Baroque",
    start: 1600,
    end: 1749,
    baseColor: "#0a0f1f",
    accentColor: "#d6b56d",
    parchmentColor: "rgba(230, 214, 168, 0.11)",
    fontVar: "var(--font-garamond)",
    cursor: "zoom-in",
    poets: ["William Shakespeare", "John Milton", "Alexander Pope"],
    audioTags: ["baroque", "classical"],
  },
  {
    key: "romantic",
    label: "Romantic",
    start: 1750,
    end: 1899,
    baseColor: "#0a1f12",
    accentColor: "#b7d08f",
    parchmentColor: "rgba(223, 235, 193, 0.1)",
    fontVar: "var(--font-baskerville)",
    cursor: "grab",
    poets: [
      "William Blake",
      "John Keats",
      "Percy Bysshe Shelley",
      "Emily Dickinson",
      "Walt Whitman",
    ],
    audioTags: ["romantic", "classical"],
  },
  {
    key: "modern",
    label: "Modern",
    start: 1900,
    end: 2000,
    baseColor: "#141418",
    accentColor: "#9fb7d3",
    parchmentColor: "rgba(226, 232, 240, 0.08)",
    fontVar: "var(--font-lora)",
    cursor: "default",
    poets: ["Robert Frost", "T. S. Eliot", "William Carlos Williams"],
    audioTags: ["modern classical", "ambient", "classical"],
  },
];

const CENTURY_POETS: Record<number, string[]> = {
  1000: ["William Shakespeare", "John Milton"],
  1100: ["William Shakespeare", "John Milton"],
  1200: ["William Shakespeare", "John Milton"],
  1300: ["William Shakespeare", "John Milton"],
  1400: ["William Shakespeare", "John Milton"],
  1500: ["William Shakespeare", "John Milton"],
  1600: ["William Shakespeare", "John Milton", "Alexander Pope"],
  1700: ["Alexander Pope", "William Blake"],
  1800: [
    "William Blake",
    "John Keats",
    "Percy Bysshe Shelley",
    "Emily Dickinson",
    "Walt Whitman",
  ],
  1900: ["Robert Frost", "T. S. Eliot", "William Carlos Williams"],
  2000: ["Robert Frost", "T. S. Eliot", "William Carlos Williams"],
};

const HISTORICAL_EVENTS: Record<number, string[]> = {
  1000: [
    "The High Middle Ages begin to reshape European cities and monasteries.",
    "Illuminated manuscripts carry science, theology, and poetry across courts.",
    "Romanesque churches rise with thick stone walls and candlelit interiors.",
  ],
  1400: [
    "Humanist scholarship spreads through Florence, Venice, and northern Europe.",
    "Oil painting techniques deepen color, shadow, and realism.",
    "Artists study anatomy and perspective with new intensity.",
  ],
  1500: [
    "Leonardo begins the Mona Lisa around 1503.",
    "Michelangelo completes David in 1504.",
    "Printed books spread Renaissance poetry and science at unprecedented speed.",
  ],
  1600: [
    "Shakespeare's major tragedies appear in the early 1600s.",
    "The Dutch Golden Age transforms portraiture, trade, and domestic painting.",
    "The King James Bible is published in 1611.",
  ],
  1700: [
    "The Enlightenment reshapes salons, encyclopedias, and public debate.",
    "Bach, Vivaldi, and Handel define Baroque musical architecture.",
    "Rococo interiors make ornament feel airborne and theatrical.",
  ],
  1800: [
    "Romantic poets turn inward toward memory, nature, and sublime weather.",
    "Industrial cities alter the rhythm of work, travel, and art patronage.",
    "Museums become public classrooms for national collections.",
  ],
  1889: [
    "The Eiffel Tower opens for the Paris Exposition.",
    "Van Gogh paints The Starry Night at Saint-Remy.",
    "Symbolism and Post-Impressionism push painting beyond strict observation.",
  ],
  1900: [
    "Modernism fractures old forms across art, architecture, music, and poetry.",
    "Photography and cinema change how memory is recorded.",
    "Radio begins to turn sound into a shared public atmosphere.",
  ],
  1923: [
    "Time magazine publishes its first issue.",
    "The Bauhaus experiments with modern craft, typography, and architecture.",
    "Poetry after World War I favors fragments, city noise, and sharp images.",
  ],
};

export function getCenturyRange(year: number): CenturyRange {
  const clamped = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
  const start = Math.floor(clamped / CENTURY_STEP) * CENTURY_STEP;
  const end = Math.min(MAX_YEAR, start + CENTURY_STEP - 1);

  return {
    start,
    end,
    label: start === MAX_YEAR ? String(MAX_YEAR) : `${start}s`,
  };
}

export function getEraForYear(year: number): EraConfig {
  const clamped = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
  return (
    ERAS.find((era) => clamped >= era.start && clamped <= era.end) ??
    ERAS[ERAS.length - 1]
  );
}

export function getPoetsForYear(year: number): string[] {
  const { start } = getCenturyRange(year);
  return CENTURY_POETS[start] ?? getEraForYear(year).poets;
}

export function getHistoricalEventsForYear(year: number): string[] {
  const rounded = Math.round(year);
  const exactEvents = HISTORICAL_EVENTS[rounded];
  if (exactEvents) {
    return exactEvents;
  }

  const { start } = getCenturyRange(rounded);
  return HISTORICAL_EVENTS[start] ?? HISTORICAL_EVENTS[1900];
}

export function getAgeIntensity(year: number): number {
  const clamped = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
  return Number(((MAX_YEAR - clamped) / (MAX_YEAR - MIN_YEAR)).toFixed(3));
}
