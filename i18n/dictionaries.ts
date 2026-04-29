import enStrings from './en.json'
import esStrings from './es.json'

export type Dictionary = typeof enStrings

// Compile-time parity check: TypeScript errors here mean es.json is missing keys
void (esStrings satisfies Dictionary)

export async function getDictionary(locale: 'en' | 'es'): Promise<Dictionary> {
  if (locale === 'es') return esStrings as Dictionary
  return enStrings
}
