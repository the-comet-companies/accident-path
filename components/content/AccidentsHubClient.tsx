'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AccidentType } from '@/types/accident'

const CATEGORIES = [
  {
    id: 'all',
    label: 'All',
    slugs: ['car', 'truck', 'motorcycle', 'uber-lyft', 'bicycle', 'pedestrian', 'slip-and-fall', 'dog-bite', 'premises', 'construction', 'workplace', 'traumatic-brain', 'spinal', 'wrongful-death', 'product'],
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    slugs: ['car', 'truck', 'motorcycle', 'uber-lyft', 'bicycle', 'pedestrian'],
  },
  {
    id: 'premises',
    label: 'Premises',
    slugs: ['slip-and-fall', 'dog-bite', 'premises'],
  },
  {
    id: 'workplace',
    label: 'Workplace',
    slugs: ['construction', 'workplace'],
  },
  {
    id: 'injury',
    label: 'Injury Type',
    slugs: ['traumatic-brain', 'spinal'],
  },
  {
    id: 'other',
    label: 'Other',
    slugs: ['wrongful-death', 'product'],
  },
]

const MOST_COMMON = new Set(['car', 'slip-and-fall'])

interface Props {
  accidents: AccidentType[]
}

export function AccidentsHubClient({ accidents }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const activeGroup = CATEGORIES.find(c => c.id === activeCategory)!
  const visibleAccidents = accidents.filter(a => activeGroup.slugs.includes(a.slug))

  return (
    <div className="flex flex-col sm:flex-row sm:h-[520px]">
      {/* Category rail — horizontal tabs on mobile, vertical on desktop */}
      <nav
        aria-label="Accident categories"
        className="flex flex-row sm:flex-col sm:w-44 shrink-0 bg-primary-900 overflow-x-auto sm:overflow-visible"
      >
        {CATEGORIES.map(cat => {
          const count = accidents.filter(a => cat.slugs.includes(a.slug)).length
          if (count === 0) return null
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center justify-between whitespace-nowrap sm:whitespace-normal gap-2 px-5 py-3 text-sm font-semibold text-left w-full transition-all duration-150
                border-b-2 sm:border-b-0 sm:border-l-[3px]
                ${isActive
                  ? 'text-white border-primary-500 bg-white/5'
                  : 'text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-white/[0.03]'
                }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-medium tabular-nums ${isActive ? 'text-white/50' : 'text-white/25'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Card panel */}
      <div className="flex-1 bg-surface-page p-5 lg:p-6 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
          {activeGroup.label} — {visibleAccidents.length} guide{visibleAccidents.length !== 1 ? 's' : ''}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleAccidents.map(accident => {
            const totalEvidence = accident.evidenceChecklist.reduce(
              (acc, cat) => acc + cat.items.length,
              0
            )
            return (
              <Link
                key={accident.slug}
                href={`/accidents/${accident.slug}`}
                className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col flex-1 p-4">
                  {MOST_COMMON.has(accident.slug) && (
                    <span className="inline-block self-start text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2.5 py-0.5 mb-3">
                      ★ Most Common
                    </span>
                  )}
                  <h3 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-1.5">
                    {accident.title}
                  </h3>
                  <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                    {accident.description.length > 110
                      ? accident.description.slice(0, 110) + '…'
                      : accident.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <span className="text-[10px] text-neutral-400">
                      {accident.immediateSteps.length} steps &middot; {totalEvidence} evidence items
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                      View guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
