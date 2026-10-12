import { expect, test } from "@playwright/test"

test.describe("test the @brutalez/i18n", () => {
  test("renders the initial translation", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByTestId("greeting")).toHaveText("Hello, Alim!")

    await expect(page.getByTestId("locale")).toHaveText("en")
  })

  test("switches the locale", async ({ page }) => {
    await page.goto("/")

    await page
      .getByRole("button", {
        name: "Switch to Indonesian",
      })
      .click()

    await expect(page.getByTestId("greeting")).toHaveText("Halo, Alim!")

    await expect(page.getByTestId("locale")).toHaveText("id")
  })
})
