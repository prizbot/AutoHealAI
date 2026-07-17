// 'use client'
// import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
// import { MetricsChart } from '@/src/components/charts/MetricsChart'
// import type { Metrics } from '@/src/types'

// interface Props { history: Metrics[] }

// export function ChartsPanel({ history }: Props) {
//   if (!history.length) {
//     return (
//       <Card>
//         <CardHeader><CardTitle icon="📈">Real-Time Metrics Charts</CardTitle></CardHeader>
//         <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
//           Collecting time-series data…
//         </div>
//       </Card>
//     )
//   }
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle icon="📈">Real-Time Metrics Charts</CardTitle>
//         <span className="text-[10px] text-slate-500 font-mono">{history.length} data points</span>
//       </CardHeader>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <MetricsChart
//           data={history} title="CPU & Memory (%)"
//           keys={[
//             { key: 'cpu',    color: '#6366f1', label: 'CPU %',    refLine: 85 },
//             { key: 'memory', color: '#22d3ee', label: 'Memory %', refLine: 90 },
//           ]}
//           domain={[0, 100]}
//         />
//         <MetricsChart
//           data={history} title="Request Rate (req/s)"
//           keys={[{ key: 'requests', color: '#f59e0b', label: 'Requests/s', refLine: 370 }]}
//         />
//         <MetricsChart
//           data={history} title="Response Latency (ms)"
//           keys={[{ key: 'latency', color: '#f43f5e', label: 'Latency ms', refLine: 700 }]}
//         />
//         <MetricsChart
//           data={history} title="Network I/O (MB)"
//           keys={[
//             { key: 'network_in',  color: '#34d399', label: 'Net In MB'  },
//             { key: 'network_out', color: '#a78bfa', label: 'Net Out MB' },
//           ]}
//         />
//       </div>
//       <p className="text-[9px] text-slate-700 mt-3 text-center">
//         Dashed lines indicate alert thresholds — auto-refreshes every 3 seconds
//       </p>
//     </Card>
//   )
// }

'use client'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { MetricsChart } from '@/src/components/charts/MetricsChart'
import { IconCharts }   from '@/src/components/ui/Icons'
import type { Metrics } from '@/src/types'

interface Props { history: Metrics[] }

export function ChartsPanel({ history }: Props) {
  if (!history.length) {
    return (
      <Card>
        <CardHeader><CardTitle icon={<IconCharts size={13} color="#0891b2"/>}>Real-Time Charts</CardTitle></CardHeader>
        <div className="flex items-center justify-center h-32 text-sm" style={{ color:'var(--text-3)' }}>
          Collecting time-series data…
        </div>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={<IconCharts size={13} color="#0891b2"/>}>Real-Time Metrics Charts</CardTitle>
        <span className="text-[10px] font-mono" style={{ color:'var(--text-3)' }}>{history.length} pts</span>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsChart data={history} title="CPU & Memory (%)"
          keys={[{key:'cpu',color:'#6366f1',label:'CPU %',refLine:85},{key:'memory',color:'#22d3ee',label:'Memory %',refLine:90}]}
          domain={[0,100]}/>
        <MetricsChart data={history} title="Request Rate (req/s)"
          keys={[{key:'requests',color:'#f59e0b',label:'Requests/s',refLine:370}]}/>
        <MetricsChart data={history} title="Response Latency (ms)"
          keys={[{key:'latency',color:'#f43f5e',label:'Latency ms',refLine:700}]}/>
        <MetricsChart data={history} title="Network I/O (MB)"
          keys={[{key:'network_in',color:'#34d399',label:'Net In MB'},{key:'network_out',color:'#a78bfa',label:'Net Out MB'}]}/>
      </div>
      <p className="text-[9px] mt-3 text-center" style={{ color:'var(--text-3)' }}>
        Dashed lines = alert thresholds · Refreshes every 3 seconds
      </p>
    </Card>
  )
}