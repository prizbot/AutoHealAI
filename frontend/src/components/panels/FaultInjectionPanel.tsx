'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { cn } from '@/src/lib/utils'

interface Props {
  onInject:   (fault: string, intensity: number) => void
  onClear:    () => void
  demoActive: boolean
  demoFault:  string | null
}

const FAULTS = [
  { id: 'cpu_spike',     label: 'CPU Spike',       icon: '🔥', desc: 'CPU +30-55%, latency spikes',      color: '#ef4444' },
  { id: 'memory_leak',   label: 'Memory Leak',     icon: '💧', desc: 'Memory grows gradually to 90%+',   color: '#a78bfa' },
  { id: 'traffic_burst', label: 'Traffic Burst',   icon: '⚡', desc: 'Requests +160-320 req/s',           color: '#f59e0b' },
  { id: 'crash_loop',    label: 'Crash Loop',      icon: '💥', desc: 'Pod restarts 3-5 times',            color: '#fb923c' },
  { id: 'combined',      label: 'Combined Stress', icon: '☢️', desc: 'All faults simultaneously',         color: '#f43f5e' },
]

export function FaultInjectionPanel({ onInject, onClear, demoActive, demoFault }: Props) {
  const [intensity, setIntensity] = useState(85)

  return (
    <Card>
      <CardHeader>
        <CardTitle icon="🎮">Demo Fault Injection</CardTitle>
        <span
          className={cn('text-[10px] px-2.5 py-1 rounded-full border font-bold tracking-wider', demoActive && 'animate-blink')}
          style={demoActive
            ? { background: 'rgba(239,68,68,0.15)', color: '#f87171', borderColor: 'rgba(239,68,68,0.4)' }
            : { background: 'var(--bg-card-2)', color: 'var(--text-3)', borderColor: 'var(--border)' }}
        >
          {demoActive ? `● ${(demoFault ?? '').replace(/_/g, ' ').toUpperCase()}` : '○ NO FAULT ACTIVE'}
        </span>
      </CardHeader>

      {/* Safety note */}
      <div className="mb-4 px-3 py-2.5 rounded-xl text-[11px] leading-relaxed"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', color: 'rgba(165,180,252,0.9)' }}>
        🛡 <strong>Safe demo mode</strong> — overlays only the AI prediction engine.
        Real metrics in the database and ring buffer are never modified.
      </div>

      {/* Severity slider */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1.5 font-semibold"
          style={{ color: 'var(--text-2)' }}>
          <span className="uppercase tracking-wider">Severity</span>
          <span style={{ color: 'var(--text-1)' }}>{intensity}%</span>
        </div>
        <input type="range" min={20} max={100} step={5} value={intensity}
          onChange={e => setIntensity(Number(e.target.value))}
          className="w-full accent-indigo-500" style={{ cursor: 'pointer' }}/>
        <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-3)' }}>
          <span>Mild</span><span>Moderate</span><span>Extreme</span>
        </div>
      </div>

      {/* ── Fault buttons — SINGLE COLUMN, full width ─────────────────
          Previously 2-col grid; the right-column buttons (memory_leak,
          crash_loop) were blocked by the fixed chat orb sitting over them.
          Single-column layout guarantees every button spans the full width
          and nothing in the layout can be obscured by the orb.
      ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 mb-3">
        {FAULTS.map(f => {
          const isActive = demoFault === f.id && demoActive
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onInject(f.id, intensity / 100)}
              style={{
                display:       'flex',
                alignItems:    'center',
                gap:           '10px',
                width:         '100%',
                padding:       '10px 14px',
                borderRadius:  '12px',
                border:        `1px solid ${isActive ? f.color : f.color + '44'}`,
                background:    isActive ? f.color + '25' : f.color + '0f',
                cursor:        'pointer',
                outline:       isActive ? `2px solid ${f.color}` : 'none',
                outlineOffset: '1px',
                transition:    'all 0.15s ease',
                userSelect:    'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = f.color + '22' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? f.color + '25' : f.color + '0f' }}
              onMouseDown={e =>  { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e =>    { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{f.icon}</span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: f.color, lineHeight: 1.2 }}>{f.label}</p>
                <p style={{ fontSize: '10px', color: f.color, opacity: 0.7, marginTop: '2px' }}>{f.desc}</p>
              </div>
              {isActive && (
                <span style={{
                  fontSize: '9px', fontWeight: 900, color: f.color,
                  animation: 'blink 1.4s ease-in-out infinite', flexShrink: 0,
                }}>ACTIVE</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Clear button */}
      <button
        type="button"
        onClick={onClear}
        style={{
          width:        '100%',
          padding:      '10px',
          borderRadius: '12px',
          border:       `1px solid ${demoActive ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`,
          background:   demoActive ? 'rgba(34,197,94,0.1)' : 'var(--bg-card-2)',
          color:        demoActive ? '#4ade80' : 'var(--text-3)',
          fontSize:     '13px',
          fontWeight:   600,
          cursor:       demoActive ? 'pointer' : 'default',
          opacity:      demoActive ? 1 : 0.5,
          transition:   'all 0.15s ease',
        }}
      >
        ✓ Clear Fault — Return to Normal
      </button>

      {demoActive && (
        <p className="text-[9px] text-center mt-2" style={{ color: 'var(--text-3)' }}>
          Prediction reflects injected fault · Charts and DB show real data
        </p>
      )}
    </Card>
  )
}