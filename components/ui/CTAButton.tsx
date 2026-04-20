import Link from 'next/link'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

interface CTAButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[44px] min-w-[44px]',
  md: 'px-6 py-3 text-base min-h-[44px] min-w-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px] min-w-[44px]',
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white font-semibold hover:bg-primary-600 active:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'border-2 border-primary-500 text-primary-600 bg-transparent font-semibold hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
}

const base =
  'inline-flex items-center justify-center rounded-lg font-sans transition-colors duration-150 cursor-pointer'

export function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
}: CTAButtonProps) {
  const classes = [
    base,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
