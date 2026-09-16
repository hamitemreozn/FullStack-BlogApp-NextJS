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

test("filtering keeps the reader at the journal section", async ({ page }) => {
  await page.goto("/");

  const filters = page.locator(".journal-filters");
  await filters.scrollIntoViewIfNeeded();
  const scrollPositionBeforeFiltering = await page.evaluate(
    () => window.scrollY,
  );

  await page.getByLabel("Yazılarda ara").fill("Gece");
  await page.getByRole("button", { name: "Filtrele" }).click();

  await expect(page).toHaveURL(/\?q=Gece$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrollPositionBeforeFiltering - 20);
  await expect(page.getByRole("link", { name: /Gece Venüs/i })).toBeVisible();
});
