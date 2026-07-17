'use client'

interface Props { value: number }

export function ConfidenceGauge({ value }: Props) {
  const clamped = Math.min(Math.max(value, 0), 100)
  const color =
    clamped >= 80 ? '#ef4444' :
    clamped >= 60 ? '#eab308' :
    '#22c55e'
  const label =
    clamped >= 80 ? 'HIGH RISK' :
    clamped >= 60 ? 'ELEVATED'  :
    'LOW RISK'

  const bgGrad =
    clamped >= 80
      ? 'from-red-500/0 via-red-500/10 to-red-500/0'
      : clamped >= 60
      ? 'from-yellow-500/0 via-yellow-500/8 to-yellow-500/0'
      : 'from-emerald-500/0 via-emerald-500/8 to-emerald-500/0'

  return (
    <div className={`space-y-3 p-4 rounded-xl bg-gradient-to-r ${bgGrad} border border-slate-700/40`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          Failure Confidence
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tabular-nums" style={{ color }}>
            {clamped.toFixed(1)}%
          </span>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}50`, background: `${color}18` }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-yellow-500/70 z-10"
          style={{ left: '60%' }}
        />
        {/* Fill */}
        <div
          className="h-full rounded-full"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Axis labels */}
      <div className="flex justify-between text-[9px] text-slate-600 font-mono">
        <span>0%</span>
        <span className="text-yellow-600">60% threshold</span>
        <span>100%</span>
      </div>

      {/* Model breakdown */}
      <div className="flex items-center gap-2 text-[9px] text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"/>
        RF · GB · LR weighted ensemble
        <span className="ml-auto text-slate-600 font-mono">w=[0.4, 0.4, 0.2]</span>
      </div>
    </div>
  )
}
