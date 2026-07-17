// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { cn, priorityBadgeCls } from '@/src/lib/utils'
// import type { Prediction } from '@/src/types'

// interface Props { prediction: Prediction | null }

// const PRIORITY_ROW: Record<string, string> = {
//   critical: 'border-red-700/40 bg-red-950/30',
//   high:     'border-orange-700/30 bg-orange-950/20',
//   medium:   'border-slate-600/30 bg-slate-800/30',
//   low:      'border-slate-700/20 bg-slate-900/20',
//   none:     'border-slate-700/20 bg-slate-900/20',
// }

// const ICONS: Record<string, string> = {
//   critical: '🔴',
//   high:     '🟠',
//   medium:   '🟡',
//   low:      '🔵',
//   none:     '⚪',
// }

// export function ActionsPanel({ prediction: p }: Props) {
//   const criticalCount = p?.actions.filter(a => a.priority === 'critical').length ?? 0
//   const autoCount     = p?.actions.filter(a => a.automated).length ?? 0

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="⚙️">Automated Recovery Actions</CardTitle>
//         {p && p.actions.length > 0 && (
//           <div className="flex items-center gap-2 text-[10px]">
//             {criticalCount > 0 && (
//               <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-blink">
//                 {criticalCount} CRITICAL
//               </span>
//             )}
//             <span className="text-slate-500">{autoCount} auto</span>
//           </div>
//         )}
//       </CardHeader>

//       {!p || p.actions.length === 0 ? (
//         <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
//           No actions queued
//         </div>
//       ) : (
//         <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
//           {p.actions.map((a, i) => (
//             <div
//               key={i}
//               className={cn(
//                 'flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 animate-fadeUp',
//                 PRIORITY_ROW[a.priority] ?? PRIORITY_ROW.none,
//               )}
//               style={{ animationDelay: `${i * 30}ms` }}
//             >
//               <span className="text-sm mt-0.5 flex-shrink-0">{ICONS[a.priority]}</span>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm text-slate-200 leading-snug font-medium">{a.action}</p>
//                 <p className="text-[10px] text-slate-500 mt-0.5 truncate">↳ {a.cause}</p>
//               </div>
//               <div className="flex flex-col items-end gap-1 flex-shrink-0">
//                 <span className={cn(
//                   'text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase',
//                   priorityBadgeCls(a.priority),
//                 )}>
//                   {a.priority}
//                 </span>
//                 <span className={cn(
//                   'text-[9px] font-semibold',
//                   a.automated ? 'text-indigo-400' : 'text-amber-500',
//                 )}>
//                   {a.automated ? 'AUTO' : 'MANUAL'}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {p && (
//         <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-[10px] text-slate-600">
//           <span>{p.actions.length} total actions</span>
//           <span>{autoCount} automated · {p.actions.length - autoCount} manual</span>
//         </div>
//       )}
//     </Card>
//   )
// }

'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { IconActions } from '@/src/components/ui/Icons'
import { cn, priorityBadgeCls } from '@/src/lib/utils'
import type { Prediction } from '@/src/types'

interface Props { prediction: Prediction | null }

const ROW: Record<string,string> = {
  critical:'border-red-700/30 bg-red-950/20',
  high:    'border-orange-700/25 bg-orange-950/15',
  medium:  'border-slate-600/25 bg-slate-800/25',
  low:     'border-slate-700/15 bg-slate-900/15',
  none:    'border-slate-700/15 bg-slate-900/15',
}
const PRI_DOT: Record<string,string> = {
  critical:'#ef4444', high:'#fb923c', medium:'#fbbf24', low:'#60a5fa', none:'#94a3b8',
}

export function ActionsPanel({ prediction: p }: Props) {
  const crit = p?.actions.filter(a=>a.priority==='critical').length ?? 0
  const auto = p?.actions.filter(a=>a.automated).length ?? 0
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconActions size={13} color="#0f766e"/>}>Recovery Actions</CardTitle>
        {p && p.actions.length > 0 && (
          <div className="flex items-center gap-2 text-[10px]">
            {crit > 0 && (
              <span className="px-2 py-0.5 rounded-full font-bold animate-blink"
                style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' }}>
                {crit} CRITICAL
              </span>
            )}
            <span style={{ color:'var(--text-3)' }}>{auto} auto</span>
          </div>
        )}
      </CardHeader>
      {!p || p.actions.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-sm" style={{ color:'var(--text-3)' }}>No actions queued</div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {p.actions.map((a,i) => (
            <div key={i} className={cn('flex items-start gap-3 p-3 rounded-xl border transition-all animate-fadeUp', ROW[a.priority]??ROW.none)}
              style={{ animationDelay:`${i*25}ms` }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: PRI_DOT[a.priority]??'#94a3b8' }}/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug" style={{ color:'var(--text-1)' }}>{a.action}</p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color:'var(--text-3)' }}>↳ {a.cause}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={cn('text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase', priorityBadgeCls(a.priority))}>
                  {a.priority}
                </span>
                <span className={cn('text-[9px] font-semibold', a.automated?'text-indigo-400':'text-amber-500')}>
                  {a.automated?'AUTO':'MANUAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {p && (
        <div className="mt-3 pt-3 border-t flex justify-between text-[10px]"
          style={{ borderColor:'var(--border)', color:'var(--text-3)' }}>
          <span>{p.actions.length} total</span>
          <span>{auto} automated · {p.actions.length-auto} manual</span>
        </div>
      )}
    </Card>
  )
}