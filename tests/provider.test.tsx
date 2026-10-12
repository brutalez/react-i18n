import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { createI18n, I18nProvider, useTranslation } from "../src"
import { messages } from "./fixtures/i18n"

const context = describe

describe("I18nProvider", () => {
  context("when rendering children", () => {
    it("should render its children", () => {
      const i18n = createI18n({ locale: "en", messages })

      render(
        <I18nProvider i18n={i18n}>
          <p>Test content</p>
        </I18nProvider>,
      )

      expect(screen.getByText("Test content")).toBeInTheDocument()
    })
  })

  context("when providing the i18n instance", () => {
    it("should expose the configured locale to its children", () => {
      const i18n = createI18n({ locale: "en", messages })

      function TestComponent() {
        const { locale } = useTranslation()

        return <p data-testid="locale">{locale}</p>
      }

      render(
        <I18nProvider i18n={i18n}>
          <TestComponent />
        </I18nProvider>,
      )

      expect(screen.getByTestId("locale")).toHaveTextContent("en")
    })
  })
})
