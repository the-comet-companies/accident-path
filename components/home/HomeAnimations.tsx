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

      // fromTo with immediateRender:false prevents GSAP from hiding elements on
      // mount — they only become invisible right as their animation starts playing.
      // 'top bottom' fires as soon as any edge of the trigger enters the viewport.
      const reveal = (
        selector: string,
        vars: gsap.TweenVars = {},
        triggerSelector?: string,
      ) =>
        gsap.fromTo(
          selector,
          { opacity: 0, y: vars.y ?? 22 },
          {
            opacity: 1,
            y: 0,
            duration: vars.duration ?? 0.5,
            stagger: vars.stagger,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: triggerSelector ?? selector,
              start: 'top bottom',
              once: true,
            },
          },
        )

      // ── Trust row ────────────────────────────────────────────────────────
      gsap.fromTo(
        '[data-animate="trust-left"]',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.7, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="trust-left"]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-animate="trust-item"]',
        { opacity: 0, y: 36, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, ease: 'back.out(1.4)', stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="trust-item"]', start: 'top 85%', once: true },
        },
      )

      // ── How It Works ─────────────────────────────────────────────────────
      gsap.fromTo(
        '[data-animate="hiw-heading"]',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="hiw-heading"]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-animate="step-item"]',
        { opacity: 0, y: 36, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, ease: 'back.out(1.4)', stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="step-item"]', start: 'top 85%', once: true },
        },
      )

      // ── Accident cards ───────────────────────────────────────────────────
      reveal('#accident-types-heading', { y: 20 })
      reveal('[data-animate="accident-card"]', { y: 26, duration: 0.45, stagger: 0.09 })

      // ── Tool cards ───────────────────────────────────────────────────────
      reveal('#tools-heading', { y: 20 })
      reveal('[data-animate="tool-card"]', { y: 26, duration: 0.45, stagger: 0.09 })

      // ── Guide cards ──────────────────────────────────────────────────────
      reveal('#guides-heading', { y: 20 })
      reveal('[data-animate="guide-card"]', { y: 22, duration: 0.45, stagger: 0.12 })

      // ── State selector ───────────────────────────────────────────────────
      reveal('[data-animate="state-section"]', { y: 24, duration: 0.6 })

      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  return null
}
