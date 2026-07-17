// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { Badge } from '@/src/components/ui/Badge'
// import { cn, fmtDateTime } from '@/src/lib/utils'
// import type { Incident } from '@/src/types'

// interface Props { incidents: Incident[]; onAck: (id: number) => void }

// export function IncidentsPanel({ incidents, onAck }: Props) {
//   const openCount = incidents.filter(i => !i.acknowledged).length

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="🚨">Incident Timeline</CardTitle>
//         <div className="flex items-center gap-2">
//           {openCount > 0 && (
//             <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-blink">
//               {openCount} OPEN
//             </span>
//           )}
//           <span className="text-[10px] text-slate-600">{incidents.length} total</span>
//         </div>
//       </CardHeader>

//       {incidents.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-32 gap-2">
//           <span className="text-3xl">✅</span>
//           <p className="text-slate-500 text-sm">No incidents recorded</p>
//         </div>
//       ) : (
//         <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
//           {incidents.map(inc => (
//             <div
//               key={inc.id}
//               className={cn(
//                 'p-3 rounded-xl border transition-all duration-300 animate-fadeUp',
//                 inc.acknowledged
//                   ? 'bg-slate-900/30 border-slate-800/40 opacity-50'
//                   : inc.severity === 'critical'
//                   ? 'bg-red-950/30 border-red-700/40'
//                   : inc.severity === 'warning'
//                   ? 'bg-yellow-950/20 border-yellow-700/30'
//                   : 'bg-slate-800/30 border-slate-700/30'
//               )}
//             >
//               {/* Header row */}
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Badge
//                     label={inc.severity.toUpperCase()}
//                     variant={inc.acknowledged ? 'default' : (inc.severity as 'critical' | 'warning' | 'info')}
//                     pulse={!inc.acknowledged && inc.severity === 'critical'}
//                   />
//                   <span className="text-[10px] text-slate-500 font-mono">
//                     {fmtDateTime(inc.timestamp)}
//                   </span>
//                   <span className="text-[10px] text-slate-600">#{inc.id}</span>
//                 </div>
//                 {!inc.acknowledged && (
//                   <button
//                     onClick={() => onAck(inc.id)}
//                     className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/35 transition-colors font-semibold"
//                   >
//                     ACK
//                   </button>
//                 )}
//                 {inc.acknowledged && (
//                   <span className="text-[10px] text-slate-600 font-medium">acknowledged</span>
//                 )}
//               </div>

//               {/* Root causes */}
//               <div className="flex flex-wrap gap-1 mb-2">
//                 {inc.root_causes.map(c => (
//                   <span key={c} className="px-2 py-0.5 bg-slate-700/40 text-slate-300 rounded-md text-[10px] border border-slate-600/30">
//                     {c}
//                   </span>
//                 ))}
//               </div>

//               {/* Explanation */}
//               <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{inc.explanation}</p>

//               {/* Action count */}
//               {inc.actions.length > 0 && (
//                 <p className="text-[10px] text-slate-600 mt-1.5">
//                   {inc.actions.length} recovery action{inc.actions.length > 1 ? 's' : ''} queued
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </Card>
//   )
// }


'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Badge }          from '@/src/components/ui/Badge'
import { IconIncidents }  from '@/src/components/ui/Icons'
import { cn, fmtDateTime } from '@/src/lib/utils'
import type { Incident } from '@/src/types'

interface Props { incidents: Incident[]; onAck: (id: number) => void }

export function IncidentsPanel({ incidents, onAck }: Props) {
  const openCount = incidents.filter(i => !i.acknowledged).length
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconIncidents size={13} color="#be123c"/>}>Incident Timeline</CardTitle>
        <div className="flex items-center gap-2">
          {openCount > 0 && (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold animate-blink"
              style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' }}>
              {openCount} OPEN
            </span>
          )}
          <span className="text-[10px]" style={{ color:'var(--text-3)' }}>{incidents.length} total</span>
        </div>
      </CardHeader>
      {incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <p className="text-sm" style={{ color:'var(--text-3)' }}>No incidents recorded</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {incidents.map(inc => (
            <div key={inc.id}
              className={cn('p-3 rounded-xl border transition-all animate-fadeUp',
                inc.acknowledged ? 'opacity-50' : '')}
              style={{
                background: inc.acknowledged ? 'var(--bg-card-2)' :
                  inc.severity==='critical' ? 'rgba(239,68,68,0.06)' : 'rgba(234,179,8,0.05)',
                borderColor: inc.acknowledged ? 'var(--border)' :
                  inc.severity==='critical' ? 'rgba(239,68,68,0.28)' : 'rgba(234,179,8,0.28)',
              }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    label={inc.severity.toUpperCase()}
                    variant={inc.acknowledged ? 'default' : inc.severity as any}
                    pulse={!inc.acknowledged && inc.severity==='critical'}
                  />
                  <span className="text-[10px] font-mono" style={{ color:'var(--text-3)' }}>
                    {fmtDateTime(inc.timestamp)}
                  </span>
                  <span className="text-[10px]" style={{ color:'var(--text-3)' }}>#{inc.id}</span>
                </div>
                {!inc.acknowledged ? (
                  <button onClick={() => onAck(inc.id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-colors"
                    style={{ background:'rgba(99,102,241,0.12)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
                    ACK
                  </button>
                ) : (
                  <span className="text-[10px]" style={{ color:'var(--text-3)' }}>acknowledged</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {inc.root_causes.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-md text-[10px] border"
                    style={{ background:'var(--bg-card-2)', color:'var(--text-2)', borderColor:'var(--border)' }}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color:'var(--text-3)' }}>
                {inc.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}