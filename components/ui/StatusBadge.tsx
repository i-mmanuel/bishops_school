interface Props { status: 'present' | 'absent' }

export default function StatusBadge({ status }: Props) {
  const isPresent = status === 'present'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wide
      ${isPresent ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container/20 text-tertiary'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-secondary' : 'bg-tertiary'}`} />
      {isPresent ? 'Present' : 'Absent'}
    </span>
  )
}
