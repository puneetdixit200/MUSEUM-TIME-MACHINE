import { describe, expect, it } from "vitest";
import {
  artworkDateOverlapsRange,
  clampYear,
  createFallbackArtwork,
  createFallbackPoem,
  getArtworkSearchWindows,
  limitPoemLines,
  normalizeAicImageUrl,
  timelinePercent,
} from "./timeMachine";

describe("timeMachine helpers", () => {
  it("keeps years inside the supported timeline", () => {
    expect(clampYear(822)).toBe(1000);
    expect(clampYear(1503)).toBe(1503);
    expect(clampYear(2108)).toBe(2000);
  });

  it("computes stable marker percentages across the timeline", () => {
    expect(timelinePercent(1000)).toBe(0);
    expect(timelinePercent(1500)).toBe(50);
    expect(timelinePercent(2000)).toBe(100);
  });

  it("builds Art Institute IIIF image URLs from image ids", () => {
    expect(normalizeAicImageUrl("abc123")).toBe(
      "https://www.artic.edu/iiif/2/abc123/full/1200,/0/default.jpg",
    );
    expect(normalizeAicImageUrl(null)).toBeNull();
  });

  it("limits poems to readable non-empty lines", () => {
    const lines = Array.from({ length: 30 }, (_, index) =>
      index % 5 === 0 ? "" : `line ${index}`,
    );

    expect(limitPoemLines(lines, 12)).toHaveLength(12);
    expect(limitPoemLines(lines, 12)).not.toContain("");
  });

  it("creates a complete fallback artwork for offline or API failure states", () => {
    expect(createFallbackArtwork(1889)).toMatchObject({
      title: expect.any(String),
      artist: expect.any(String),
      imageUrl: expect.stringMatching(/^https:\/\//),
      source: "Curated fallback",
    });
  });

  it("rotates fallback poems instead of always returning Shakespeare", () => {
    expect(createFallbackPoem(1445).author).toBe("Geoffrey Chaucer");
    expect(createFallbackPoem(1503).author).not.toBe("William Shakespeare");
    expect(["William Blake", "John Keats"]).toContain(
      createFallbackPoem(1818).author,
    );
    expect(createFallbackPoem(1604).author).not.toBe(
      createFallbackPoem(1603).author,
    );
  });

  it("builds progressively wider artwork search windows from the chosen year", () => {
    expect(getArtworkSearchWindows(1445)[0]).toEqual({
      start: 1445,
      end: 1445,
    });
    expect(getArtworkSearchWindows(1445)).toContainEqual({
      start: 1430,
      end: 1460,
    });
    expect(getArtworkSearchWindows(1445)).not.toContainEqual({
      start: 1400,
      end: 1499,
    });
  });

  it("checks artwork display dates against the active search window", () => {
    expect(artworkDateOverlapsRange("ca. 1465-70", 1465, 1445, 1445)).toBe(
      false,
    );
    expect(artworkDateOverlapsRange("ca. 1465-70", 1465, 1460, 1475)).toBe(
      true,
    );
    expect(artworkDateOverlapsRange("c. 1503-1519", 1503, 1503, 1503)).toBe(
      true,
    );
  });
});
