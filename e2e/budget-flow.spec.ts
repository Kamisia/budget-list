import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("MVP flow: add expense, mark paid, data persists after reload", async ({ page }) => {
  const budgetInput = page.getByLabel(/Budżet miesięczny/i); // label -> input
  await budgetInput.fill("1000");

  await page.getByPlaceholder(/Nazwa/i).fill("Czynsz");
  await page.getByPlaceholder(/Kwota/i).fill("200");
  await page.getByRole("button", { name: /Dodaj/i }).click();

  await expect(page.getByText("Czynsz")).toBeVisible();


  const plannedCard = page.getByTestId("planned-card");
  await expect(plannedCard.getByText("Po planowanych wydatkach")).toBeVisible();
  await expect(plannedCard.getByText(/800/)).toBeVisible();

 
  await page.getByRole("checkbox", { name: /opłacone/i }).check();


  const actualCard = page.getByTestId("actual-card");
  await expect(actualCard.getByText(/800/)).toBeVisible();


  await page.reload();
  await expect(page.getByText("Czynsz")).toBeVisible();
  await expect(page.getByTestId("planned-card").getByText(/800/)).toBeVisible();
});
