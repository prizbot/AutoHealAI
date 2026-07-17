// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { cn } from '@/src/lib/utils'
// import type { ShapData } from '@/src/types'

// interface Props { shap: ShapData | null; confidence: number }

// function featureLabel(raw: string): string {
//   return raw
//     .replace(/_roll$/, ' (rolling avg)')
//     .replace(/_trend$/, ' (trend)')
//     .replace(/_/g, ' ')
//     .replace(/\b\w/g, c => c.toUpperCase())
// }

// export function ShapPanel({ shap, confidence }: Props) {
//   if (!shap || !shap.available) {
//     return (
//       <Card>
//         <CardHeader><CardTitle icon="🔬">SHAP Feature Attribution</CardTitle></CardHeader>
//         <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
//           <p className="text-sm" style={{ color: 'var(--text-3)' }}>
//             {!shap ? 'Awaiting prediction…' : 'SHAP not available.'}
//           </p>
//           {shap && !shap.available && (
//             <>
//               <code className="text-xs px-3 py-1.5 rounded-lg border"
//                 style={{ background: 'var(--bg-card-2)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>
//                 pip install shap
//               </code>
//               <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>then restart the backend</p>
//             </>
//           )}
//         </div>
//       </Card>
//     )
//   }

//   const vals = shap.values
//   if (!vals.length) {
//     return (
//       <Card>
//         <CardHeader><CardTitle icon="🔬">SHAP Feature Attribution</CardTitle></CardHeader>
//         <p className="text-sm text-center" style={{ color: 'var(--text-3)' }}>No SHAP values yet…</p>
//       </Card>
//     )
//   }

//   // ── Aggregate totals for the waterfall summary bar ──────────────────────
//   const totalPos = vals.filter(v => v.direction === 'positive').reduce((s, v) => s + Math.abs(v.value), 0)
//   const totalNeg = vals.filter(v => v.direction === 'negative').reduce((s, v) => s + Math.abs(v.value), 0)
//   const totalAbs = totalPos + totalNeg || 1

//   const baseValue  = shap.base_value ?? 0
//   // Display the base value as a percentage (it's in probability space 0-1)
//   const basePct    = (baseValue * 100).toFixed(1)

//   // Max absolute SHAP value — used to size bars so the biggest bar = 100% width
//   const maxAbs = Math.max(...vals.map(v => Math.abs(v.value)), 0.0001)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="🔬">SHAP Feature Attribution</CardTitle>
//         <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>
//           base {basePct}% → {confidence.toFixed(1)}%
//         </span>
//       </CardHeader>

//       {/* ── What is SHAP — one-liner ───────────────────────────────────── */}
//       <p className="text-[10px] mb-3 leading-relaxed" style={{ color: 'var(--text-3)' }}>
//         Each bar shows how much that feature <span className="text-red-400 font-semibold">pushed toward failure</span> or{' '}
//         <span className="text-emerald-400 font-semibold">away from failure</span> for this prediction.
//         Longer bar = bigger influence.
//       </p>

//       {/* ── Waterfall summary bar ─────────────────────────────────────── */}
//       <div className="mb-4 p-3 rounded-xl border" style={{ background: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
//         <div className="flex justify-between text-[9px] mb-1.5 font-semibold uppercase tracking-wider">
//           <span className="text-red-400">← Toward failure</span>
//           <span className="text-emerald-400">Toward healthy →</span>
//         </div>
//         <div className="flex h-4 rounded-full overflow-hidden gap-px">
//           {/* Positive (toward failure) — red, grows from center-left */}
//           <div
//             className="flex items-center justify-end pr-1.5 transition-all duration-700 rounded-l-full"
//             style={{
//               width: `${Math.max(4, (totalPos / totalAbs) * 100).toFixed(1)}%`,
//               background: 'linear-gradient(90deg, #dc262688, #ef4444)',
//             }}>
//             {totalPos > 0.01 && (
//               <span className="text-[9px] text-white font-bold">
//                 +{(totalPos * 100).toFixed(1)}%
//               </span>
//             )}
//           </div>
//           {/* Negative (toward healthy) — green, grows from center-right */}
//           <div
//             className="flex items-center justify-start pl-1.5 transition-all duration-700 rounded-r-full"
//             style={{
//               width: `${Math.max(4, (totalNeg / totalAbs) * 100).toFixed(1)}%`,
//               background: 'linear-gradient(90deg, #10b981, #059669aa)',
//             }}>
//             {totalNeg > 0.01 && (
//               <span className="text-[9px] text-white font-bold">
//                 -{(totalNeg * 100).toFixed(1)}%
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex justify-between text-[9px] mt-1.5" style={{ color: 'var(--text-3)' }}>
//           <span>Total push toward failure: <strong className="text-red-400">+{(totalPos*100).toFixed(2)}%</strong></span>
//           <span>Base: <strong>{basePct}%</strong></span>
//           <span>Final: <strong>{confidence.toFixed(1)}%</strong></span>
//         </div>
//       </div>

