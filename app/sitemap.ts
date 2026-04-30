import type { MetadataRoute } from 'next'
import { cms } from '@/lib/cms'
import { SLUG_MAP_ES, SLUG_MAP_EN } from '@/i18n/config'

const BASE = 'https://accidentpath.com'

function url(path: string) {
  return `${BASE}${path}`
}

function bilingual(enPath: string, esPath: string): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: {
      en: url(enPath),
      es: url(esPath),
      'x-default': url(enPath),
    },
  }
}

const LIVE_EN_TOOL_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static EN-only pages ─────────────────────────────────────────────────
  const staticEnOnly: MetadataRoute.Sitemap = [
    { url: url('/about'),              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/about/how-it-works'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/for-attorneys'),      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/contact'),            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: url('/disclaimers'),        lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // ── Static bilingual pages ───────────────────────────────────────────────
  const staticBilingual: MetadataRoute.Sitemap = [
    {
      url: url('/'),
      lastModified: now, changeFrequency: 'monthly', priority: 1.0,
      alternates: bilingual('/', '/es/'),
    },
    {
      url: url('/accidents'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/accidents', '/es/accidentes'),
    },
    {
      url: url('/injuries'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/injuries', '/es/lesiones'),
    },
    {
      url: url('/guides'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/guides', '/es/guias'),
    },
    {
      url: url('/tools'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/tools', '/es/herramientas'),
    },
    {
      url: url('/states'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.8,
      alternates: bilingual('/states', '/es/estados'),
    },
    {
      url: url('/find-help'),
      lastModified: now, changeFrequency: 'monthly', priority: 0.8,
      alternates: bilingual('/find-help', '/es/buscar-ayuda'),
    },
  ]

  // ── Static ES-only pages ─────────────────────────────────────────────────
  const staticEsOnly: MetadataRoute.Sitemap = [
    { url: url('/es/'), lastModified: now, changeFrequency: 'monthly', priority: 1.0,
      alternates: bilingual('/', '/es/') },
    { url: url('/es/accidentes'), lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/accidents', '/es/accidentes') },
    { url: url('/es/lesiones'), lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/injuries', '/es/lesiones') },
    { url: url('/es/guias'), lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/guides', '/es/guias') },
    { url: url('/es/herramientas'), lastModified: now, changeFrequency: 'monthly', priority: 0.9,
      alternates: bilingual('/tools', '/es/herramientas') },
    { url: url('/es/estados'), lastModified: now, changeFrequency: 'monthly', priority: 0.8,
      alternates: bilingual('/states', '/es/estados') },
    { url: url('/es/buscar-ayuda'), lastModified: now, changeFrequency: 'monthly', priority: 0.8,
      alternates: bilingual('/find-help', '/es/buscar-ayuda') },
  ]

  // ── Accidents ────────────────────────────────────────────────────────────
  // Cross-reference against the actual ES accident list — SLUG_MAP_ES contains
  // injury slug mappings (spinal, traumatic-brain) that share EN slugs with
  // accident files; guard against generating alternates for non-existent ES pages.
  const esAccidentSlugSet = new Set(cms.getAllAccidents('es').map(a => a.slug))

  const enAccidents = cms.getAllAccidents().map(item => {
    const esSlug = SLUG_MAP_ES[item.slug]
    return {
      url: url(`/accidents/${item.slug}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
      alternates: esSlug && esAccidentSlugSet.has(esSlug)
        ? bilingual(`/accidents/${item.slug}`, `/es/accidentes/${esSlug}`)
        : undefined,
    }
  })

  const esAccidents = cms.getAllAccidents('es').map(item => {
    const enSlug = SLUG_MAP_EN[item.slug]
    return {
      url: url(`/es/accidentes/${item.slug}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
      alternates: enSlug
        ? bilingual(`/accidents/${enSlug}`, `/es/accidentes/${item.slug}`)
        : undefined,
    }
  })

  // ── Injuries ─────────────────────────────────────────────────────────────
  const enInjuries = cms.getAllInjuries().map(item => ({
    url: url(`/injuries/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
    alternates: SLUG_MAP_ES[item.slug]
      ? bilingual(`/injuries/${item.slug}`, `/es/lesiones/${SLUG_MAP_ES[item.slug]}`)
      : undefined,
  }))

  const esInjuries = cms.getAllInjuries('es').map(item => {
    const enSlug = SLUG_MAP_EN[item.slug]
    return {
      url: url(`/es/lesiones/${item.slug}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
      alternates: enSlug
        ? bilingual(`/injuries/${enSlug}`, `/es/lesiones/${item.slug}`)
        : undefined,
    }
  })

  // ── Guides ───────────────────────────────────────────────────────────────
  const enGuides = cms.getAllGuides().map(item => ({
    url: url(`/guides/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
    alternates: SLUG_MAP_ES[item.slug]
      ? bilingual(`/guides/${item.slug}`, `/es/guias/${SLUG_MAP_ES[item.slug]}`)
      : undefined,
  }))

  const esGuides = cms.getAllGuides('es').map(item => {
    const enSlug = SLUG_MAP_EN[item.slug]
    return {
      url: url(`/es/guias/${item.slug}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
      alternates: enSlug
        ? bilingual(`/guides/${enSlug}`, `/es/guias/${item.slug}`)
        : undefined,
    }
  })

  // ── Tools (EN: all; ES: live 5 only) ─────────────────────────────────────
  const enTools = cms.getAllTools().map(item => ({
    url: url(`/tools/${item.slug}`),
    lastModified: now, changeFrequency: 'yearly' as const, priority: 0.7,
    alternates: LIVE_EN_TOOL_SLUGS.includes(item.slug) && SLUG_MAP_ES[item.slug]
      ? bilingual(`/tools/${item.slug}`, `/es/herramientas/${SLUG_MAP_ES[item.slug]}`)
      : undefined,
  }))

  const esTools = cms.getAllTools('es').map(item => {
    const enSlug = SLUG_MAP_EN[item.slug]
    return {
      url: url(`/es/herramientas/${item.slug}`),
      lastModified: now, changeFrequency: 'yearly' as const, priority: 0.7,
      alternates: enSlug
        ? bilingual(`/tools/${enSlug}`, `/es/herramientas/${item.slug}`)
        : undefined,
    }
  })

  // ── States (slugs identical in EN and ES) ────────────────────────────────
  const enStates = cms.getAllStates().map(item => ({
    url: url(`/states/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
    alternates: bilingual(`/states/${item.slug}`, `/es/estados/${item.slug}`),
  }))

  const esStates = cms.getAllStates('es').map(item => ({
    url: url(`/es/estados/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
    alternates: bilingual(`/states/${item.slug}`, `/es/estados/${item.slug}`),
  }))

  // ── Cities (slugs identical in EN and ES) ────────────────────────────────
  const enCities = cms.getAllCities().map(item => ({
    url: url(`/states/${item.stateSlug}/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
    alternates: bilingual(
      `/states/${item.stateSlug}/${item.slug}`,
      `/es/estados/${item.stateSlug}/${item.slug}`,
    ),
  }))

  const esCities = cms.getAllCities('es').map(item => ({
    url: url(`/es/estados/${item.stateSlug}/${item.slug}`),
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
    alternates: bilingual(
      `/states/${item.stateSlug}/${item.slug}`,
      `/es/estados/${item.stateSlug}/${item.slug}`,
    ),
  }))

  return [
    ...staticEnOnly,
    ...staticBilingual,
    ...staticEsOnly,
    ...enAccidents,
    ...esAccidents,
    ...enInjuries,
    ...esInjuries,
    ...enGuides,
    ...esGuides,
    ...enTools,
    ...esTools,
    ...enStates,
    ...esStates,
    ...enCities,
    ...esCities,
  ]
}
