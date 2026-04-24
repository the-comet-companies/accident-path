'use client'

import dynamic from 'next/dynamic'

const HomeAnimations = dynamic(
  () => import('./HomeAnimations').then(m => m.HomeAnimations),
  { ssr: false },
)

export function LazyAnimations() {
  return <HomeAnimations />
}
