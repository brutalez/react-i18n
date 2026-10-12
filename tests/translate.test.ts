import { describe, expect, it, vi } from "vitest"
import { translate } from "../src/translate"
import { messages } from "./fixtures/i18n"

const context = describe

describe("translate", () => {
  context("when looking up a translation", () => {
    it("should return the message for the current locale", () => {
      expect(
        translate(messages, "en", "en", "greeting", { name: "Alim" }),
      ).toBe("Hello, Alim!")
    })

    it("should return a nested translation", () => {
      expect(
        translate(messages, "en", "en", "nested.welcome", {
          name: "Alim",
        }),
      ).toBe("Welcome back, Alim!")
    })

    it("should return the message in the selected locale", () => {
      expect(
        translate(messages, "id", "en", "greeting", { name: "Alim" }),
      ).toBe("Halo, Alim!")
    })
  })

  context("when interpolating values", () => {
    it("should replace multiple placeholders", () => {
      const dictionary = {
        en: { message: "Hello, {name}. You have {count} messages." },
      }

      expect(
        translate(dictionary, "en", "en", "message", {
          name: "Alim",
          count: 3,
        }),
      ).toBe("Hello, Alim. You have 3 messages.")
    })

    it("should preserve the message when no values are provided", () => {
      expect(translate(messages, "en", "en", "plain")).toBe("Hello!")
    })
  })

  context("when using the fallback locale", () => {
    it("should return the fallback translation when the current locale lacks the key", () => {
      expect(translate(messages, "id", "en", "count", { count: 3 })).toBe(
        "You have 3 messages.",
      )
    })
  })

  context("when the translation is missing", () => {
    it("should invoke onMissingKey", () => {
      const onMissingKey = vi.fn()

      translate(messages, "en", "en", "unknown", undefined, onMissingKey)

      expect(onMissingKey).toHaveBeenCalledWith("unknown", "en")
    })
  })
})
