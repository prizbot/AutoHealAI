// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import type { Prediction } from '@/src/types'

// interface Props { prediction: Prediction | null }

// const MODELS = [
//   { key: 'rf', name: 'RandomForest',       role: 'Non-linear patterns & interactions', weight: 0.40, color: '#6366f1' },
//   { key: 'gb', name: 'GradientBoosting',   role: 'Sequential temporal dependencies',   weight: 0.40, color: '#22d3ee' },
//   { key: 'lr', name: 'LogisticRegression', role: 'Linear boundary regularisation',     weight: 0.20, color: '#f59e0b' },
// ]

// export function ModelInfoPanel({ prediction: p }: Props) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="🧠">ML Ensemble Details</CardTitle>
//         <span className="text-[10px] text-slate-500">3-model weighted vote</span>
//       </CardHeader>

//       {/* Model rows */}
//       <div className="space-y-3 mb-4">
//         {MODELS.map(m => {
//           const prob = p?.model_probas?.[m.key] ?? null
//           const pct  = prob !== null ? (prob * 100).toFixed(1) : '—'
//           const bar  = prob !== null ? prob * 100 : 0
//           return (
//             <div key={m.key}>
//               <div className="flex items-center justify-between mb-1">
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
//                   <span className="text-xs font-semibold text-slate-300">{m.name}</span>
//                   <span className="text-[9px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded">
//                     w={m.weight.toFixed(2)}
//                   </span>
//                 </div>
//                 <span className="text-xs font-bold tabular-nums" style={{ color: m.color }}>{pct}%</span>
//               </div>
//               <p className="text-[10px] text-slate-600 mb-1 ml-4">{m.role}</p>
//               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
//                 <div
//                   className="h-full rounded-full transition-all duration-700"
//                   style={{ width: `${bar}%`, background: m.color, opacity: 0.7 }}
//                 />
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Feature importances */}
//       {p?.top_features && p.top_features.length > 0 && (
//         <div className="border-t border-slate-800 pt-4">
//           <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-3">
//             Top Feature Drivers (RandomForest)
//           </p>
//           <div className="space-y-2">
//             {p.top_features.slice(0, 6).map((feat, i) => {
//               const widths = [100, 82, 67, 54, 43, 34]
//               return (
//                 <div key={feat} className="flex items-center gap-2">
//                   <span className="text-[9px] text-slate-600 w-4 text-right tabular-nums">{i + 1}.</span>
//                   <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-indigo-500/70 rounded-full transition-all duration-500"
//                       style={{ width: `${widths[i] ?? 20}%` }}
//                     />
//                   </div>
//                   <span className="text-[10px] text-slate-400 font-mono w-28 truncate">{feat}</span>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}

//       {/* Architecture note */}
//       <div className="mt-4 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
//         <p className="text-[9px] text-slate-600 leading-relaxed text-center">
//           Features: 5 raw + 5 rolling-mean + 5 trend = 15 total<br />
//           Training: 7,000 synthetic rows · 5-fold stratified CV · StandardScaler
//         </p>
//       </div>
//     </Card>
//   )
// }


'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { IconModel } from '@/src/components/ui/Icons'
import type { Prediction } from '@/src/types'

interface Props { prediction: Prediction | null }

const MODELS = [
  { key:'rf', name:'RandomForest',       role:'Non-linear patterns',      weight:0.40, color:'#6366f1' },
  { key:'gb', name:'GradientBoosting',   role:'Sequential dependencies',  weight:0.40, color:'#22d3ee' },
  { key:'lr', name:'LogisticRegression', role:'Linear regularisation',    weight:0.20, color:'#f59e0b' },
]

export function ModelInfoPanel({ prediction: p }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconModel size={13} color="#0f766e"/>}>ML Ensemble</CardTitle>
        <span className="text-[10px]" style={{ color:'var(--text-3)' }}>3-model weighted vote</span>
      </CardHeader>
      <div className="space-y-3 mb-4">
        {MODELS.map(m => {
          const prob = p?.model_probas?.[m.key] ?? null
          const pct  = prob !== null ? (prob * 100).toFixed(1) : '—'
          const bar  = prob !== null ? prob * 100 : 0
          return (
            <div key={m.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:m.color }}/>
                  <span className="text-xs font-semibold" style={{ color:'var(--text-1)' }}>{m.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background:'var(--bg-card-2)', color:'var(--text-3)', border:'1px solid var(--border)' }}>
                    w={m.weight.toFixed(2)}
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color:m.color }}>{pct}%</span>
              </div>
              <p className="text-[10px] mb-1 ml-4" style={{ color:'var(--text-3)' }}>{m.role}</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background:'var(--bg-card-2)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width:`${bar}%`, background:m.color, opacity:0.7 }}/>
              </div>
            </div>
          )
        })}
      </div>
      {p?.top_features && p.top_features.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor:'var(--border)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color:'var(--text-3)' }}>
            Top Feature Drivers
          </p>
          <div className="space-y-2">
            {p.top_features.slice(0,6).map((feat,i) => {
              const widths=[100,82,67,54,43,34]
              return (
                <div key={feat} className="flex items-center gap-2">
                  <span className="text-[9px] w-4 text-right tabular-nums" style={{ color:'var(--text-3)' }}>{i+1}.</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg-card-2)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width:`${widths[i]??20}%`, background:'rgba(99,102,241,0.7)' }}/>
                  </div>
                  <span className="text-[10px] font-mono w-28 truncate" style={{ color:'var(--text-2)' }}>{feat}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="mt-4 p-2.5 rounded-xl border text-center" style={{ background:'var(--bg-card-2)', borderColor:'var(--border)' }}>
        <p className="text-[9px] leading-relaxed" style={{ color:'var(--text-3)' }}>
          15 features · 7k training rows · 5-fold CV · StandardScaler
        </p>
      </div>
    </Card>
  )
}