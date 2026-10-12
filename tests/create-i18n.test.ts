import { describe, expect, it, vi } from "vitest"
import { createI18n } from "../src"
import { messages } from "./fixtures/i18n"

const context = describe

describe("createI18n", () => {
  context("locale", () => {
    it("should use the configured locale", () => {
      const i18n = createI18n({ locale: "en", messages })

      expect(i18n.locale).toBe("en")
      expect(i18n.fallbackLocale).toBe("en")
    })

    it("should use the configured fallback locale", () => {
      const i18n = createI18n({
        locale: "id",
        fallbackLocale: "en",
        messages,
      })

      expect(i18n.fallbackLocale).toBe("en")
    })

    it("should change the locale", () => {
      const i18n = createI18n({ locale: "en", messages })

      i18n.setLocale("id")

      expect(i18n.locale).toBe("id")
    })
  })

  context("subscribe", () => {
    it("should notify subscribers when the locale changes", () => {
      const i18n = createI18n({ locale: "en", messages })
      const listener = vi.fn()

      i18n.subscribe(listener)
      i18n.setLocale("id")

      expect(listener).toHaveBeenCalledOnce()
    })

    it("should not notify subscribers when the locale stays the same", () => {
      const i18n = createI18n({ locale: "en", messages })
      const listener = vi.fn()

      i18n.subscribe(listener)
      i18n.setLocale("en")

      expect(listener).not.toHaveBeenCalled()
    })

    it("should stop notifying an unsubscribed listener", () => {
      const i18n = createI18n({ locale: "en", messages })
      const listener = vi.fn()
      const unsubscribe = i18n.subscribe(listener)

      unsubscribe()
      i18n.setLocale("id")

      expect(listener).not.toHaveBeenCalled()
    })
  })

  context("getSnapshot", () => {
    it("should return the current locale", () => {
      const i18n = createI18n({ locale: "en", messages })

      expect(i18n.getSnapshot()).toBe("en")
    })

    it("should return the updated locale", () => {
      const i18n = createI18n({ locale: "en", messages })

      i18n.setLocale("id")

      expect(i18n.getSnapshot()).toBe("id")
    })
  })
})
