// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { Badge } from '@/src/components/ui/Badge'
// import { ConfidenceGauge } from '@/src/components/charts/ConfidenceGauge'
// import { cn, severityTextColor } from '@/src/lib/utils'
// import type { Prediction } from '@/src/types'

// interface Props { prediction: Prediction | null }

// const DOT: Record<string, string> = {
//   critical: 'bg-red-500',
//   warning:  'bg-yellow-500',
//   info:     'bg-emerald-500',
// }

// export function PredictionPanel({ prediction: p }: Props) {
//   const glow =
//     !p ? 'none' :
//     p.failure && p.severity === 'critical' ? 'red' :
//     p.failure ? 'yellow' :
//     'green'

//   return (
//     <Card glow={glow as 'red' | 'yellow' | 'green' | 'none'}>
//       <CardHeader>
//         <CardTitle icon="🤖">AI Health Prediction</CardTitle>
//         {p && (
//           <Badge
//             label={p.severity.toUpperCase()}
//             variant={p.severity === 'info' ? 'success' : p.severity}
//             pulse={p.failure}
//           />
//         )}
//       </CardHeader>

//       {!p ? (
//         <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
//           Awaiting first prediction…
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Confidence gauge */}
//           <ConfidenceGauge value={p.confidence} />

//           {/* Root causes */}
//           <div>
//             <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-2">
//               Root Cause Analysis
//             </p>
//             <div className="space-y-1.5">
//               {p.root_causes.map(cause => {
//                 const sev = p.cause_severities[cause] ?? 'info'
//                 return (
//                   <div key={cause} className="flex items-center gap-2.5">
//                     <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT[sev] ?? DOT.info)} />
//                     <span className={cn('text-sm font-medium', severityTextColor(sev))}>
//                       {cause}
//                     </span>
//                     <span className="ml-auto text-[10px] text-slate-600 uppercase">{sev}</span>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Explanation */}
//           <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-700/40">
//             <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1.5">
//               AI Explanation
//             </p>
//             <p className="text-sm text-slate-300 leading-relaxed">{p.explanation}</p>
//           </div>

//           {/* Per-model probabilities */}
//           {Object.keys(p.model_probas).length > 0 && (
//             <div>
//               <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-2">
//                 Model Breakdown
//               </p>
//               <div className="grid grid-cols-3 gap-2">
//                 {Object.entries(p.model_probas).map(([name, prob]) => (
//                   <div key={name} className="bg-slate-900/60 rounded-lg p-2 text-center border border-slate-700/30">
//                     <p className="text-[9px] text-slate-500 uppercase font-semibold mb-0.5">
//                       {name === 'rf' ? 'RandomForest' : name === 'gb' ? 'GradBoost' : 'LogReg'}
//                     </p>
//                     <p className="text-sm font-bold text-indigo-300 tabular-nums">
//                       {(prob * 100).toFixed(1)}%
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </Card>
//   )
// }

'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Badge }           from '@/src/components/ui/Badge'
import { ConfidenceGauge } from '@/src/components/charts/ConfidenceGauge'
import { IconPrediction }  from '@/src/components/ui/Icons'
import { cn, severityTextColor } from '@/src/lib/utils'
import type { Prediction } from '@/src/types'

interface Props { prediction: Prediction | null }

const DOT: Record<string,string> = { critical:'bg-red-500', warning:'bg-yellow-500', info:'bg-emerald-500' }

export function PredictionPanel({ prediction: p }: Props) {
  const glow = !p ? 'none' : p.failure && p.severity==='critical' ? 'red' : p.failure ? 'yellow' : 'green'
  return (
    <Card glow={glow as any}>
      <CardHeader>
        <CardTitle icon={<IconPrediction size={13} color="#8b5cf6"/>}>AI Health Prediction</CardTitle>
        {p && <Badge label={p.severity.toUpperCase()} variant={p.severity==='info'?'success':p.severity} pulse={p.failure}/>}
      </CardHeader>
      {!p ? (
        <div className="flex items-center justify-center h-32 text-sm" style={{ color:'var(--text-3)' }}>Awaiting first prediction…</div>
      ) : (
        <div className="space-y-4">
          <ConfidenceGauge value={p.confidence}/>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color:'var(--text-3)' }}>Root Cause Analysis</p>
            <div className="space-y-1.5">
              {p.root_causes.map(cause => {
                const sev = p.cause_severities[cause] ?? 'info'
                return (
                  <div key={cause} className="flex items-center gap-2.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT[sev]??DOT.info)}/>
                    <span className={cn('text-sm font-medium', severityTextColor(sev))}>{cause}</span>
                    <span className="ml-auto text-[10px] uppercase" style={{ color:'var(--text-3)' }}>{sev}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rounded-xl p-3 border" style={{ background:'rgba(15,23,42,0.5)', borderColor:'var(--border)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color:'var(--text-3)' }}>AI Explanation</p>
            <p className="text-sm leading-relaxed" style={{ color:'var(--text-1)' }}>{p.explanation}</p>
          </div>
          {Object.keys(p.model_probas).length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color:'var(--text-3)' }}>Model Breakdown</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(p.model_probas).map(([name,prob]) => (
                  <div key={name} className="rounded-lg p-2 text-center border" style={{ background:'var(--bg-card-2)', borderColor:'var(--border)' }}>
                    <p className="text-[9px] font-semibold mb-0.5 uppercase" style={{ color:'var(--text-3)' }}>
                      {name==='rf'?'RandomForest':name==='gb'?'GradBoost':'LogReg'}
                    </p>
                    <p className="text-sm font-bold tabular-nums text-indigo-300">{(prob*100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}