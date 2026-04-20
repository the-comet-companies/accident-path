import type { Metadata } from 'next'

const BASE_URL = 'https://accidentpath.com'

interface MetaTagsInput {
  title: string
  description: string
  canonical?: string
  noIndex?: boolean
  openGraphImage?: string
}

export function buildMetaTags({
  title,
  description,
  canonical,
  noIndex = false,
  openGraphImage,
}: MetaTagsInput): Metadata {
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AccidentPath',
      type: 'website',
      ...(openGraphImage ? { images: [{ url: openGraphImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(openGraphImage ? { images: [openGraphImage] } : {}),
    },
  }
}
