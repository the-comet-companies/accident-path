import type { MetadataRoute } from 'next'
import { cms } from '@/lib/cms'

const BASE_URL = 'https://accidentpath.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,                  lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about/how-it-works`,lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/accidents`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/injuries`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/guides`,            lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/states`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/find-help`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/for-attorneys`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/disclaimers`,       lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const accidents = cms.getAllAccidents().map((item) => ({
    url: `${BASE_URL}/accidents/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const injuries = cms.getAllInjuries().map((item) => ({
    url: `${BASE_URL}/injuries/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guides = cms.getAllGuides().map((item) => ({
    url: `${BASE_URL}/guides/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const tools = cms.getAllTools().map((item) => ({
    url: `${BASE_URL}/tools/${item.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  const states = cms.getAllStates().map((item) => ({
    url: `${BASE_URL}/states/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const cities = cms.getAllCities().map((item) => ({
    url: `${BASE_URL}/states/${item.stateSlug}/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...accidents,
    ...injuries,
    ...guides,
    ...tools,
    ...states,
    ...cities,
  ]
}
