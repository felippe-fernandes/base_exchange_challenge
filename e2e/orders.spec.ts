import { expect, test } from "@playwright/test";

async function resetDb(page: Parameters<typeof test.beforeEach>[0]["page"], count = 1200) {
  const response = await page.request.post("http://localhost:3001/admin/reseed", {
    data: { count },
  });
  expect(response.ok()).toBeTruthy();
}

async function gotoOrders(page: Parameters<typeof test.beforeEach>[0]["page"]) {
  await page.goto("/orders");
  await expect(page).toHaveURL(/createdAt_gte=/);
  await expect(page.getByRole("button", { name: "New Order" })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/\d+ of \d+ orders loaded/)).toBeVisible();
}

async function selectDropdownOption(
  page: Parameters<typeof test.beforeEach>[0]["page"],
  triggerLabel: string,
  optionLabel: string,
) {
  await page.getByLabel(triggerLabel).click();
  await page.getByRole("option", { name: optionLabel }).click();
}

test.describe("orders page", () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page);
  });

  test("redirects to the default date filter and loads the table", async ({ page }) => {
    await gotoOrders(page);

    await expect(page.getByText(/\d+ of \d+ orders loaded/)).toBeVisible();
    await expect(page.getByRole("button", { name: "New Order" })).toBeVisible();
  });

  test("creates a new order from the dialog", async ({ page }) => {
    await gotoOrders(page);

    await page.getByRole("button", { name: "New Order" }).click();
    await expect(page.getByRole("heading", { name: "Create Order" })).toBeVisible();

    await page.locator("#instrument").fill("E2E-ORDER");
    await page.getByRole("button", { name: "Sell" }).click();
    await page.locator("#price-value").fill("123.45");
    await page.locator("#quantity").fill("100");
    await page.getByRole("dialog").getByRole("button", { name: "Create Order" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByText("E2E-ORDER")).toBeVisible();
  });

  test("supports sorting and multi-sort from the table header", async ({ page }) => {
    await gotoOrders(page);

    await page.getByRole("button", { name: "Price", exact: true }).click();
    await expect(page).toHaveURL(/sort=price/);

    await page.keyboard.down("Shift");
    await page.getByRole("button", { name: "Date/Time", exact: true }).click();
    await page.keyboard.up("Shift");

    await expect(page).toHaveURL(/sort=(price%2CcreatedAt|createdAt%2Cprice)/);
  });

  test("applies a status filter and can clear it", async ({ page }) => {
    await gotoOrders(page);

    await page.getByLabel("Status filter").click();
    await page.locator("label", { hasText: "Open" }).last().click();

    await expect(page).toHaveURL(/status=open/);
    await expect(page.getByText(/Status: open/i)).toBeVisible();

    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page).not.toHaveURL(/status=open/);
  });

  test("opens the row context menu and shows order details", async ({ page }) => {
    await gotoOrders(page);

    const firstRow = page.locator("tbody tr").filter({ has: page.locator("td") }).first();
    await firstRow.click({ button: "right" });
    await page.getByText("View Details").click();

    await expect(page.getByRole("tab", { name: "Status History" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Executions" })).toBeVisible();
  });
});

test.describe("header actions", () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page);
    await gotoOrders(page);
  });

  test("updates user settings and uses preferred currency as the create order default", async ({ page }) => {
    await page.getByRole("button", { name: "Settings" }).click();
    await selectDropdownOption(page, "Preferred currency", "BRL");
    await selectDropdownOption(page, "Date format", "DD/MM/YYYY");
    await selectDropdownOption(page, "Time format", "12-hour");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "New Order" }).click();
    await expect(page.getByLabel("Currency")).toContainText("BRL");
    await expect(page.getByText(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} (AM|PM)/).first()).toBeVisible();
  });

  test("regenerates the database from the header dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Regenerate DB" }).click();
    await page.getByLabel("How many items should be created?").fill("1300");
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByRole("heading", { name: "Regenerate database" })).toBeHidden();

    const response = await page.request.get("http://localhost:3001/orders?_page=1&_per_page=1");
    const payload = await response.json();
    expect(payload.items).toBe(1300);
  });
});