//       {/* ── Per-feature rows ──────────────────────────────────────────── */}
//       <div className="space-y-2">
//         {vals.slice(0, 8).map((v, i) => {
//           const isPos   = v.direction === 'positive'
//           const barW    = Math.max(2, (Math.abs(v.value) / maxAbs) * 100)
//           // Display value as percentage contribution
//           const dispVal = (v.value * 100).toFixed(2)

//           return (
//             <div key={v.feature} className="animate-fadeUp" style={{ animationDelay: `${i * 30}ms` }}>
//               {/* Feature name + value */}
//               <div className="flex items-center justify-between mb-0.5">
//                 <div className="flex items-center gap-1.5">
//                   <span
//                     className="w-2 h-2 rounded-full flex-shrink-0"
//                     style={{ background: isPos ? '#ef4444' : '#10b981' }}
//                   />
//                   <span className="text-[11px] font-medium truncate max-w-[200px]"
//                     style={{ color: 'var(--text-1)' }}>
//                     {featureLabel(v.feature)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   {/* Raw contribution display */}
//                   <span className={cn(
//                     'text-[10px] font-bold font-mono tabular-nums',
//                     isPos ? 'text-red-400' : 'text-emerald-400',
//                   )}>
//                     {isPos ? '+' : ''}{dispVal}%
//                   </span>
//                   {/* Rank badge */}
//                   {i < 3 && (
//                     <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
//                       style={{
//                         background: i === 0 ? '#fef9c3' : i === 1 ? '#f1f5f9' : '#f1f5f9',
//                         color:      i === 0 ? '#92400e' : '#64748b',
//                       }}>
//                       #{i + 1}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Horizontal bar — aligned to center (like a real waterfall) */}
//               <div className="relative h-2 rounded-full overflow-hidden"
//                 style={{ background: 'var(--bg-card-2)' }}>
//                 {isPos ? (
//                   /* Red bar grows from the left */
//                   <div
//                     className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
//                     style={{
//                       width: `${barW}%`,
//                       background: `linear-gradient(90deg, #dc262644, #ef4444)`,
//                     }}
//                   />
//                 ) : (
//                   /* Green bar grows from the right */
//                   <div
//                     className="absolute right-0 top-0 h-full rounded-full transition-all duration-700"
//                     style={{
//                       width: `${barW}%`,
//                       background: `linear-gradient(270deg, #05966944, #10b981)`,
//                     }}
//                   />
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ── Legend ────────────────────────────────────────────────────── */}
//       <div className="mt-4 pt-3 flex justify-between text-[9px] border-t"
//         style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
//         <span className="flex items-center gap-1.5">
//           <span className="w-2 h-2 rounded-sm" style={{ background: '#ef4444' }}/>
//           Positive SHAP → increases failure probability
//         </span>
//         <span className="flex items-center gap-1.5">
//           <span className="w-2 h-2 rounded-sm" style={{ background: '#10b981' }}/>
//           Negative → decreases failure probability
//         </span>
//       </div>
//     </Card>
//   )
// }

'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { IconShap } from '@/src/components/ui/Icons'
import { cn } from '@/src/lib/utils'
import type { ShapData } from '@/src/types'

interface Props { shap: ShapData | null; confidence: number }

function featureLabel(raw: string): string {
  return raw.replace(/_roll$/,' (avg)').replace(/_trend$/,' (trend)').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
}

