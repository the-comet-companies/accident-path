'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function HomeAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // ── Hero: plays immediately on load ──────────────────────────────────
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from('[data-animate="hero-eyebrow"]', { opacity: 0, y: 12, duration: 0.45 })
        .from('#hero-heading',                 { opacity: 0, y: 28, duration: 0.6  }, '-=0.2')
        .from('[data-animate="hero-body"]',    { opacity: 0, y: 18, duration: 0.5  }, '-=0.3')
        .from('[data-animate="hero-ctas"]',    { opacity: 0, y: 14, duration: 0.4  }, '-=0.25')
        .from('[data-animate="hero-card"]',    { opacity: 0, x: 32, duration: 0.7  }, '-=0.55')
        .from('[data-animate="hero-card-item"]', {
          opacity: 0, x: 18, duration: 0.4, stagger: 0.13,
        }, '-=0.45')

      // ── Trust badges ─────────────────────────────────────────────────────
      gsap.from('[data-animate="trust-badge"]', {
        opacity: 0, y: 14, duration: 0.4, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="trust-badge"]', start: 'top 90%' },
      })

      // ── How It Works: heading then steps ─────────────────────────────────
      gsap.from('#how-it-works-heading', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '#how-it-works-heading', start: 'top 85%' },
      })
      gsap.from('[data-animate="step-item"]', {
        opacity: 0, y: 32, duration: 0.55, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="step-item"]', start: 'top 85%' },
      })

      // ── Accident cards ───────────────────────────────────────────────────
      gsap.from('#accident-types-heading', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '#accident-types-heading', start: 'top 85%' },
      })
      gsap.from('[data-animate="accident-card"]', {
        opacity: 0, y: 26, duration: 0.45, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="accident-card"]', start: 'top 85%' },
      })

      // ── Tool cards ───────────────────────────────────────────────────────
      gsap.from('#tools-heading', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '#tools-heading', start: 'top 85%' },
      })
      gsap.from('[data-animate="tool-card"]', {
        opacity: 0, y: 26, duration: 0.45, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="tool-card"]', start: 'top 85%' },
      })

      // ── Guide cards ──────────────────────────────────────────────────────
      gsap.from('#guides-heading', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '#guides-heading', start: 'top 85%' },
      })
      gsap.from('[data-animate="guide-card"]', {
        opacity: 0, y: 22, duration: 0.45, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="guide-card"]', start: 'top 85%' },
      })

      // ── State selector ───────────────────────────────────────────────────
      gsap.from('[data-animate="state-section"]', {
        opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-animate="state-section"]', start: 'top 85%' },
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
