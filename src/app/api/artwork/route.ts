import { getCenturyRange } from "@/data/eraConfig";
import {
  artworkDateOverlapsRange,
  clampYear,
  type ArtworkData,
  createFallbackArtwork,
  getArtworkSearchWindows,
  type YearRange,
} from "@/lib/timeMachine";

export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 7000;

type MetSearchResponse = {
  objectIDs?: number[] | null;
};

type MetObjectResponse = {
  objectID: number;
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  objectBeginDate?: number;
  medium?: string;
  department?: string;
  primaryImage?: string;
  primaryImageSmall?: string;
  objectURL?: string;
  dimensions?: string;
  culture?: string;
  repository?: string;
};

type HarvardResponse = {
  records?: Array<{
    id: number;
    title?: string;
    people?: Array<{ name?: string }>;
    dated?: string;
    yearmade?: number;
    medium?: string;
    department?: string;
    images?: Array<{ baseimageurl?: string }>;
    url?: string;
    dimensions?: string;
    culture?: string;
  }>;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 * 60 * 12 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function seededIndex(length: number, yearStart: number, yearEnd: number): number {
  if (length <= 1) {
    return 0;
  }

  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const seed = Number(today) + yearStart * 17 + yearEnd * 31;
  return Math.abs(seed) % length;
}

async function fetchMetArtwork(
  yearStart: number,
  yearEnd: number,
): Promise<ArtworkData | null> {
  const searchUrl = new URL(
    "https://collectionapi.metmuseum.org/public/collection/v1/search",
  );
  searchUrl.searchParams.set("dateBegin", String(yearStart));
  searchUrl.searchParams.set("dateEnd", String(yearEnd));
  searchUrl.searchParams.set("hasImages", "true");
  searchUrl.searchParams.set("q", "painting");

  const searchData = await fetchJson<MetSearchResponse>(searchUrl.toString());
  const objectIds = searchData?.objectIDs?.slice(0, 35) ?? [];
  if (objectIds.length === 0) {
    return null;
  }

  const startIndex = seededIndex(objectIds.length, yearStart, yearEnd);
  const orderedIds = [
    ...objectIds.slice(startIndex),
    ...objectIds.slice(0, startIndex),
  ].slice(0, 12);

  for (const objectId of orderedIds) {
    const object = await fetchJson<MetObjectResponse>(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`,
    );
    const imageUrl = object?.primaryImage || object?.primaryImageSmall;
    if (!object || !imageUrl) {
      continue;
    }
    if (
      !artworkDateOverlapsRange(
        object.objectDate,
        object.objectBeginDate,
        yearStart,
        yearEnd,
      )
    ) {
      continue;
    }

    return {
      id: `met-${object.objectID}`,
      title: object.title || "Untitled artwork",
      artist: object.artistDisplayName || "Unknown artist",
      date: object.objectDate || `${yearStart}-${yearEnd}`,
      year: object.objectBeginDate || yearStart,
      medium: object.medium || "Unknown medium",
      department: object.department || "Metropolitan Museum of Art",
      imageUrl,
      previewImageUrl: object.primaryImageSmall || imageUrl,
      source: "The Met",
      sourceUrl: object.objectURL,
      dimensions: object.dimensions,
      culture: object.culture,
      repository: object.repository || "Metropolitan Museum of Art",
    };
  }

  return null;
}

async function fetchHarvardArtwork(
  yearStart: number,
  yearEnd: number,
): Promise<ArtworkData | null> {
  const midYear = Math.round((yearStart + yearEnd) / 2);
  const url = new URL("https://api.harvardartmuseums.org/object");
  url.searchParams.set("yearmade", String(midYear));
  url.searchParams.set("hasimage", "1");
  url.searchParams.set("size", "20");
  url.searchParams.set("apikey", "demo");

  const data = await fetchJson<HarvardResponse>(url.toString());
  const artworks = (data?.records ?? []).filter(
    (artwork) =>
      artwork.images?.[0]?.baseimageurl &&
      artworkDateOverlapsRange(
        artwork.dated,
        artwork.yearmade,
        yearStart,
        yearEnd,
      ),
  );
  if (artworks.length === 0) {
    return null;
  }

  const artwork = artworks[seededIndex(artworks.length, yearStart, yearEnd)];
  const baseImageUrl = artwork.images?.[0]?.baseimageurl;
  const imageUrl = `${baseImageUrl}?width=1600`;

  return {
    id: `harvard-${artwork.id}`,
    title: artwork.title || "Untitled artwork",
    artist: artwork.people?.[0]?.name || "Unknown artist",
    date: artwork.dated || String(artwork.yearmade ?? yearStart),
    year: artwork.yearmade || yearStart,
    medium: artwork.medium || "Unknown medium",
    department: artwork.department || "Harvard Art Museums",
    imageUrl,
    previewImageUrl: `${baseImageUrl}?width=720`,
    source: "Harvard Art Museums",
    sourceUrl: artwork.url,
    dimensions: artwork.dimensions,
    culture: artwork.culture,
    repository: "Harvard Art Museums",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fallbackRange = getCenturyRange(1889);
  const requestedYearParam = searchParams.get("year");
  const requestedYear = Number(requestedYearParam);
  const hasRequestedYear =
    requestedYearParam !== null && Number.isFinite(requestedYear);
  const yearStart = Number(searchParams.get("yearStart")) || fallbackRange.start;
  const yearEnd = Number(searchParams.get("yearEnd")) || fallbackRange.end;
  const targetYear = hasRequestedYear ? clampYear(requestedYear) : yearStart;
  const searchWindows: YearRange[] = hasRequestedYear
    ? getArtworkSearchWindows(targetYear)
    : [{ start: yearStart, end: yearEnd }];
  const fallbackArtwork = createFallbackArtwork(targetYear);

  let artwork: ArtworkData | null = null;

  for (const range of searchWindows) {
    artwork =
      (await fetchMetArtwork(range.start, range.end)) ??
      (await fetchHarvardArtwork(range.start, range.end));

    if (artwork) {
      break;
    }
  }

  artwork = artwork
    ? {
        ...artwork,
        fallbackImageUrl: fallbackArtwork.previewImageUrl ?? fallbackArtwork.imageUrl,
      }
    : fallbackArtwork;

  return Response.json(artwork);
}
