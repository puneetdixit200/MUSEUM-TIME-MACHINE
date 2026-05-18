import { expect, test } from "@playwright/test";

test("serves varied early-era poetry instead of defaulting to Shakespeare", async ({
  request,
}) => {
  const response = await request.get("/api/poem?year=1503");
  expect(response.ok()).toBe(true);

  const poem = (await response.json()) as { author: string; lines: string[] };
  expect(poem.author).not.toBe("William Shakespeare");
  expect(poem.lines.length).toBeGreaterThan(5);
});

test("serves period-appropriate poetry for the 1400s", async ({ request }) => {
  const response = await request.get("/api/poem?year=1445");
  expect(response.ok()).toBe(true);

  const poem = (await response.json()) as { author: string; lines: string[] };
  expect(["William Shakespeare", "John Milton"]).not.toContain(poem.author);
  expect(poem.lines.length).toBeGreaterThan(5);
});

test("serves artwork near the selected year instead of an arbitrary century", async ({
  request,
}) => {
  const response = await request.get("/api/artwork?year=1445");
  expect(response.ok()).toBe(true);

  const artwork = (await response.json()) as { year: number };
  expect(Math.abs(artwork.year - 1445)).toBeLessThanOrEqual(15);
});

test("loads the museum time machine and renders an era", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Previous Century" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next Century" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Choose year" })).toHaveValue(
    "1503",
  );
  await expect
    .poll(async () => page.locator(".poem-lines p").count())
    .toBeGreaterThan(5);
  await expect(page.locator(".poem-container")).not.toHaveClass(/is-leaving/);
  await expect(page.locator(".artwork-layer-current")).toBeVisible();
  await expect(page.locator(".artwork-layer-current")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await expect(page.locator(".artwork-layer-current")).toHaveCSS(
    "transform",
    "none",
  );
  await expect
    .poll(async () =>
      page.locator(".artwork-layer-current").evaluate((image) => {
        if (!(image instanceof HTMLImageElement)) {
          return false;
        }

        return image.complete && image.naturalWidth > 0;
      }),
    )
    .toBe(true);
  await expect(page.getByRole("link", { name: "GitHub puneetdixit200" })).toHaveAttribute(
    "href",
    "https://github.com/puneetdixit200",
  );

  if (testInfo.project.name === "mobile-chromium") {
    const creditBox = await page.locator(".artwork-credit").boundingBox();
    const eraBox = await page.locator(".era-indicator").boundingBox();

    expect(creditBox).not.toBeNull();
    expect(eraBox).not.toBeNull();
    expect(creditBox!.y + creditBox!.height).toBeLessThanOrEqual(eraBox!.y);
  }

  await page.screenshot({
    path: `test-results/museum-time-machine-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("supports navigation, history, detail mode, audio, and the art lens", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect
    .poll(async () => page.locator(".poem-lines p").count())
    .toBeGreaterThan(5);

  await page.getByRole("button", { name: "Next Century" }).click();
  await expect(page.getByRole("slider", { name: "Choose year" })).toHaveValue(
    "1603",
  );

  await page.getByRole("button", { name: "Show historical events" }).click();
  await expect(page.getByText("What was happening")).toBeVisible();

  if (!isMobile) {
    await page.mouse.move(420, 260);
    await expect(page.locator(".art-lens")).toBeVisible();
    await page.mouse.dblclick(520, 340);
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close artwork details" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  await page.getByRole("button", { name: "Play ambient audio" }).click();
  await expect(page.getByRole("button", { name: "Mute ambient audio" })).toBeVisible();
});

test("stacks artwork preview above details on tablet portrait screens", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "responsive viewport matrix runs once",
  );

  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await expect
    .poll(async () => page.locator(".poem-lines p").count())
    .toBeGreaterThan(5);

  await page.mouse.dblclick(410, 560);
  await expect(page.getByRole("dialog")).toBeVisible();

  const layout = await page.evaluate(() => {
    const image = document.querySelector(".detail-image")?.getBoundingClientRect();
    const placard = document
      .querySelector(".detail-placard")
      ?.getBoundingClientRect();

    if (!image || !placard) {
      throw new Error("Detail elements were not rendered");
    }

    return {
      imageBottom: image.bottom,
      imageHeight: image.height,
      imageLeft: image.left,
      imageRight: image.right,
      placardLeft: placard.left,
      placardRight: placard.right,
      placardTop: placard.top,
      scrollWidth: document.documentElement.scrollWidth,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  });

  expect(layout.imageBottom).toBeLessThan(layout.placardTop);
  expect(layout.imageHeight).toBeLessThanOrEqual(layout.viewportHeight * 0.58);
  expect(layout.imageLeft).toBeGreaterThanOrEqual(0);
  expect(layout.imageRight).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.placardLeft).toBeGreaterThanOrEqual(0);
  expect(layout.placardRight).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
});
