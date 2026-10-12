import type { i18n } from "./tests/fixtures/i18n"

declare module "./src/types" {
  namespace BrutalezI18n {
    interface Register {
      i18n: typeof i18n
    }
  }
}

export {}
