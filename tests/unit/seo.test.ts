import { describe, it, expect } from 'vitest'
import {
  organizationSchema,
  breadcrumbSchema,
  articleSchema,
} from '@/lib/seo'

describe('organizationSchema', () => {
  it('returns the correct @type and name', () => {
    const schema = organizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('AccidentPath')
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('includes the canonical URL', () => {
    const schema = organizationSchema()
    expect(schema.url).toBe('https://accidentpath.com')
  })
})

describe('breadcrumbSchema', () => {
  it('prepends Home as the first item', () => {
    const schema = breadcrumbSchema([{ label: 'Accidents', href: '/accidents' }])
    expect(schema.itemListElement[0].name).toBe('Home')
    expect(schema.itemListElement[0].position).toBe(1)
  })

  it('assigns sequential positions', () => {
    const schema = breadcrumbSchema([
      { label: 'Accidents', href: '/accidents' },
      { label: 'Car', href: '/accidents/car' },
    ])
    const positions = schema.itemListElement.map(i => i.position)
    expect(positions).toEqual([1, 2, 3])
  })

  it('builds full absolute URLs for item hrefs', () => {
    const schema = breadcrumbSchema([{ label: 'Guides', href: '/guides' }])
    const guidesItem = schema.itemListElement[1]
    expect((guidesItem as { item?: string }).item).toBe('https://accidentpath.com/guides')
  })

  it('omits item URL for the last crumb (no href)', () => {
    const schema = breadcrumbSchema([{ label: 'Car Accident' }])
    const last = schema.itemListElement[1] as Record<string, unknown>
    expect(last.item).toBeUndefined()
  })

  it('returns correct @type', () => {
    const schema = breadcrumbSchema([])
    expect(schema['@type']).toBe('BreadcrumbList')
  })
})

describe('articleSchema', () => {
  const base = {
    title: 'What to Do After a Car Accident',
    description: 'Step-by-step guidance for car accident victims.',
    slug: 'car-accident-steps',
  }

  it('sets @type to Article', () => {
    expect(articleSchema(base)['@type']).toBe('Article')
  })

  it('sets headline from title', () => {
    expect(articleSchema(base).headline).toBe(base.title)
  })

  it('builds canonical url from slug', () => {
    const schema = articleSchema(base)
    expect(schema.url).toContain(base.slug)
  })

  it('includes reviewedBy when provided', () => {
    const schema = articleSchema({ ...base, reviewedBy: 'Jane Smith, Esq.' })
    expect(JSON.stringify(schema)).toContain('Jane Smith, Esq.')
  })
})
