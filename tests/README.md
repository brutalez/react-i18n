# Tests

This directory contains unit and React integration tests for `@brutalez/react-i18n`.

## Structure

```text
tests/
├── fixtures/
│   └── i18n.ts
├── setup/
│   └── index.tsx
├── create-i18n.test.ts
├── provider.test.tsx
├── translate.test.ts
└── use-translation.test.tsx
```

## Test Files

- **`fixtures/i18n.ts`** — Shared translation messages and i18n instances used across tests.
- **`setup/index.tsx`** — Shared React testing utilities, such as rendering components with `I18nProvider`.
- **`create-i18n.test.ts`** — Tests i18n instance creation, locale management, and subscriptions.
- **`provider.test.tsx`** — Tests the `I18nProvider` component.
- **`translate.test.ts`** — Tests translation resolution, nested keys, interpolation, fallback locales, and missing keys.
- **`use-translation.test.tsx`** — Tests the `useTranslation` hook and reactive locale updates.

## Running Tests

Run the complete test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm run test:watch
```

## Testing Principles

- Keep tests focused on one behavior at a time.
- Reuse shared fixtures when appropriate.
- Create fresh i18n instances when tests need isolated state.
- Test core translation logic independently of React.
- Use React Testing Library to test provider and hook behavior through rendered components.
