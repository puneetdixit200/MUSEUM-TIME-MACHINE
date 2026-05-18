import { describe, expect, it } from "vitest";
import {
  CENTURY_POETS,
  getAgeIntensity,
  getCenturyRange,
  getEraForYear,
  getPoetsForYear,
} from "./eraConfig";

describe("eraConfig", () => {
  it("maps any year to its century range", () => {
    expect(getCenturyRange(1623)).toEqual({
      start: 1600,
      end: 1699,
      label: "1600s",
    });
    expect(getCenturyRange(2000)).toEqual({
      start: 2000,
      end: 2000,
      label: "2000",
    });
  });

  it("chooses visual eras from the configured historical bands", () => {
    expect(getEraForYear(1230).key).toBe("medieval");
    expect(getEraForYear(1503).key).toBe("renaissance");
    expect(getEraForYear(1681).key).toBe("baroque");
    expect(getEraForYear(1889).key).toBe("romantic");
    expect(getEraForYear(1923).key).toBe("modern");
  });

  it("uses known poets whose work is available through PoetryDB", () => {
    expect(getPoetsForYear(1445)).toContain("Geoffrey Chaucer");
    expect(getPoetsForYear(1445)).not.toEqual(
      expect.arrayContaining(["William Shakespeare", "John Milton"]),
    );
    expect(getPoetsForYear(1603)).toContain("William Shakespeare");
    expect(getPoetsForYear(1818)).toEqual(
      expect.arrayContaining(["John Keats", "Percy Bysshe Shelley"]),
    );
    expect(getPoetsForYear(1862)).toEqual(
      expect.arrayContaining(["Emily Dickinson", "Walt Whitman"]),
    );
    expect(getPoetsForYear(1923)).toContain("Wilfred Owen");
  });

  it("rotates poet search order by exact year to avoid repeating one author", () => {
    expect(getPoetsForYear(1503)[0]).not.toBe("William Shakespeare");
    expect(getPoetsForYear(1603)[0]).not.toBe("William Shakespeare");
    expect(getPoetsForYear(1604)[0]).not.toBe(getPoetsForYear(1603)[0]);
  });

  it("removes recently seen poets while fresh options exist", () => {
    const firstChoice = getPoetsForYear(1603)[0];

    expect(getPoetsForYear(1603, [firstChoice])).not.toContain(firstChoice);
  });

  it("keeps large PoetryDB author pools for varied visits", () => {
    expect(CENTURY_POETS[1500].length).toBeGreaterThanOrEqual(8);
    expect(CENTURY_POETS[1600].length).toBeGreaterThanOrEqual(18);
    expect(CENTURY_POETS[1700].length).toBeGreaterThanOrEqual(18);
    expect(CENTURY_POETS[1800].length).toBeGreaterThanOrEqual(45);
    expect(CENTURY_POETS[1900].length).toBeGreaterThanOrEqual(10);
    expect(new Set(Object.values(CENTURY_POETS).flat()).size).toBeGreaterThanOrEqual(
      80,
    );
  });

  it("ages the page more heavily for older years", () => {
    expect(getAgeIntensity(1100)).toBeGreaterThan(getAgeIntensity(1700));
    expect(getAgeIntensity(1700)).toBeGreaterThan(getAgeIntensity(2000));
  });
});
