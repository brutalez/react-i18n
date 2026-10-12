export namespace BrutalezI18n {
  export type Primitive = string | number | boolean | null | undefined

  export type MessageDictionary = {
    readonly [key: string]: string | MessageDictionary
  }

  export type Messages = Record<string, MessageDictionary>

  export type LocaleOf<TMessages extends Messages> = Extract<
    keyof TMessages,
    string
  >

  export type MessageTree<TMessages extends Messages> =
    TMessages[LocaleOf<TMessages>]

  export type TranslationKey<T> = {
    [K in keyof T & string]: T[K] extends string
      ? K
      : T[K] extends MessageDictionary
        ? `${K}.${TranslationKey<T[K]>}`
        : never
  }[keyof T & string]

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

  type StringPlaceholders<TMessage extends string> =
    TMessage extends `${string}{${infer Name}}${infer Rest}`
      ? Name | StringPlaceholders<Rest>
      : never

  export type InterpolationValues<TMessage extends string> = [
    StringPlaceholders<TMessage>,
  ] extends [never]
    ? Record<string, never> | undefined
    : {
        [K in StringPlaceholders<TMessage>]: Primitive
      }

  export type TranslationValues<
    TMessages extends Messages,
    TKey extends string,
  > =
    ValueAtPath<MessageTree<TMessages>, TKey> extends infer V extends string
      ? InterpolationValues<V>
      : Record<string, Primitive> | undefined

  export type I18nOptions<TMessages extends Messages> = {
    locale: LocaleOf<TMessages>
    fallbackLocale?: LocaleOf<TMessages>
    messages: TMessages
    onMissingKey?: (key: string, locale: string) => void
  }

  export type I18nInstance<TMessages extends Messages> = {
    readonly locale: LocaleOf<TMessages>
    readonly fallbackLocale: LocaleOf<TMessages>
    setLocale: (locale: LocaleOf<TMessages>) => void
    t: <TKey extends TranslationKey<MessageTree<TMessages>>>(
      key: TKey,
      values?: TranslationValues<TMessages, TKey>,
    ) => string
    subscribe: (listener: () => void) => () => void
    getSnapshot: () => LocaleOf<TMessages>
  }

  export interface Register {}

  export type RegisteredI18n = Register extends { i18n: infer TInstance }
    ? TInstance
    : BrutalezI18n.I18nInstance<BrutalezI18n.Messages>
}
