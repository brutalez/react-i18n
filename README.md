# @brutalez/react-i18n

A type-safe internationalization library that makes experimenting with and implementing i18n in React projects easier.

## Features

- Type-safe translation keys inferred from your message definitions
- Autocomplete for nested translation keys
- Type-safe interpolation values
- React integration with `I18nProvider` and `useTranslation`
- Runtime locale switching
- Fallback locale support
- Missing translation callbacks
- Lightweight API with no required translation files or code generation

## Installation

```bash
pnpm add @brutalez/react-i18n
```

The library requires React 18 or later.

## Getting Started

### 1. Define Your Messages

Create your translation messages in a TypeScript file.

```ts
// src/i18n.ts
import { createI18n } from "@brutalez/react-i18n"

export const messages = {
  en: {
    greeting: "Hello, {name}!",
    navigation: {
      home: "Home",
      about: "About",
    },
    welcome: "Welcome back!",
  },
  id: {
    greeting: "Halo, {name}!",
    navigation: {
      home: "Beranda",
      about: "Tentang",
    },
    welcome: "Selamat datang kembali!",
  },
} as const

export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
})
```

The `as const` assertion preserves the literal types of your messages, allowing TypeScript to infer valid translation keys and interpolation parameters.

### 2. Add the Provider

Wrap your application with `I18nProvider`.

```tsx
// src/main.tsx
import { createRoot } from "react-dom/client"
import { I18nProvider } from "@brutalez/react-i18n"
import { App } from "./App"
import { i18n } from "./i18n"

createRoot(document.getElementById("root")!).render(
  <I18nProvider i18n={i18n}>
    <App />
  </I18nProvider>,
)
```

### 3. Translate Your Content

Use the `useTranslation` hook inside your React components.

```tsx
// src/App.tsx
import { useTranslation } from "@brutalez/react-i18n"

export function App() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <main>
      <h1>{t("greeting", { name: "Alim" })}</h1>

      <nav>
        <a href="/">{t("navigation.home")}</a>
        <a href="/about">{t("navigation.about")}</a>
      </nav>

      <p>Current locale: {locale}</p>

      <button onClick={() => setLocale("id")}>Switch to Indonesian</button>
    </main>
  )
}
```

When the locale changes, components using `useTranslation` update automatically.

## API Reference

### `createI18n(options)`

Creates an i18n instance containing your messages and locale configuration.

| Option           | Type                    | Description                                                      |
| ---------------- | ----------------------- | ---------------------------------------------------------------- |
| `locale`         | `Locale`                | Initial locale                                                   |
| `fallbackLocale` | `Locale`                | Locale used when a translation is missing from the active locale |
| `messages`       | `Messages`              | Translation messages indexed by locale                           |
| `onMissingKey`   | `(key, locale) => void` | Optional callback for missing translations                       |

The `fallbackLocale` defaults to the initial locale.

The returned instance exposes:

| Property or method    | Description                         |
| --------------------- | ----------------------------------- |
| `locale`              | Current locale                      |
| `fallbackLocale`      | Configured fallback locale          |
| `setLocale(locale)`   | Changes the active locale           |
| `t(key, values?)`     | Resolves a translation              |
| `subscribe(listener)` | Subscribes to locale changes        |
| `getSnapshot()`       | Returns the current locale snapshot |

### `I18nProvider`

Provides an i18n instance to React components through context.

```tsx
<I18nProvider i18n={i18n}>
  <App />
</I18nProvider>
```

### `useTranslation()`

Returns the translation function, active locale, and locale setter.

```tsx
const { t, locale, setLocale } = useTranslation()
```

The hook must be called inside an `I18nProvider`. Calling it outside the provider throws an error.

## Type Safety

Translation keys are inferred from your message definitions.

```ts
t("navigation.home") // Valid
t("navigation.about") // Valid

t("navigation.contact") // TypeScript error
t("unknown.key") // TypeScript error
```

Interpolation values are inferred from placeholders in the selected translation.

```ts
t("greeting", { name: "Alim" }) // Valid

t("greeting", { user: "Alim" }) // TypeScript error
```

For messages without interpolation placeholders, arbitrary interpolation values are not accepted.

## Nested Translation Keys

Organize messages into nested objects to keep translations structured.

```ts
const messages = {
  en: {
    account: {
      profile: {
        title: "Your profile",
      },
    },
  },
} as const
```

Access nested messages using dot-separated keys.

```ts
t("account.profile.title")
```

## Interpolation

Use `{placeholder}` syntax in your messages.

```ts
const messages = {
  en: {
    greeting: "Hello, {name}!",
    summary: "You have {count} notifications.",
  },
} as const
```

Pass values to `t()`:

```ts
t("greeting", { name: "Alim" })
t("summary", { count: 5 })
```

Supported interpolation values are strings, numbers, booleans, `null`, and `undefined`.

## Fallback Translations

Configure a fallback locale when creating the instance.

```ts
const i18n = createI18n({
  locale: "id",
  fallbackLocale: "en",
  messages,
})
```

If a key is unavailable in the active locale, the library can resolve it from the fallback locale.

If the key is missing from both locales, the library's missing-key behavior applies.

## Missing Translation Handling

Provide `onMissingKey` to observe missing translations.

```ts
const i18n = createI18n({
  locale: "en",
  messages,
  onMissingKey(key, locale) {
    console.warn(`Missing translation "${key}" for locale "${locale}"`)
  },
})
```

This callback can help identify incomplete translations during development.

## Development

Clone the repository and install dependencies.

```bash
git clone https://github.com/brutalez/react-i18n.git
cd react-i18n
pnpm install
```

Run the available scripts:

```bash
pnpm run dev
pnpm run build
pnpm test
pnpm run test:watch
pnpm run typecheck
pnpm run lint
pnpm run format:check
```

## Contributing

Contributions, bug reports, and suggestions are welcome. Please open an issue or pull request in the repository.

Before submitting a pull request, run the tests and TypeScript checks.

[Alim Naufal](https://alimnfl.com)
