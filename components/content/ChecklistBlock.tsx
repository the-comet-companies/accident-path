'use client'

import { useState } from 'react'

type Priority = 'critical' | 'important' | 'helpful'

interface ChecklistCategory {
  category: string
  items: string[]
  priority: Priority
}

interface ChecklistBlockProps {
  items: ChecklistCategory[]
}

const priorityConfig: Record<Priority, {
  label: string
  bg: string
  border: string
  badge: string
}> = {
  critical: {
    label: 'Critical',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
  },
  important: {
    label: 'Important',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  helpful: {
    label: 'Helpful',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    badge: 'bg-primary-100 text-primary-700',
  },
}

export function ChecklistBlock({ items }: ChecklistBlockProps) {
  const allKeys = items.flatMap(cat =>
    cat.items.map((_, i) => `${cat.category}::${i}`)
  )
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const progress =
    allKeys.length > 0 ? Math.round((checked.size / allKeys.length) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Checklist progress: ${checked.size} of ${allKeys.length} items collected`}
          />
        </div>
        <span className="text-sm font-medium text-neutral-600 whitespace-nowrap tabular-nums">
          {checked.size} / {allKeys.length} collected
        </span>
      </div>

      {/* Categories */}
      {items.map(cat => {
        const config = priorityConfig[cat.priority]
        return (
          <div
            key={cat.category}
            className={`rounded-xl border p-5 ${config.bg} ${config.border}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                {cat.category}
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                {config.label}
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {cat.items.map((item, i) => {
                const key = `${cat.category}::${i}`
                const isChecked = checked.has(key)
                return (
                  <li key={key}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                        className="mt-0.5 w-4 h-4 rounded shrink-0 accent-primary-600"
                      />
                      <span
                        className={`text-sm leading-snug transition-colors ${
                          isChecked ? 'line-through text-neutral-400' : 'text-neutral-700'
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
