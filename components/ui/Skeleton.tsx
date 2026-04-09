interface Props { className?: string }

export function Skeleton({ className = '' }: Props) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />
}
