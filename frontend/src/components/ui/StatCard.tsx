import { cn } from '@/src/lib/utils'

interface Props {
  label: string; value: string|number; unit?: string
  color?: string; icon?: string; subtext?: string
}

export function StatCard({ label, value, unit = '', color, icon, subtext }: Props) {
  return (
    <div className="rounded-xl p-3 flex flex-col gap-1 transition-colors"
      style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-sm leading-none">{icon}</span>}
        <span className="text-[10px] font-semibold uppercase tracking-wider truncate"
          style={{ color: 'var(--text-3)' }}>{label}</span>
      </div>
      <div className={cn('text-xl font-bold tabular-nums leading-tight', color)}
        style={!color ? { color: 'var(--text-1)' } : {}}>
        {value}
        {unit && <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-3)' }}>{unit}</span>}
      </div>
      {subtext && <p className="text-[10px] truncate" style={{ color: 'var(--text-3)' }}>{subtext}</p>}
    </div>
  )
}