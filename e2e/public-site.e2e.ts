import { expect, test } from "@playwright/test";

test("published post cover, consultation page and admin redirect work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Gökyüzünün dili, hayatınızın pusulası.",
    }),
  ).toBeVisible();

  const postCard = page.getByRole("link", { name: /Gece Venüs/i });
  await expect(postCard).toBeVisible();
  await expect(postCard.locator("img")).toHaveAttribute(
    "src",
    /\/api\/media\//,
  );

  await page.goto("/posts/gece-venus");
  const cover = page.locator(".article-cover");
  await expect(cover).toBeVisible();
  expect(await cover.evaluate((image) => image.naturalWidth)).toBeGreaterThan(
    0,
  );

  await page.goto("/contact");
  await expect(
    page.getByRole("heading", {
      name: "Haritanızı, kendi hikâyenizin merkezinden okuyalım.",
    }),
  ).toBeVisible();

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: "Güvenli giriş" }),
  ).toBeVisible();
});

test("typing filters the journal without moving the reader", async ({
  page,
}) => {
  await page.goto("/");

  const filters = page.locator(".journal-filters");
  await filters.scrollIntoViewIfNeeded();
  const scrollPositionBeforeFiltering = await page.evaluate(
    () => window.scrollY,
  );

  const searchInput = page.getByLabel("Yazılarda ara");
  await searchInput.fill("Se");

  await expect(page).toHaveURL(/\?q=Se$/);
  await expect(searchInput).toBeFocused();

  await searchInput.pressSequentially("v");

  await expect(searchInput).toHaveValue("Sev");
  await expect(page).toHaveURL(/\?q=Sev$/);
  await expect(searchInput).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrollPositionBeforeFiltering - 20);
  await expect(
    page.getByRole("link", { name: /Sevgi dillerini fark etmek/i }),
  ).toBeVisible();
});

test("journal cards keep a consistent cover and text grid", async ({
  page,
}) => {
  await page.goto("/#yazilar");

  const cards = page.locator(".post-card");
  await expect(cards).toHaveCount(9);
  await expect(cards.first().locator(".post-cover")).toBeVisible();

  const measurements = await cards.evaluateAll((items) =>
    items.map((card) => {
      const cardBox = card.getBoundingClientRect();
      const coverBox = card
        .querySelector(".post-cover-frame")!
        .getBoundingClientRect();
      const titleBox = card.querySelector("h3")!.getBoundingClientRect();
      return {
        cardHeight: cardBox.height,
        coverHeight: coverBox.height,
        coverOffset: coverBox.top - cardBox.top,
        titleHeight: titleBox.height,
      };
    }),
  );

  expect(new Set(measurements.map((item) => item.cardHeight)).size).toBe(1);
  expect(new Set(measurements.map((item) => item.coverHeight)).size).toBe(1);
  expect(new Set(measurements.map((item) => item.coverOffset)).size).toBe(1);
  expect(measurements[0]?.coverOffset).toBeCloseTo(1);
  expect(new Set(measurements.map((item) => item.titleHeight)).size).toBe(1);
});
