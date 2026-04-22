'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Guide } from '@/types/content'

const CATEGORIES = [
  {
    id: 'all',
    label: 'All',
    slugs: [
      'after-car-accident',
      'after-truck-accident',
      'after-motorcycle-crash',
      'evidence-checklist',
      'insurance-claims',
      'hiring-a-lawyer',
      'understanding-medical-bills',
      'dealing-with-insurance-adjusters',
      'protecting-your-claim',
      'getting-your-police-report',
      'am-i-at-fault',
      'settlement-vs-lawsuit',
      'should-i-talk-to-a-lawyer',
    ],
  },
  {
    id: 'after-accident',
    label: 'After an Accident',
    slugs: ['after-car-accident', 'after-truck-accident', 'after-motorcycle-crash'],
  },
  {
    id: 'insurance',
    label: 'Insurance & Claims',
    slugs: ['insurance-claims', 'dealing-with-insurance-adjusters', 'protecting-your-claim'],
  },
  {
    id: 'evidence',
    label: 'Evidence & Docs',
    slugs: ['evidence-checklist', 'getting-your-police-report'],
  },
  {
    id: 'legal',
    label: 'Legal Decisions',
    slugs: ['hiring-a-lawyer', 'am-i-at-fault', 'settlement-vs-lawsuit', 'should-i-talk-to-a-lawyer'],
  },
  {
    id: 'medical',
    label: 'Medical & Bills',
    slugs: ['understanding-medical-bills'],
  },
]

const CORNERSTONE = new Set(['am-i-at-fault', 'settlement-vs-lawsuit'])

interface Props {
  guides: Guide[]
}

export function GuidesHubClient({ guides }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const activeGroup = CATEGORIES.find(c => c.id === activeCategory)!
  const visibleGuides = guides.filter(g => activeGroup.slugs.includes(g.slug))

  return (
    <div className="flex flex-col sm:flex-row sm:h-[520px]">
      {/* Category rail */}
      <nav
        aria-label="Guide categories"
        className="flex flex-row sm:flex-col sm:w-44 shrink-0 bg-primary-900 overflow-x-auto sm:overflow-visible"
      >
        {CATEGORIES.map(cat => {
          const count = guides.filter(g => cat.slugs.includes(g.slug)).length
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
          {activeGroup.label} — {visibleGuides.length} guide{visibleGuides.length !== 1 ? 's' : ''}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleGuides.map(guide => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
              <div className="flex flex-col flex-1 p-4">
                {CORNERSTONE.has(guide.slug) && (
                  <span className="inline-block self-start text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2.5 py-0.5 mb-3">
                    ★ Cornerstone Guide
                  </span>
                )}
                <h3 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-1.5">
                  {guide.title}
                </h3>
                <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                  {guide.description.length > 110
                    ? guide.description.slice(0, 110) + '…'
                    : guide.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <span className="text-[10px] text-neutral-400">
                    {guide.sections.length} sections &middot; ~{guide.sections.length * 3} min read
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                    Read guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
