/**
 * Type definitions for the @brutalez/i18n library.
 */
export namespace BrutalezI18n {
  /**
   * Primitive values supported by translation interpolation.
   */
  export type Primitive = string | number | boolean | null | undefined

  /**
   * Represents a dictionary of translation messages.
   *
   * Messages can be strings or nested dictionaries, allowing
   * translations to be organized into hierarchical namespaces.
   */
  export type MessageDictionary = {
    readonly [key: string]: string | MessageDictionary
  }

  /**
   * Maps locale identifiers to their respective message dictionaries.
   *
   * Each key represents a locale, such as "en" or "id".
   */
  export type Messages = Record<string, MessageDictionary>

  /**
   * Extracts the locale identifiers from a messages object.
   */
  export type LocaleOf<TMessages extends Messages> = Extract<
    keyof TMessages,
    string
  >

  /**
   * Retrieves the message dictionary associated with the supported locales.
   */
  export type MessageTree<TMessages extends Messages> =
    TMessages[LocaleOf<TMessages>]

  /**
   * Generates dot-separated translation keys from a nested message dictionary.
   *
   * Only keys whose values are strings are included.
   * For example, `{ common: { greeting: "Hello" } }` produces
   * `"common.greeting"`.
   */
  export type TranslationKey<T> = {
    [K in keyof T & string]: T[K] extends string
      ? K
      : T[K] extends MessageDictionary
        ? `${K}.${TranslationKey<T[K]>}`
        : never
  }[keyof T & string]

  /**
   * Resolves the type of a message value at a dot-separated path.
   *
   * For example, `ValueAtPath<T, "common.greeting">` retrieves
   * the type of `T["common"]["greeting"]`.
   */
  type ValueAtPath<
    T,
    TPath extends string,
  > = TPath extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
      ? ValueAtPath<T[Head], Tail>
      : never
    : TPath extends keyof T
      ? T[TPath]
      : never

  /**
   * Extracts interpolation placeholder names from a message string.
   *
   * For example, `"Hello, {name}!"` produces `"name"`.
   * Multiple placeholders are combined into a union of their names.
   */
  type StringPlaceholders<TMessage extends string> =
    TMessage extends `${string}{${infer Name}}${infer Rest}`
      ? Name | StringPlaceholders<Rest>
      : never

  /**
   * Determines the interpolation values accepted by a message.
   *
   * Messages with known placeholders require an object containing
   * every placeholder. Messages without placeholders accept an optional
   * empty object. If the message type is a general `string`, arbitrary
   * primitive interpolation values are allowed.
   */
  export type InterpolationValues<TMessage extends string> =
    string extends TMessage
      ? Record<string, Primitive> | undefined
      : [StringPlaceholders<TMessage>] extends [never]
        ? Record<string, never> | undefined
        : { [K in StringPlaceholders<TMessage>]: Primitive }

  /**
   * Resolves the interpolation values required by a translation key.
   *
   * Looks up the message associated with `TKey` and derives its
   * placeholder requirements. Falls back to a general interpolation
   * object when the message value cannot be resolved as a string.
   */
  export type TranslationValues<
    TMessages extends Messages,
    TKey extends string,
  > =
    ValueAtPath<MessageTree<TMessages>, TKey> extends infer V extends string
      ? InterpolationValues<V>
      : Record<string, Primitive> | undefined

  /**
   * Configuration options for creating an internationalization instance.
   *
   * @template TMessages - The translation dictionaries keyed by locale.
   */
  export type I18nOptions<TMessages extends Messages> = {
    /** The initially active locale. */
    locale: LocaleOf<TMessages>

    /** The locale used when a translation is missing from the active locale. */
    fallbackLocale?: LocaleOf<TMessages>

    /** The translation dictionaries for each supported locale. */
    messages: TMessages

    /**
     * Optional callback invoked when a translation key is missing.
     *
     * @param key - The missing translation key.
     * @param locale - The locale in which the key is missing.
     */
    onMissingKey?: (key: string, locale: string) => void
  }

  /**
   * Represents a typed internationalization instance.
   *
   * Provides access to the active and fallback locales, locale switching,
   * type-safe translations, and subscription methods for reactive updates.
   *
   * @template TMessages - The translation dictionaries keyed by locale.
   */
  export type I18nInstance<TMessages extends Messages> = {
    /** The currently active locale. */
    readonly locale: LocaleOf<TMessages>

    /** The configured fallback locale. */
    readonly fallbackLocale: LocaleOf<TMessages>

    /**
     * Changes the active locale.
     *
     * @param locale - A locale defined in the translation dictionaries.
     */
    setLocale: (locale: LocaleOf<TMessages>) => void

    /**
     * Translates a message using its dot-separated key.
     *
     * Translation keys and interpolation values are inferred from
     * the provided message dictionaries.
     *
     * @param key - A valid translation key.
     * @param values - Values used to replace message placeholders.
     * @returns The translated message.
     */
    t: <TKey extends TranslationKey<MessageTree<TMessages>>>(
      key: TKey,
      values?: TranslationValues<TMessages, TKey>,
    ) => string

    /**
     * Subscribes to changes in the internationalization state.
     *
     * @param listener - Callback invoked when the state changes.
     * @returns A function that removes the subscription.
     */
    subscribe: (listener: () => void) => () => void

    /**
     * Returns the current locale snapshot.
     *
     * Intended for integration with React's `useSyncExternalStore`.
     */
    getSnapshot: () => LocaleOf<TMessages>
  }

  /**
   * Extension point for registering an application's typed i18n instance
   * through TypeScript module augmentation.
   */
  export interface Register {}

  /**
   * Resolves the globally registered i18n instance type, if provided.
   *
   * Applications can augment `Register` with an `i18n` property to
   * specify their instance type. Without registration, the type falls
   * back to an instance using the general `Messages` type.
   */
  export type RegisteredI18n = Register extends { i18n: infer TInstance }
    ? TInstance
    : BrutalezI18n.I18nInstance<BrutalezI18n.Messages>
}
