/* AutoHealAI — custom SVG icon system. No external deps. */
interface IProps { size?: number; color?: string }

const b = (size = 20, color = 'currentColor') => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: 1.6,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
})

export function IconOverview({ size=20, color='currentColor' }: IProps) {
  return <svg {...b(size,color)}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
}
export function IconAnalytics({ size=20, color='currentColor' }: IProps) {
  return <svg {...b(size,color)}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}
export function IconIncidents({ size=20, color='currentColor' }: IProps) {
  return <svg {...b(size,color)}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
export function IconDemoLab({ size=20, color='currentColor' }: IProps) {
  return <svg {...b(size,color)}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
}
export function IconMetrics({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><path d="M3 18l4-8 4 5 4-9 4 12"/><line x1="3" y1="22" x2="21" y2="22"/></svg>
}
export function IconPrediction({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
}
export function IconActions({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
}
export function IconCharts({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
export function IconShap({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
}
export function IconModel({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
}
export function IconFault({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
}
export function IconList({ size=18, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.7}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
}
export function IconSun({ size=15, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.8}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
}
export function IconMoon({ size=15, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.8}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
}
export function IconChevronLeft({ size=15, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={2.2}><polyline points="15 18 9 12 15 6"/></svg>
}
export function IconChevronRight({ size=15, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={2.2}><polyline points="9 18 15 12 9 6"/></svg>
}
export function IconPrometheus({ size=14, color='currentColor' }: IProps) {
  return <svg {...b(size,color)} strokeWidth={1.8}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}