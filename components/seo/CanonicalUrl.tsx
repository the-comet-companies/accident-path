const BASE_URL = 'https://accidentpath.com'

export function buildCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${normalized}`
}

export function buildAlternates(path: string) {
  return {
    canonical: buildCanonicalUrl(path),
    languages: {
      'en-US': buildCanonicalUrl(path),
      'es-US': buildCanonicalUrl(`/es${path}`),
    },
  }
}
