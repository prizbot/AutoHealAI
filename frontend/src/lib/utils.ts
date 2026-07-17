export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
  } catch {
    return '--:--:--'
  }
}

export function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
  } catch {
    return '—'
  }
}

export function metricColor(value: number, warnAt: number, critAt: number): string {
  if (value >= critAt)  return 'text-red-400'
  if (value >= warnAt)  return 'text-yellow-400'
  return 'text-emerald-400'
}

export function severityTextColor(s: string): string {
  if (s === 'critical') return 'text-red-400'
  if (s === 'warning')  return 'text-yellow-400'
  return 'text-emerald-400'
}

export function severityBg(s: string): string {
  if (s === 'critical') return 'bg-red-500/15 border-red-500/35 text-red-300'
  if (s === 'warning')  return 'bg-yellow-500/15 border-yellow-500/35 text-yellow-300'
  return 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
}

export function priorityBadgeCls(p: string): string {
  const map: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-300 border-red-500/40',
    high:     'bg-orange-500/20 text-orange-300 border-orange-500/40',
    medium:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    low:      'bg-blue-500/20 text-blue-300 border-blue-500/40',
    none:     'bg-slate-500/20 text-slate-400 border-slate-600/40',
  }
  return map[p] ?? map.none
}
