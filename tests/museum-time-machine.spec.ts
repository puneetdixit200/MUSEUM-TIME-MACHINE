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
  await expect(page.locator(".artwork-layer-current")).toBeVisible();
  await expect(page.locator(".artwork-layer-current")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await expect(page.locator(".artwork-layer-current")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.getByRole("link", { name: "GitHub puneetdixit200" })).toHaveAttribute(
    "href",
    "https://github.com/puneetdixit200",
  );

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
