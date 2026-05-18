import { getCenturyRange } from "@/data/eraConfig";
import {
  type ArtworkData,
  createFallbackArtwork,
  normalizeAicImageUrl,
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

type AicResponse = {
  data?: Array<{
    id: number;
    title?: string;
    artist_display?: string;
    date_display?: string;
    date_start?: number;
    image_id?: string | null;
    medium_display?: string;
    department_title?: string;
    api_link?: string;
    dimensions?: string;
    place_of_origin?: string;
  }>;
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

    return {
      id: `met-${object.objectID}`,
      title: object.title || "Untitled artwork",
      artist: object.artistDisplayName || "Unknown artist",
      date: object.objectDate || `${yearStart}-${yearEnd}`,
      year: object.objectBeginDate || yearStart,
      medium: object.medium || "Unknown medium",
      department: object.department || "Metropolitan Museum of Art",
      imageUrl,
      source: "The Met",
      sourceUrl: object.objectURL,
      dimensions: object.dimensions,
      culture: object.culture,
      repository: object.repository || "Metropolitan Museum of Art",
    };
  }

  return null;
}

async function fetchAicArtwork(
  yearStart: number,
  yearEnd: number,
): Promise<ArtworkData | null> {
  const url = new URL("https://api.artic.edu/api/v1/artworks/search");
  url.searchParams.set("query[range][date_start][gte]", String(yearStart));
  url.searchParams.set("query[range][date_start][lte]", String(yearEnd));
  url.searchParams.set(
    "fields",
    [
      "id",
      "title",
      "artist_display",
      "date_display",
      "date_start",
      "image_id",
      "medium_display",
      "department_title",
      "api_link",
      "dimensions",
      "place_of_origin",
    ].join(","),
  );
  url.searchParams.set("limit", "24");

  const data = await fetchJson<AicResponse>(url.toString());
  const artworks = (data?.data ?? []).filter((artwork) => artwork.image_id);
  if (artworks.length === 0) {
    return null;
  }

  const artwork = artworks[seededIndex(artworks.length, yearStart, yearEnd)];
  const imageUrl = normalizeAicImageUrl(artwork.image_id ?? null);
  if (!imageUrl) {
    return null;
  }

  return {
    id: `aic-${artwork.id}`,
    title: artwork.title || "Untitled artwork",
    artist: artwork.artist_display || "Unknown artist",
    date: artwork.date_display || `${yearStart}-${yearEnd}`,
    year: artwork.date_start || yearStart,
    medium: artwork.medium_display || "Unknown medium",
    department: artwork.department_title || "Art Institute of Chicago",
    imageUrl,
    source: "Art Institute Chicago",
    sourceUrl: artwork.api_link,
    dimensions: artwork.dimensions,
    culture: artwork.place_of_origin,
    repository: "Art Institute of Chicago",
  };
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
    (artwork) => artwork.images?.[0]?.baseimageurl,
  );
  if (artworks.length === 0) {
    return null;
  }

  const artwork = artworks[seededIndex(artworks.length, yearStart, yearEnd)];
  return {
    id: `harvard-${artwork.id}`,
    title: artwork.title || "Untitled artwork",
    artist: artwork.people?.[0]?.name || "Unknown artist",
    date: artwork.dated || String(artwork.yearmade ?? yearStart),
    year: artwork.yearmade || yearStart,
    medium: artwork.medium || "Unknown medium",
    department: artwork.department || "Harvard Art Museums",
    imageUrl: `${artwork.images?.[0]?.baseimageurl}?width=1600`,
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
  const yearStart = Number(searchParams.get("yearStart")) || fallbackRange.start;
  const yearEnd = Number(searchParams.get("yearEnd")) || fallbackRange.end;
  const fallbackArtwork = createFallbackArtwork(yearStart);

  const artwork =
    (await fetchMetArtwork(yearStart, yearEnd)) ??
    (await fetchAicArtwork(yearStart, yearEnd)) ??
    (await fetchHarvardArtwork(yearStart, yearEnd)) ??
    fallbackArtwork;

  return Response.json(artwork);
}
