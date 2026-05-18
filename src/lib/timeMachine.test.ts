import { describe, expect, it } from "vitest";
import {
  clampYear,
  createFallbackArtwork,
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
});
