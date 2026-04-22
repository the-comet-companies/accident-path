const BASE_URL = 'https://accidentpath.com'

// ─── Organization ────────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AccidentPath',
    url: BASE_URL,
    description:
      'Accident guidance and attorney matching platform for injured people in California and Arizona.',
    sameAs: [],
  }
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbSchemaItem {
  label: string
  href?: string
}

export function breadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  const withHome: BreadcrumbSchemaItem[] = [{ label: 'Home', href: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: withHome.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  }
}

// ─── Article ─────────────────────────────────────────────────────────────────

export interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  datePublished?: string
  dateModified?: string
  reviewedBy?: string
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  reviewedBy,
}: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'AccidentPath',
      url: BASE_URL,
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(reviewedBy
      ? {
          reviewedBy: {
            '@type': 'Person',
            name: reviewedBy,
          },
        }
      : {}),
  }
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
}

export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

// ─── SoftwareApplication ─────────────────────────────────────────────────────

export interface SoftwareApplicationSchemaInput {
  name: string
  description: string
  url: string
  applicationCategory?: string
}

export function softwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'LegalService',
}: SoftwareApplicationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'AccidentPath',
      url: BASE_URL,
    },
  }
}
