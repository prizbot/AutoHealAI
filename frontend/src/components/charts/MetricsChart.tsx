'use client'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts'
import type { Metrics } from '@/src/types'
import { fmtTime } from '@/src/lib/utils'

interface ChartKey {
  key: keyof Metrics
  color: string
  label: string
  refLine?: number
}

interface Props {
  data: Metrics[]
  keys: ChartKey[]
  title: string
  height?: number
  domain?: [number | 'auto', number | 'auto']
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-2xl min-w-[120px]">
      <p className="text-slate-400 mb-1.5 font-mono">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }}/>
            <span className="text-slate-300">{p.name}</span>
          </div>
          <span className="font-bold tabular-nums" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MetricsChart({ data, keys, title, height = 140, domain }: Props) {
  const chartData = data.map(m => {
    const point: Record<string, string | number> = { t: fmtTime(m.timestamp) }
    keys.forEach(k => { point[k.label] = m[k.key] as number })
    return point
  })

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">{title}</p>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {keys.map(k => (
              <linearGradient key={String(k.key)} id={`grad-${String(k.key)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={k.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={k.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.4)" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fill: '#475569', fontSize: 9, fontFamily: 'inherit' }}
            tickLine={false} axisLine={false}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis
            domain={domain}
            tick={{ fill: '#475569', fontSize: 9, fontFamily: 'inherit' }}
            tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {keys.map(k => (
            k.refLine !== undefined && (
              <ReferenceLine key={`ref-${String(k.key)}`} y={k.refLine}
                stroke={k.color} strokeDasharray="4 3" strokeOpacity={0.5}
                strokeWidth={1} />
            )
          ))}
          {keys.map(k => (
            <Area
              key={String(k.key)}
              type="monotone"
              dataKey={k.label}
              stroke={k.color}
              strokeWidth={1.8}
              fill={`url(#grad-${String(k.key)})`}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
