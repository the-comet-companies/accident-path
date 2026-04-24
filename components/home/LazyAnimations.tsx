'use client'

import dynamic from 'next/dynamic'

// Lazy-load GSAP-dependent components so they don't block first paint
const HomeAnimations = dynamic(
  () => import('./HomeAnimations').then(m => m.HomeAnimations),
  { ssr: false },
)

// HeroVisual is decorative (aria-hidden), absolutely positioned — safe to lazy-load
export const LazyHeroVisual = dynamic(
  () => import('./HeroVisual').then(m => m.HeroVisual),
  { ssr: false, loading: () => null },
)

export function LazyAnimations() {
  return <HomeAnimations />
}
