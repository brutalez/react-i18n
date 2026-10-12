import { createContext, useContext, useSyncExternalStore } from "react"
import { BrutalezI18n } from "./types"

const I18nContext = createContext<BrutalezI18n.RegisteredI18n | null>(null)

export interface I18nProviderProps {
  i18n: BrutalezI18n.RegisteredI18n
  children: React.ReactNode
}

export function I18nProvider({ i18n, children }: I18nProviderProps) {
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const i18n = useContext(I18nContext)
  if (!i18n)
    throw new Error("useTranslation must be used inside <I18nProvider>")

  const locale = useSyncExternalStore(
    i18n.subscribe,
    i18n.getSnapshot,
    i18n.getSnapshot,
  )

  return { t: i18n.t, locale, setLocale: i18n.setLocale }
}
