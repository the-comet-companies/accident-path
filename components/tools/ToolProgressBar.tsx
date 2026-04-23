interface ToolProgressBarProps {
  current: number
  total: number
}

export function ToolProgressBar({ current, total }: ToolProgressBarProps) {
  const pct = Math.round((current / total) * 100)
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      <div className="flex justify-between text-xs text-neutral-500 mb-2 font-sans">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
