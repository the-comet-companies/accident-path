import fs from 'fs'
import path from 'path'
import { AccidentTypeSchema, type AccidentType } from '@/types/accident'
import { InjuryTypeSchema, type InjuryType } from '@/types/injury'
import { StateDataSchema, CityDataSchema, type StateData, type CityData } from '@/types/state'
import { GuideSchema, type Guide } from '@/types/content'
import { ToolConfigSchema, type ToolConfig } from '@/types/tool'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function loadAndValidate<T>(dir: string, slug: string, schema: { parse: (data: unknown) => T }): T {
  const filePath = path.join(CONTENT_DIR, dir, `${slug}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return schema.parse(raw)
}

function loadAll<T>(dir: string, schema: { parse: (data: unknown) => T }): T[] {
  const dirPath = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(dirPath)) return []
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json'))
    .map(f => schema.parse(JSON.parse(fs.readFileSync(path.join(dirPath, f), 'utf-8'))))
}

export const cms = {
  getAccident: (slug: string) => loadAndValidate<AccidentType>('accidents', slug, AccidentTypeSchema),
  getAllAccidents: () => loadAll<AccidentType>('accidents', AccidentTypeSchema),
  getInjury: (slug: string) => loadAndValidate<InjuryType>('injuries', slug, InjuryTypeSchema),
  getAllInjuries: () => loadAll<InjuryType>('injuries', InjuryTypeSchema),
  getState: (slug: string) => loadAndValidate<StateData>('states', slug, StateDataSchema),
  getAllStates: () => loadAll<StateData>('states', StateDataSchema),
  getCity: (slug: string) => loadAndValidate<CityData>('cities', slug, CityDataSchema),
  getAllCities: () => loadAll<CityData>('cities', CityDataSchema),
  getCitiesByState: (stateSlug: string) => loadAll<CityData>('cities', CityDataSchema).filter(c => c.stateSlug === stateSlug),
  getGuide: (slug: string) => loadAndValidate<Guide>('guides', slug, GuideSchema),
  getAllGuides: () => loadAll<Guide>('guides', GuideSchema),
  getTool: (slug: string) => loadAndValidate<ToolConfig>('tools', slug, ToolConfigSchema),
  getAllTools: () => loadAll<ToolConfig>('tools', ToolConfigSchema),
}
