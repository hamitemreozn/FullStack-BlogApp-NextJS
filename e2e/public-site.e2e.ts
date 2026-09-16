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
