'use client'

interface GaugeProps {
  value: number
  label: string
  size?: number
  warnAt?: number
  critAt?: number
}

export function Gauge({ value, label, size = 130, warnAt = 70, critAt = 85 }: GaugeProps) {
  const r    = size * 0.38
  const cx   = size / 2
  const cy   = size / 2
  const circ = 2 * Math.PI * r
  const arc  = circ * 0.72         // 72% of circle = 259 degrees arc
  const clamped    = Math.min(Math.max(value, 0), 100)
  const dashOffset = arc - (clamped / 100) * arc

  const color =
    clamped >= critAt  ? '#ef4444' :
    clamped >= warnAt  ? '#eab308' :
    '#22c55e'

  const trackColor = '#1e293b'
  const rot = -130   // rotation so arc starts at bottom-left

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${label}: ${clamped.toFixed(1)}%`}
      >
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={size * 0.077}
          strokeDasharray={`${arc} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
        {/* Value arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.077}
          strokeDasharray={`${arc} ${circ}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(${rot} ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
        {/* Value text */}
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={size * 0.175}
          fontWeight="700"
          fontFamily="inherit"
          style={{ transition: 'fill 0.3s ease' }}
        >
          {clamped.toFixed(1)}
        </text>
        <text
          x={cx} y={cy + size * 0.148}
          textAnchor="middle"
          fill="#64748b"
          fontSize={size * 0.082}
          fontFamily="inherit"
        >
          %
        </text>
      </svg>
      <span className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">{label}</span>
    </div>
  )
}
