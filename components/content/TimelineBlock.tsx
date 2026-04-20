import { AlertTriangle, ArrowRight } from 'lucide-react'

interface TimelineItem {
  period: string
  risk: string
  action: string
}

interface TimelineBlockProps {
  items: TimelineItem[]
}

export function TimelineBlock({ items }: TimelineBlockProps) {
  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div
        className="absolute left-4 top-10 bottom-10 w-0.5 bg-neutral-200"
        aria-hidden="true"
      />

      <ol className="flex flex-col gap-5">
        {items.map((item, index) => (
          <li key={index} className="relative flex gap-5">
            {/* Step dot */}
            <div className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-sans">{index + 1}</span>
            </div>

            {/* Content card */}
            <div className="flex-1 pb-1">
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
                  {item.period}
                </p>
                <div className="flex items-start gap-2 mb-2.5">
                  <AlertTriangle
                    className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-neutral-950 leading-snug">
                    {item.risk}
                  </p>
                </div>
                <div className="flex items-start gap-2 pl-6">
                  <ArrowRight
                    className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.action}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
