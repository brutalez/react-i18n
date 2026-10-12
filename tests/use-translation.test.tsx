import { act, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { createI18n, I18nProvider, useTranslation } from "../src"
import { messages } from "./fixtures/i18n"

const context = describe

function TestComponent() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <>
      <p data-testid="greeting">{t("greeting", { name: "Alim" })}</p>
      <p data-testid="locale">{locale}</p>
      <button onClick={() => setLocale("id")}>Switch locale</button>
    </>
  )
}

describe("useTranslation", () => {
  context("when used inside I18nProvider", () => {
    it("should return the current locale and translation", () => {
      const i18n = createI18n({ locale: "en", messages })

      render(
        <I18nProvider i18n={i18n}>
          <TestComponent />
        </I18nProvider>,
      )

      expect(screen.getByTestId("greeting")).toHaveTextContent("Hello, Alim!")
      expect(screen.getByTestId("locale")).toHaveTextContent("en")
    })

    it("should update the translation when the locale changes", () => {
      const i18n = createI18n({ locale: "en", messages })

      render(
        <I18nProvider i18n={i18n}>
          <TestComponent />
        </I18nProvider>,
      )

      act(() => {
        screen.getByRole("button", { name: "Switch locale" }).click()
      })

      expect(screen.getByTestId("greeting")).toHaveTextContent("Halo, Alim!")
      expect(screen.getByTestId("locale")).toHaveTextContent("id")
    })
  })

  context("when used outside I18nProvider", () => {
    it("should throw an error", () => {
      function TestComponentOutsideProvider() {
        useTranslation()
        return null
      }

      expect(() => render(<TestComponentOutsideProvider />)).toThrow(
        "useTranslation must be used inside <I18nProvider>",
      )
    })
  })
})
