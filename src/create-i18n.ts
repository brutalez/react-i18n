import { translate } from "./translate"
import { BrutalezI18n } from "./types"

export function createI18n<const TMessages extends BrutalezI18n.Messages>(
  options: BrutalezI18n.I18nOptions<TMessages>,
): BrutalezI18n.I18nInstance<TMessages> {
  const { messages, onMissingKey } = options

  let currentLocale = options.locale
  const fallbackLocale = options.fallbackLocale ?? options.locale
  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  const notify = () => {
    for (const listener of [...listeners]) {
      listener()
    }
  }

  const instance: BrutalezI18n.I18nInstance<TMessages> = {
    get locale() {
      return currentLocale
    },

    get fallbackLocale() {
      return fallbackLocale
    },

    setLocale(locale: BrutalezI18n.LocaleOf<TMessages>) {
      if (locale === currentLocale) return

      currentLocale = locale
      notify()
    },

    t<
      TKey extends BrutalezI18n.TranslationKey<
        BrutalezI18n.MessageTree<TMessages>
      >,
    >(key: TKey, values?: BrutalezI18n.TranslationValues<TMessages, TKey>) {
      return translate(
        messages,
        currentLocale,
        fallbackLocale,
        key,
        values as Record<string, BrutalezI18n.Primitive> | undefined,
        onMissingKey,
      )
    },

    subscribe,

    getSnapshot: () => currentLocale,
  }

  return instance
}
