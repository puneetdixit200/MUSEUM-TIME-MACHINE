import { getAvailablePoetsForYear } from "@/data/eraConfig";
import {
  type PoemData,
  createFallbackPoem,
  getCuratedFallbackPoemsForYear,
  limitPoemLines,
} from "@/lib/timeMachine";

export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 7000;

type PoetryDbPoem = {
  title?: string;
  author?: string;
  lines?: string[];
  linecount?: string;
};

async function fetchPoemsByAuthor(author: string): Promise<PoetryDbPoem[]> {
  try {
    const response = await fetch(
      `https://poetrydb.org/author/${encodeURIComponent(author)}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 60 * 60 * 12 },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as PoetryDbPoem[] | { status?: number };
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function choosePoem(poems: PoetryDbPoem[], year: number): PoetryDbPoem | null {
  const readablePoems = poems.filter((poem) => {
    const lines = limitPoemLines(poem.lines ?? [], 24);
    return lines.length >= 6 && lines.length <= 24;
  });

  if (readablePoems.length === 0) {
    return null;
  }

  return readablePoems[Math.abs(year) % readablePoems.length];
}

function getExcludedAuthors(searchParams: URLSearchParams): string[] {
  const repeatedAuthors = searchParams.getAll("excludeAuthor");
  const combinedAuthors = (searchParams.get("excludeAuthors") ?? "")
    .split(",")
    .map((author) => author.trim());

  return [...repeatedAuthors, ...combinedAuthors].filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || 1889;
  const excludedAuthors = getExcludedAuthors(searchParams);
  const curatedEarlyPoems = getCuratedFallbackPoemsForYear(year);

  if (curatedEarlyPoems.length > 0) {
    return Response.json(createFallbackPoem(year, excludedAuthors));
  }

  const poets = getAvailablePoetsForYear(year, excludedAuthors);

  for (const poet of poets) {
    const poem = choosePoem(await fetchPoemsByAuthor(poet), year);
    if (!poem?.lines) {
      continue;
    }

    const lines = limitPoemLines(poem.lines, 18);
    const payload: PoemData = {
      title: poem.title || "Untitled poem",
      author: poem.author || poet,
      lines,
      lineCount: Number(poem.linecount) || lines.length,
      source: "PoetryDB",
    };

    return Response.json(payload);
  }

  return Response.json(createFallbackPoem(year, excludedAuthors));
}
