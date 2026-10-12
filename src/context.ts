import { createContext } from "react"
import { BrutalezI18n } from "./types"

export const I18nContext =
  createContext<BrutalezI18n.I18nInstance<BrutalezI18n.Messages> | null>(null)
