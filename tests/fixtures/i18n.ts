import { createI18n } from "../../src/create-i18n"

export const messages = {
  en: {
    greeting: "Hello, {name}!",
    nested: {
      welcome: "Welcome back, {name}!",
    },
    count: "You have {count} messages.",
    plain: "Hello!",
  },
  id: {
    greeting: "Halo, {name}!",
    nested: {
      welcome: "Selamat datang kembali, {name}!",
    },
    plain: "Halo!",
  },
} as const

export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
})
