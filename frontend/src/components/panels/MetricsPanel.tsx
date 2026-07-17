// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { Gauge }    from '@/src/components/ui/Gauge'
// import { StatCard } from '@/src/components/ui/StatCard'
// import { cn, metricColor } from '@/src/lib/utils'
// import type { Metrics } from '@/src/types'

// interface Props { metrics: Metrics | null }

// export function MetricsPanel({ metrics: m }: Props) {
//   if (!m) {
//     return (
//       <Card>
//         <CardHeader><CardTitle icon="📊">Live System Metrics</CardTitle></CardHeader>
//         <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
//           Waiting for first metric snapshot…
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="📊">Live System Metrics</CardTitle>
//         {m.fault_active && (
//           <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 animate-blink font-bold uppercase tracking-wider">
//             ⚡ {m.fault_type?.replace(/_/g, ' ')}
//           </span>
//         )}
//       </CardHeader>

//       {/* Gauges row */}
//       <div className="flex justify-around items-center py-2 mb-3">
//         <Gauge value={m.cpu}    label="CPU"    warnAt={70} critAt={85} />
//         <Gauge value={m.memory} label="Memory" warnAt={75} critAt={90} />
//         <Gauge value={m.disk}   label="Disk"   warnAt={80} critAt={92} />
//       </div>

//       {/* Stat grid */}
//       <div className="grid grid-cols-2 gap-2">
//         <StatCard
//           label="Requests / sec" icon="⚡"
//           value={m.requests.toFixed(0)} unit="req/s"
//           color={metricColor(m.requests, 350, 500)}
//           subtext={m.requests > 500 ? 'Traffic elevated' : 'Normal load'}
//         />
//         <StatCard
//           label="Latency" icon="⏱"
//           value={m.latency.toFixed(0)} unit="ms"
//           color={metricColor(m.latency, 450, 700)}
//           subtext={m.latency > 700 ? 'Degraded' : m.latency > 450 ? 'Elevated' : 'Good'}
//         />
//         <StatCard
//           label="Pod Restarts" icon="🔄"
//           value={m.restarts} unit=""
//           color={m.restarts > 1 ? 'text-red-400' : m.restarts > 0 ? 'text-yellow-400' : 'text-emerald-400'}
//           subtext={m.restarts > 1 ? 'Crash loop risk' : 'Stable'}
//         />
//         <StatCard
//           label="Processes" icon="⚙️"
//           value={m.process_count ?? '—'} unit=""
//           color="text-slate-200"
//         />
//         <StatCard
//           label="Net In" icon="↓"
//           value={m.network_in.toFixed(2)} unit="MB"
//           color="text-indigo-300"
//         />
//         <StatCard
//           label="Net Out" icon="↑"
//           value={m.network_out.toFixed(2)} unit="MB"
//           color="text-purple-300"
//         />
//       </div>
//     </Card>
//   )
// }

'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Gauge }    from '@/src/components/ui/Gauge'
import { StatCard } from '@/src/components/ui/StatCard'
import { IconMetrics } from '@/src/components/ui/Icons'
import { cn, metricColor } from '@/src/lib/utils'
import type { Metrics } from '@/src/types'

interface Props { metrics: Metrics | null }

export function MetricsPanel({ metrics: m }: Props) {
  if (!m) {
    return (
      <Card>
        <CardHeader>
          <CardTitle icon={<IconMetrics size={13} color="#6366f1"/>}>Live System Metrics</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-center h-40 text-sm" style={{ color:'var(--text-3)' }}>
          Waiting for first metric snapshot…
        </div>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconMetrics size={13} color="#6366f1"/>}>Live System Metrics</CardTitle>
        {m.fault_active && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-blink"
            style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' }}>
            {m.fault_type?.replace(/_/g,' ')}
          </span>
        )}
      </CardHeader>
      <div className="flex justify-around items-center py-2 mb-3">
        <Gauge value={m.cpu}    label="CPU"    warnAt={70} critAt={85}/>
        <Gauge value={m.memory} label="Memory" warnAt={75} critAt={90}/>
        <Gauge value={m.disk}   label="Disk"   warnAt={80} critAt={92}/>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Requests / sec" value={m.requests.toFixed(0)} unit="req/s" color={metricColor(m.requests,350,500)} subtext={m.requests>500?'Traffic elevated':'Normal load'}/>
        <StatCard label="Latency"        value={m.latency.toFixed(0)}  unit="ms"    color={metricColor(m.latency,450,700)} subtext={m.latency>700?'Degraded':m.latency>450?'Elevated':'Good'}/>
        <StatCard label="Pod Restarts"   value={m.restarts}            color={m.restarts>1?'text-red-400':m.restarts>0?'text-yellow-400':'text-emerald-400'} subtext={m.restarts>1?'Crash loop risk':'Stable'}/>
        <StatCard label="Processes"      value={m.process_count??'—'}/>
        <StatCard label="Net In"         value={m.network_in.toFixed(2)}  unit="MB" color="text-indigo-300"/>
        <StatCard label="Net Out"        value={m.network_out.toFixed(2)} unit="MB" color="text-purple-300"/>
      </div>
    </Card>
  )
}