export function ShapPanel({ shap, confidence }: Props) {
  if (!shap || !shap.available) {
    return (
      <Card>
        <CardHeader><CardTitle icon={<IconShap size={13} color="#7c3aed"/>}>SHAP Feature Attribution</CardTitle></CardHeader>
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
          <p className="text-sm" style={{ color:'var(--text-3)' }}>{!shap?'Awaiting prediction…':'SHAP not available.'}</p>
          {shap && !shap.available && (
            <code className="text-xs px-3 py-1.5 rounded-lg border"
              style={{ background:'var(--bg-card-2)', color:'var(--text-2)', borderColor:'var(--border)' }}>
              pip install shap
            </code>
          )}
        </div>
      </Card>
    )
  }
  const vals     = shap.values
  const totalPos = vals.filter(v=>v.direction==='positive').reduce((s,v)=>s+Math.abs(v.value),0)
  const totalNeg = vals.filter(v=>v.direction==='negative').reduce((s,v)=>s+Math.abs(v.value),0)
  const totalAbs = totalPos + totalNeg || 1
  const maxAbs   = Math.max(...vals.map(v=>Math.abs(v.value)),0.0001)
  const basePct  = ((shap.base_value??0)*100).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconShap size={13} color="#7c3aed"/>}>SHAP Feature Attribution</CardTitle>
        <span className="text-[10px] font-mono" style={{ color:'var(--text-3)' }}>base {basePct}% → {confidence.toFixed(1)}%</span>
      </CardHeader>
      <p className="text-[10px] mb-3 leading-relaxed" style={{ color:'var(--text-3)' }}>
        Each bar shows how much a feature <span style={{ color:'#f87171', fontWeight:600 }}>pushed toward failure</span> or{' '}
        <span style={{ color:'#4ade80', fontWeight:600 }}>away from failure</span> for this prediction.
      </p>
      {/* Summary bar */}
      <div className="mb-4 p-3 rounded-xl border" style={{ background:'var(--bg-card-2)', borderColor:'var(--border)' }}>
        <div className="flex justify-between text-[9px] mb-1.5 font-semibold uppercase tracking-wider">
          <span style={{ color:'#f87171' }}>← Toward failure</span>
          <span style={{ color:'#4ade80' }}>Toward healthy →</span>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden gap-px">
          <div className="flex items-center justify-end pr-1.5 rounded-l-full transition-all duration-700"
            style={{ width:`${Math.max(4,(totalPos/totalAbs)*100).toFixed(1)}%`, background:'linear-gradient(90deg,#dc262688,#ef4444)' }}>
            {totalPos>0.01 && <span className="text-[9px] text-white font-bold">+{(totalPos*100).toFixed(1)}%</span>}
          </div>
          <div className="flex items-center justify-start pl-1.5 rounded-r-full transition-all duration-700"
            style={{ width:`${Math.max(4,(totalNeg/totalAbs)*100).toFixed(1)}%`, background:'linear-gradient(90deg,#10b981,#059669aa)' }}>
            {totalNeg>0.01 && <span className="text-[9px] text-white font-bold">-{(totalNeg*100).toFixed(1)}%</span>}
          </div>
        </div>
        <div className="flex justify-between text-[9px] mt-1.5" style={{ color:'var(--text-3)' }}>
          <span>Push toward failure: <strong style={{ color:'#f87171' }}>+{(totalPos*100).toFixed(2)}%</strong></span>
          <span>Base: <strong>{basePct}%</strong></span>
          <span>Final: <strong>{confidence.toFixed(1)}%</strong></span>
        </div>
      </div>
      {/* Feature rows */}
      <div className="space-y-2">
        {vals.slice(0,8).map((v,i) => {
          const isPos = v.direction==='positive'
          const barW  = Math.max(2,(Math.abs(v.value)/maxAbs)*100)
          const disp  = (v.value*100).toFixed(2)
          return (
            <div key={v.feature} className="animate-fadeUp" style={{ animationDelay:`${i*30}ms` }}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:isPos?'#ef4444':'#10b981' }}/>
                  <span className="text-[11px] font-medium truncate max-w-[200px]" style={{ color:'var(--text-1)' }}>
                    {featureLabel(v.feature)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('text-[10px] font-bold font-mono tabular-nums', isPos?'text-red-400':'text-emerald-400')}>
                    {isPos?'+':''}{disp}%
                  </span>
                  {i<3 && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background:i===0?'#fef9c3':'var(--bg-card-2)', color:i===0?'#92400e':'var(--text-3)' }}>
                      #{i+1}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg-card-2)' }}>
                {isPos
                  ? <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                      style={{ width:`${barW}%`, background:'linear-gradient(90deg,#dc262644,#ef4444)' }}/>
                  : <div className="absolute right-0 top-0 h-full rounded-full transition-all duration-700"
                      style={{ width:`${barW}%`, background:'linear-gradient(270deg,#05966944,#10b981)' }}/>
                }
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-3 flex justify-between text-[9px] border-t" style={{ borderColor:'var(--border)', color:'var(--text-3)' }}>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background:'#ef4444' }}/>Increases failure risk</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background:'#10b981' }}/>Decreases failure risk</span>
      </div>
    </Card>
  )
}