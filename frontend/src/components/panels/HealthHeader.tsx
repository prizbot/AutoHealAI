'use client'
import { cn } from '@/src/lib/utils'
import type { Prediction } from '@/src/types'

interface Props {
  prediction: Prediction | null
  connected: boolean
  modelReady: boolean
  lastUpdate: string
}

export function HealthHeader({ prediction, connected, modelReady, lastUpdate }: Props) {
  const failure  = prediction?.failure
  const severity = prediction?.severity ?? 'info'

  const statusText =
    !connected    ? 'CONNECTING TO BACKEND…' :
    !modelReady   ? 'MODEL NOT READY — run train.py' :
    !prediction   ? 'INITIALISING…' :
    failure       ? prediction.status :
    'SYSTEM HEALTHY'

  const borderCls =
    !connected || !modelReady
      ? 'border-slate-700/50 bg-slate-900/60'
      : failure && severity === 'critical'
      ? 'border-red-500/50 bg-red-950/20 glow-red'
      : failure
      ? 'border-yellow-500/50 bg-yellow-950/15 glow-yellow'
      : 'border-emerald-500/40 bg-emerald-950/15 glow-green'

  const dotCls =
    !connected
      ? 'bg-slate-500'
      : failure && severity === 'critical'
      ? 'bg-red-500 animate-blink'
      : failure
      ? 'bg-yellow-500 animate-blink'
      : 'bg-emerald-500 animate-pulse2'

  const textCls =
    !connected || !modelReady
      ? 'text-slate-400'
      : failure && severity === 'critical'
      ? 'text-red-300'
      : failure
      ? 'text-yellow-300'
      : 'text-emerald-300'

  const conf = prediction?.confidence ?? 0

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border p-5 mb-5 transition-all duration-500',
      borderCls,
    )}>
      {/* Subtle grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        {/* Left: status */}
        <div className="flex items-center gap-4">
          <div className={cn('w-3.5 h-3.5 rounded-full flex-shrink-0', dotCls)} />
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', textCls)}>
              {statusText}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              AutoHealAI AIOps Platform · v2.0 ·
              <span className={cn('ml-1', connected ? 'text-emerald-500' : 'text-red-500')}>
                {connected ? 'backend connected' : 'backend offline'}
              </span>
            </p>
          </div>
        </div>

        {/* Right: stats row */}
        <div className="flex items-center gap-4 flex-wrap">
          {prediction && (
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Confidence</p>
              <p className={cn('text-xl font-bold tabular-nums', textCls)}>{conf.toFixed(1)}%</p>
            </div>
          )}
          {prediction && (
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Severity</p>
              <p className={cn('text-xl font-bold uppercase', textCls)}>{severity}</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Updated</p>
            <p className="text-sm font-mono text-slate-300">{lastUpdate || '—'}</p>
          </div>
          {!modelReady && connected && (
            <div className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-semibold">
              ⚠ Run: python ml_models/train.py
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
