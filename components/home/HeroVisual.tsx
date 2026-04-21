'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PARTICLE_COUNT = 110
const MAX_DIST = 100
const SPEED = 0.35

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; opacity: number
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r: Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.45 + 0.25,
  }
}

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shieldRef = useRef<HTMLDivElement>(null)
  const haloRef   = useRef<HTMLDivElement>(null)
  const orbit1Ref = useRef<HTMLDivElement>(null)
  const orbit2Ref = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0, H = 0, particles: Particle[] = []

    function resize() {
      W = canvas!.width  = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H))
    }

    function renderFrame(animate: boolean) {
      ctx!.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            ctx!.beginPath()
            ctx!.strokeStyle = `rgba(40,145,199,${0.28 * (1 - dist / MAX_DIST)})`
            ctx!.lineWidth = 0.7
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(75,168,212,${p.opacity})`
        ctx!.fill()
        if (animate) {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
        }
      })
      if (animate) rafRef.current = requestAnimationFrame(() => renderFrame(true))
    }

    resize()
    renderFrame(!reduced)

    const onResize = () => { resize(); if (reduced) renderFrame(false) }
    window.addEventListener('resize', onResize)

    if (!reduced) {
      gsap.to(shieldRef.current, {
        y: -14, rotateY: 7, rotateX: -2,
        duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to(haloRef.current, {
        scale: 1.2, opacity: 1,
        duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to(orbit1Ref.current, { rotation: 360,  duration: 20, ease: 'none', repeat: -1 })
      gsap.to(orbit2Ref.current, { rotation: -360, duration: 32, ease: 'none', repeat: -1 })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf([shieldRef.current, haloRef.current, orbit1Ref.current, orbit2Ref.current])
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Vignette — keeps left copy readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 50%, transparent 40%, rgba(12,45,62,0.72) 100%)' }}
      />

      {/* Shield stage — right half, desktop only */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:flex items-center justify-center">
        {/* Glow halo */}
        <div
          ref={haloRef}
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(40,145,199,0.2) 0%, transparent 70%)',
            opacity: 0.7,
          }}
        />

        {/* Orbit ring 1 — teal, clockwise */}
        <div
          ref={orbit1Ref}
          className="absolute w-[270px] h-[270px] rounded-full border border-primary-500/[0.15]"
        >
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-primary-400"
            style={{ top: '-3px', left: 'calc(50% - 3px)', boxShadow: '0 0 8px rgba(40,145,199,0.9)' }}
          />
        </div>

        {/* Orbit ring 2 — amber, counter-clockwise */}
        <div
          ref={orbit2Ref}
          className="absolute w-[370px] h-[370px] rounded-full border border-amber-500/[0.10]"
        >
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-500"
            style={{ bottom: '-3px', left: 'calc(50% - 3px)', boxShadow: '0 0 8px rgba(224,138,46,0.9)' }}
          />
        </div>

        {/* Shield */}
        <div
          ref={shieldRef}
          className="relative z-10"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(40,145,199,0.55)) drop-shadow(0 0 80px rgba(40,145,199,0.2))',
            transformStyle: 'preserve-3d',
          }}
        >
          <svg width="200" height="240" viewBox="0 0 140 168" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="hv-sg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#4BA8D4" />
                <stop offset="55%"  stopColor="#1A5F85" />
                <stop offset="100%" stopColor="#0C2D3E" />
              </linearGradient>
              <linearGradient id="hv-sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="hv-ck" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#E08A2E" />
                <stop offset="100%" stopColor="#2AB07E" />
              </linearGradient>
              <filter id="hv-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Body */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="url(#hv-sg1)" />
            {/* Glass sheen */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="url(#hv-sg2)" />
            {/* Outer border */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="none" stroke="rgba(75,168,212,0.5)" strokeWidth="1.5" />
            {/* Inner border */}
            <path d="M70 18L24 36V76C24 103 44 128 70 136C96 128 116 103 116 76V36L70 18Z" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {/* Checkmark */}
            <path d="M46 78L62 94L94 62" stroke="url(#hv-ck)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#hv-glow)" />
          </svg>
        </div>
      </div>
    </div>
  )
}
