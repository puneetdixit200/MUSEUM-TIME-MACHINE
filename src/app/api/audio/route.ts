import { getEraForYear } from "@/data/eraConfig";
import type { AudioStation } from "@/lib/timeMachine";

export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 5000;

type RadioBrowserStation = {
  name?: string;
  url?: string;
  url_resolved?: string;
  homepage?: string;
};

async function findStation(tag: string): Promise<AudioStation | null> {
  try {
    const url = new URL(
      "https://all.api.radio-browser.info/json/stations/search",
    );
    url.searchParams.set("tag", tag);
    url.searchParams.set("limit", "20");
    url.searchParams.set("hidebroken", "true");
    url.searchParams.set("order", "clickcount");
    url.searchParams.set("reverse", "true");

    const response = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      next: { revalidate: 60 * 60 * 6 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    const stations = (await response.json()) as RadioBrowserStation[];
    const station = stations.find((candidate) =>
      (candidate.url_resolved || candidate.url || "").startsWith("https://"),
    );

    if (!station) {
      return null;
    }

    return {
      name: station.name || `${tag} radio`,
      streamUrl: station.url_resolved || station.url || "",
      homepage: station.homepage,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || 1889;
  const era = getEraForYear(year);

  for (const tag of era.audioTags) {
    const station = await findStation(tag);
    if (station) {
      return Response.json(station);
    }
  }

  return Response.json(null);
}
