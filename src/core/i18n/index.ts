import { sv } from './sv'
import { en } from './en'
import type { Language } from '../types'

export type Translations = typeof sv

export const translations: Record<Language, Translations> = { sv, en }

export function getTexts(language: Language): Translations {
  return translations[language] ?? translations.sv
}
