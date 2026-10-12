import { BrutalezI18n } from "./types"

export type MissingKeyHandler = (key: string, locale: string) => void

function getMessage(
  dictionary: BrutalezI18n.MessageDictionary | undefined,
  key: string,
) {
  if (!dictionary) return undefined

  let current: unknown = dictionary

  for (const segment of key.split(".")) {
    if (
      typeof current !== "object" ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return undefined
    }

    current = (current as Record<string, unknown>)[segment]
  }
  return typeof current === "string" ? current : undefined
}

function interpolate(
  message: string,
  values?: Record<string, BrutalezI18n.Primitive>,
): string {
  return message.replace(/\{([^{}]+)\}/g, (placeholder, rawName: string) => {
    const name = rawName.trim()

    if (!values || !Object.prototype.hasOwnProperty.call(values, name)) {
      return placeholder
    }

    const value = values[name]

    return value == null ? "" : String(value)
  })
}

export function translate<TMessages extends BrutalezI18n.Messages>(
  messages: TMessages,
  locale: string,
  fallbackLocale: string,
  key: string,
  values?: Record<string, BrutalezI18n.Primitive>,
  onMissingKey?: MissingKeyHandler,
): string {
  const message =
    getMessage(messages[locale], key) ??
    getMessage(messages[fallbackLocale], key)

  if (message === undefined) {
    onMissingKey?.(key, locale)
    return key
  }

  return interpolate(message, values)
}
