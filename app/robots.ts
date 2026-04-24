import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/find-help/results', '/find-help/thank-you', '/api/'],
    },
    sitemap: 'https://accidentpath.com/sitemap.xml',
  }
}
