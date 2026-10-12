import { I18nProvider, useTranslation } from "../../src"
import { i18n } from "../../tests/fixtures/i18n"

function App() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <main>
      <h1 data-testid="greeting">{t("greeting", { name: "Alim" })}</h1>

      <p data-testid="locale">{locale}</p>

      <button onClick={() => setLocale("id")}>Switch to Indonesian</button>
    </main>
  )
}

export function TestApp() {
  return (
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  )
}
