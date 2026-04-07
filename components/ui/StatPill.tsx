interface Props { label: string; value: string | number; accent?: 'mint' | 'rose' | 'indigo' | 'default' }

const accentMap = {
  mint:    'text-secondary',
  rose:    'text-tertiary',
  indigo:  'text-primary',
  default: 'text-on-surface',
}

export default function StatPill({ label, value, accent = 'default' }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 bg-surface-container-high rounded-xl">
      <span className={`text-2xl font-headline font-bold ${accentMap[accent]}`}>{value}</span>
      <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">{label}</span>
    </div>
  )
}
