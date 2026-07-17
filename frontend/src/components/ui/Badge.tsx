import { cn, severityBg } from '@/src/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'critical' | 'warning' | 'info' | 'success' | 'default'
  className?: string
  pulse?: boolean
}

export function Badge({ label, variant = 'default', className, pulse }: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border'
  const varCls: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-300 border-red-500/40',
    warning:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    info:     'bg-blue-500/20 text-blue-300 border-blue-500/40',
    success:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    default:  'bg-slate-700/60 text-slate-300 border-slate-600/50',
  }

  return (
    <span className={cn(base, varCls[variant] ?? varCls.default, className)}>
      {pulse && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full animate-blink',
          variant === 'critical' ? 'bg-red-400' :
          variant === 'warning'  ? 'bg-yellow-400' :
          variant === 'success'  ? 'bg-emerald-400' : 'bg-blue-400'
        )}/>
      )}
      {label}
    </span>
  )
}
