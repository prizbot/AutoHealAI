// 'use client'
// import { useState, useEffect } from 'react'
// import { useAutoHeal }         from '@/src/hooks/useAutoHeal'
// import { useTheme }            from '@/src/hooks/useTheme'
// import { MetricsPanel }        from '@/src/components/panels/MetricsPanel'
// import { PredictionPanel }     from '@/src/components/panels/PredictionPanel'
// import { ActionsPanel }        from '@/src/components/panels/ActionsPanel'
// import { ChartsPanel }         from '@/src/components/panels/ChartsPanel'
// import { IncidentsPanel }      from '@/src/components/panels/IncidentsPanel'
// import { ModelInfoPanel }      from '@/src/components/panels/ModelInfoPanel'
// import { ShapPanel }           from '@/src/components/panels/ShapPanel'
// import { FaultInjectionPanel } from '@/src/components/panels/FaultInjectionPanel'
// import { ChatWidget }          from '@/src/components/panels/ChatWidget'
// import { ConfidenceGauge }     from '@/src/components/charts/ConfidenceGauge'
// import { cn } from '@/src/lib/utils'

// /* ─── Types ────────────────────────────────────────────────────────────── */
// type NavItem = 'overview' | 'analytics' | 'incidents' | 'demo'

// /* ─── Logo ─────────────────────────────────────────────────────────────── */
// function Logo({ collapsed }: { collapsed: boolean }) {
//   return (
//     <div className="flex items-center gap-3 overflow-hidden">
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
//         width="36" height="36" style={{ flexShrink: 0 }}>
//         <defs>
//           <linearGradient id="lBg"    x1="0%" y1="0%"  x2="100%" y2="100%"><stop offset="0%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#1e3a5f"/></linearGradient>
//           <linearGradient id="lRing"  x1="0%" y1="0%"  x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="50%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
//           <linearGradient id="lPulse" x1="0%" y1="0%"  x2="100%" y2="0%"><stop offset="0%" stopColor="#818cf8"/><stop offset="45%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#4ade80"/></linearGradient>
//           <radialGradient id="lGlow"  cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0"/></radialGradient>
//           <filter id="lSh"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.45"/></filter>
//         </defs>
//         <rect x="1.5" y="1.5" width="49" height="49" rx="13" fill="none" stroke="url(#lRing)" strokeWidth="1.5" opacity="0.7"/>
//         <rect x="4" y="4" width="44" height="44" rx="10" fill="url(#lBg)" filter="url(#lSh)"/>
//         <rect x="4" y="4" width="44" height="44" rx="10" fill="url(#lGlow)"/>
//         <g stroke="#6366f1" strokeWidth="0.3" opacity="0.18" strokeDasharray="1.5 4">
//           <line x1="4" y1="26" x2="48" y2="26"/><line x1="26" y1="4" x2="26" y2="48"/>
//           <line x1="4" y1="17" x2="48" y2="17"/><line x1="4" y1="35" x2="48" y2="35"/>
//         </g>
//         <circle cx="11" cy="11" r="1.8" fill="#6366f1" opacity="0.6"/>
//         <circle cx="41" cy="11" r="1.8" fill="#06b6d4" opacity="0.6"/>
//         <circle cx="11" cy="41" r="1.8" fill="#4ade80" opacity="0.5"/>
//         <circle cx="41" cy="41" r="1.8" fill="#8b5cf6" opacity="0.5"/>
//         <line x1="6" y1="26" x2="46" y2="26" stroke="#6366f1" strokeWidth="0.7" opacity="0.12"/>
//         <path d="M6 26 L13 26 L16 26 L19 13 L22 38 L25 18 L28 26 L31 26 L33 22 L35 26 L40 26 L46 26" fill="none" stroke="url(#lPulse)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M6 26 L13 26 L16 26 L19 13 L22 38 L25 18 L28 26 L31 26 L33 22 L35 26 L40 26 L46 26" fill="none" stroke="#22d3ee" strokeWidth="4" opacity="0.1" strokeLinecap="round" strokeLinejoin="round"/>
//         <circle cx="40" cy="26" r="2.8" fill="#22d3ee" opacity="0.95"/>
//         <circle cx="40" cy="26" r="5"   fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.35"/>
//         <circle cx="28" cy="26" r="1.6" fill="#818cf8"/>
//         <line x1="28" y1="26" x2="25" y2="19" stroke="#6366f1" strokeWidth="0.6" opacity="0.5" strokeDasharray="1 1.5"/>
//         <line x1="28" y1="26" x2="31" y2="19" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" strokeDasharray="1 1.5"/>
//         <circle cx="25" cy="19" r="1.2" fill="#6366f1" opacity="0.7"/>
//         <circle cx="31" cy="19" r="1.2" fill="#06b6d4" opacity="0.7"/>
//         <rect x="33" y="5" width="14" height="9" rx="3" fill="#f59e0b" opacity="0.18"/>
//         <rect x="33" y="5" width="14" height="9" rx="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.7"/>
//         <text x="40" y="12" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontSize="5.5" fontWeight="900" fill="#fde68a" letterSpacing="0.3">AI</text>
//       </svg>
//       {!collapsed && (
//         <div style={{ lineHeight: 1, overflow: 'hidden' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 28" width="130" height="26">
//             <defs>
//               <linearGradient id="wrd" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="55%" stopColor="#f0f9ff"/><stop offset="100%" stopColor="#cffafe"/></linearGradient>
//               <linearGradient id="wai" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
//               <filter id="wg"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#6366f1" floodOpacity="0.35"/></filter>
//               <filter id="ag"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="0.5"/></filter>
//             </defs>
//             <text x="0" y="22" fontFamily="Arial Black,Helvetica Neue,sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5" fill="url(#wrd)" filter="url(#wg)">AutoHeal</text>
//             <text x="104" y="22" fontFamily="Arial Black,Helvetica Neue,sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5" fill="url(#wai)" filter="url(#ag)">AI</text>
//           </svg>
//           <p style={{ fontSize:'8px', fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-3)', marginTop:'1px', fontFamily:'Arial,sans-serif' }}>
//             AIOps · v2.0
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// /* ─── Nav items ─────────────────────────────────────────────────────────── */
// const NAV: { id: NavItem; icon: string; label: string; desc: string }[] = [
//   { id: 'overview',  icon: '⬡', label: 'Overview',   desc: 'System health at a glance' },
//   { id: 'analytics', icon: '◈', label: 'Analytics',   desc: 'Charts & SHAP attribution' },
//   { id: 'incidents', icon: '⚠', label: 'Incidents',   desc: 'Timeline & ML model info' },
//   { id: 'demo',      icon: '⚡', label: 'Demo Lab',    desc: 'Fault injection controls' },
// ]

// /* ─── Sidebar ───────────────────────────────────────────────────────────── */
// function Sidebar({
//   active, setActive, connected, modelReady, openIncidents, isDark, onThemeToggle, collapsed, setCollapsed
// }: {
//   active: NavItem; setActive: (n: NavItem) => void
//   connected: boolean; modelReady: boolean; openIncidents: number
//   isDark: boolean; onThemeToggle: () => void
//   collapsed: boolean; setCollapsed: (v: boolean) => void
// }) {
//   return (
//     <aside style={{
//       width:      collapsed ? '60px' : '220px',
//       minHeight:  '100vh',
//       background: 'var(--bg-card)',
//       borderRight:'1px solid var(--border)',
//       display:    'flex',
//       flexDirection: 'column',
//       transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
//       flexShrink: 0,
//       zIndex:     30,
//       position:   'relative',
//     }}>
//       {/* Logo area */}
//       <div style={{ padding: collapsed ? '20px 12px' : '20px 18px', borderBottom: '1px solid var(--border)' }}>
//         <Logo collapsed={collapsed}/>
//       </div>

//       {/* Nav links */}
//       <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:'4px' }}>
//         {NAV.map(n => {
//           const isActive = active === n.id
//           const hasAlert = n.id === 'incidents' && openIncidents > 0
//           return (
//             <button key={n.id} onClick={() => setActive(n.id)}
//               title={collapsed ? n.label : undefined}
//               style={{
//                 display:       'flex',
//                 alignItems:    'center',
//                 gap:           '10px',
//                 padding:       collapsed ? '10px 0' : '10px 12px',
//                 justifyContent:collapsed ? 'center' : 'flex-start',
//                 borderRadius:  '10px',
//                 border:        'none',
//                 cursor:        'pointer',
//                 background:    isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
//                 outline:       isActive ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
//                 transition:    'all 0.15s ease',
//                 width:         '100%',
//                 position:      'relative',
//               }}
//               onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.07)' }}
//               onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
//             >
//               <span style={{
//                 fontSize:   '16px',
//                 lineHeight:  1,
//                 color:       isActive ? '#818cf8' : 'var(--text-3)',
//                 flexShrink:  0,
//               }}>{n.icon}</span>
//               {!collapsed && (
//                 <div style={{ textAlign:'left', flex:1, minWidth:0 }}>
//                   <p style={{ fontSize:'12px', fontWeight:600, color: isActive ? '#a5b4fc' : 'var(--text-2)', margin:0 }}>{n.label}</p>
//                 </div>
//               )}
//               {hasAlert && (
//                 <span style={{
//                   position:    collapsed ? 'absolute' : 'relative',
//                   top:         collapsed ? '6px' : undefined,
//                   right:       collapsed ? '6px' : undefined,
//                   width:'8px', height:'8px',
//                   borderRadius:'50%',
//                   background:  '#ef4444',
//                   flexShrink:  0,
//                   animation:   'blink 1.4s ease-in-out infinite',
//                 }}/>
//               )}
//               {isActive && (
//                 <div style={{
//                   position:  'absolute',
//                   left:      0,
//                   top:       '4px',
//                   bottom:    '4px',
//                   width:     '3px',
//                   borderRadius:'0 3px 3px 0',
//                   background:'linear-gradient(180deg,#6366f1,#8b5cf6)',
//                 }}/>
//               )}
//             </button>
//           )
//         })}
//       </nav>

//       {/* Bottom controls */}
//       <div style={{ padding:'12px 8px', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'6px' }}>
//         {/* Status */}
//         <div style={{
//           display:'flex', alignItems:'center', gap:'6px',
//           justifyContent: collapsed ? 'center' : 'flex-start',
//           padding: collapsed ? '6px 0' : '6px 10px',
//           borderRadius:'8px',
//           background: connected ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
//         }}>
//           <span style={{
//             width:'6px', height:'6px', borderRadius:'50%', flexShrink:0,
//             background: connected ? '#22c55e' : '#ef4444',
//             animation: connected ? 'pulse2 2s ease-in-out infinite' : 'none',
//           }}/>
//           {!collapsed && (
//             <span style={{ fontSize:'10px', fontWeight:600, color: connected ? '#4ade80' : '#f87171' }}>
//               {connected ? 'LIVE' : 'OFFLINE'}
//             </span>
//           )}
//         </div>

//         {/* Theme + collapse */}
//         <div style={{ display:'flex', gap:'6px', justifyContent: collapsed ? 'center' : 'space-between' }}>
//           <button onClick={onThemeToggle}
//             style={{
//               flex: collapsed ? undefined : 1,
//               padding:'7px', borderRadius:'8px',
//               border:'1px solid var(--border)',
//               background:'var(--bg-card-2)',
//               cursor:'pointer', fontSize:'14px',
//               transition:'all 0.15s',
//             }}
//             title="Toggle theme">
//             {isDark ? '☀️' : '🌙'}
//           </button>
//           <button onClick={() => setCollapsed(!collapsed)}
//             style={{
//               flex: collapsed ? undefined : undefined,
//               padding:'7px 10px', borderRadius:'8px',
//               border:'1px solid var(--border)',
//               background:'var(--bg-card-2)',
//               cursor:'pointer', fontSize:'12px',
//               color:'var(--text-3)',
//               transition:'all 0.15s',
//             }}
//             title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
//             {collapsed ? '›' : '‹'}
//           </button>
//         </div>
//       </div>
//     </aside>
//   )
// }

// /* ─── Hero status bar ───────────────────────────────────────────────────── */
// function HeroBar({ prediction, metrics, lastUpdate }: {
//   prediction: any; metrics: any; lastUpdate: string
// }) {
//   const failure  = prediction?.failure
//   const severity = prediction?.severity ?? 'info'
//   const conf     = prediction?.confidence ?? 0

//   const statusColor =
//     !prediction   ? '#94a3b8' :
//     failure && severity === 'critical' ? '#ef4444' :
//     failure       ? '#eab308' :
//     '#22c55e'

//   const bgStyle = failure && severity === 'critical'
//     ? { background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(30,27,75,0.6) 60%)', borderColor: 'rgba(239,68,68,0.3)' }
//     : failure
//     ? { background: 'linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(30,27,75,0.6) 60%)', borderColor: 'rgba(234,179,8,0.3)' }
//     : { background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(30,27,75,0.5) 60%)', borderColor: 'rgba(34,197,94,0.25)' }

//   return (
//     <div style={{
//       ...bgStyle,
//       border:       '1px solid',
//       borderRadius: '16px',
//       padding:      '20px 28px',
//       marginBottom: '24px',
//       display:      'flex',
//       alignItems:   'center',
//       justifyContent:'space-between',
//       flexWrap:     'wrap',
//       gap:          '16px',
//       backdropFilter:'blur(12px)',
//       WebkitBackdropFilter:'blur(12px)',
//     }}>
//       {/* Status text */}
//       <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
//         <div style={{
//           width:'12px', height:'12px', borderRadius:'50%', flexShrink:0,
//           background: statusColor,
//           boxShadow:  `0 0 10px ${statusColor}88`,
//           animation:  failure ? 'blink 1.4s ease-in-out infinite' : 'pulse2 2s ease-in-out infinite',
//         }}/>
//         <div>
//           <h2 style={{ fontSize:'22px', fontWeight:800, color: statusColor, margin:0, lineHeight:1.1 }}>
//             {prediction ? prediction.status : 'Connecting…'}
//           </h2>
//           <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'3px', fontFamily:'Arial,sans-serif' }}>
//             {prediction?.explanation
//               ? prediction.explanation.split('.')[0] + '.'
//               : 'AutoHealAI AIOps Platform · v2.0'}
//           </p>
//         </div>
//       </div>

//       {/* Quick stat strip */}
//       <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
//         {[
//           { label:'Confidence', value: conf > 0 ? `${conf.toFixed(1)}%` : '—', color: statusColor },
//           { label:'CPU',        value: metrics ? `${metrics.cpu.toFixed(1)}%` : '—', color: metrics?.cpu > 80 ? '#ef4444' : 'var(--text-1)' },
//           { label:'Memory',     value: metrics ? `${metrics.memory.toFixed(1)}%` : '—', color: metrics?.memory > 85 ? '#ef4444' : 'var(--text-1)' },
//           { label:'Latency',    value: metrics ? `${metrics.latency.toFixed(0)}ms` : '—', color: metrics?.latency > 600 ? '#eab308' : 'var(--text-1)' },
//           { label:'Updated',    value: lastUpdate || '—', color:'var(--text-2)' },
//         ].map(s => (
//           <div key={s.label} style={{ textAlign:'right' }}>
//             <p style={{ fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-3)', margin:0, fontFamily:'Arial,sans-serif' }}>{s.label}</p>
//             <p style={{ fontSize:'16px', fontWeight:700, color: s.color as string, margin:0, fontFamily:'Arial Black,sans-serif', letterSpacing:'-0.3px' }}>{s.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// /* ─── Section heading ───────────────────────────────────────────────────── */
// function SectionHead({ title, sub, icon }: { title: string; sub?: string; icon?: string }) {
//   return (
//     <div style={{ marginBottom:'20px' }}>
//       <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//         {icon && <span style={{ fontSize:'18px' }}>{icon}</span>}
//         <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text-1)', margin:0 }}>{title}</h2>
//       </div>
//       {sub && <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'3px', marginLeft: icon ? '28px' : 0 }}>{sub}</p>}
//     </div>
//   )
// }

// /* ─── Divider ───────────────────────────────────────────────────────────── */
// function Div() {
//   return <div style={{ height:'1px', background:'var(--border)', margin:'32px 0', opacity:0.5 }}/>
// }

// /* ═══════════════════════════════════════════════════════════════════════ */
// /*  PAGES                                                                  */
// /* ═══════════════════════════════════════════════════════════════════════ */

// function OverviewPage({ metrics, history, prediction }: any) {
//   return (
//     <div className="animate-fadeUp">
//       <SectionHead title="System Health" sub="Live metrics and AI failure prediction" icon="📡"/>

//       {/* Top row: Metrics left, Prediction right — full breathing room */}
//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
//         <MetricsPanel metrics={metrics}/>
//         <PredictionPanel prediction={prediction}/>
//       </div>

//       <Div/>

//       {/* Actions — full width, not crammed */}
//       <SectionHead title="Automated Recovery Actions" sub="Priority-ranked remediation steps queued by the AI engine" icon="⚙️"/>
//       <ActionsPanel prediction={prediction}/>
//     </div>
//   )
// }

// function AnalyticsPage({ history, prediction }: any) {
//   return (
//     <div className="animate-fadeUp">
//       <SectionHead title="Real-Time Analytics" sub="Time-series metrics and ML feature attribution" icon="📈"/>
//       <ChartsPanel history={history}/>

//       <Div/>

//       <SectionHead title="SHAP Feature Attribution" sub="Why the model made this prediction — per-feature contribution analysis" icon="🔬"/>
//       <ShapPanel shap={prediction?.shap ?? null} confidence={prediction?.confidence ?? 0}/>

//       <Div/>

//       <SectionHead title="Model Ensemble" sub="Per-model probability breakdown and feature importance ranking" icon="🧠"/>
//       <ModelInfoPanel prediction={prediction}/>
//     </div>
//   )
// }

// function IncidentsPage({ incidents, ackIncident }: any) {
//   return (
//     <div className="animate-fadeUp">
//       <SectionHead title="Incident Timeline" sub="All detected failure events with root cause analysis" icon="🚨"/>
//       <IncidentsPanel incidents={incidents} onAck={ackIncident}/>
//     </div>
//   )
// }

// function DemoPage({ injectFault, clearFault, demoActive, demoFault }: any) {
//   return (
//     <div className="animate-fadeUp">
//       <SectionHead title="Demo Lab" sub="Inject simulated faults into the AI prediction engine — real monitoring data is never modified" icon="🎮"/>

//       {/* Explainer callout */}
//       <div style={{
//         marginBottom:'24px', padding:'16px 20px', borderRadius:'12px',
//         background:'rgba(99,102,241,0.07)',
//         border:'1px solid rgba(99,102,241,0.25)',
//       }}>
//         <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.6, margin:0 }}>
//           Each fault applies a metric overlay <strong style={{ color:'var(--text-1)' }}>only to the AI prediction pipeline</strong>.
//           The ring buffer, SQLite database, and all charts continue showing real host data.
//           This mirrors how production chaos engineering tools (Chaos Monkey, Gremlin) operate
//           — inject at the signal level, never at the infrastructure level.
//         </p>
//       </div>

//       {/* Fault panel centred, not stretched full width */}
//       <div style={{ maxWidth:'520px' }}>
//         <FaultInjectionPanel
//           onInject={injectFault}
//           onClear={clearFault}
//           demoActive={demoActive}
//           demoFault={demoFault}
//         />
//       </div>
//     </div>
//   )
// }

// /* ═══════════════════════════════════════════════════════════════════════ */
// /*  ROOT                                                                   */
// /* ═══════════════════════════════════════════════════════════════════════ */
// export default function Dashboard() {
//   const {
//     metrics, history, prediction, incidents,
//     connected, modelReady, groqReady,
//     demoActive, demoFault, lastUpdate,
//     ackIncident, injectFault, clearFault,
//   } = useAutoHeal()

//   const { isDark, toggle } = useTheme()
//   const [active,    setActive]    = useState<NavItem>('overview')
//   const [collapsed, setCollapsed] = useState(false)
//   const openIncidents = incidents.filter(i => !i.acknowledged).length

//   // Auto-switch to incidents page when a new incident fires
//   useEffect(() => {
//     if (openIncidents > 0 && active === 'overview') {
//       // Don't auto-switch; just let the red dot be the signal
//     }
//   }, [openIncidents])

//   const topBarHeight = '0px'

//   return (
//     <div className={cn('min-h-screen', isDark ? '' : 'light')}
//       style={{ background:'var(--bg-page)', display:'flex' }}>

//       {/* ── Sidebar ──────────────────────────────────────────── */}
//       <Sidebar
//         active={active}
//         setActive={setActive}
//         connected={connected}
//         modelReady={modelReady}
//         openIncidents={openIncidents}
//         isDark={isDark}
//         onThemeToggle={toggle}
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//       />

//       {/* ── Main content ─────────────────────────────────────── */}
//       <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>

//         {/* Top bar — breadcrumb + alerts */}
//         <div style={{
//           height:      '52px',
//           borderBottom:'1px solid var(--border)',
//           display:     'flex',
//           alignItems:  'center',
//           justifyContent:'space-between',
//           padding:     '0 28px',
//           background:  'var(--bg-card)',
//           flexShrink:  0,
//           backdropFilter:'blur(10px)',
//           WebkitBackdropFilter:'blur(10px)',
//         }}>
//           {/* Breadcrumb */}
//           <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
//             <span style={{ fontSize:'11px', color:'var(--text-3)' }}>AutoHealAI</span>
//             <span style={{ fontSize:'11px', color:'var(--text-3)' }}>›</span>
//             <span style={{ fontSize:'11px', fontWeight:600, color:'var(--text-1)' }}>
//               {NAV.find(n => n.id === active)?.label}
//             </span>
//           </div>

//           {/* Alert pills */}
//           <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//             {demoActive && (
//               <div className="animate-blink" style={{
//                 display:'flex', alignItems:'center', gap:'5px',
//                 padding:'3px 10px', borderRadius:'20px',
//                 background:'rgba(251,146,60,0.12)', border:'1px solid rgba(251,146,60,0.3)',
//               }}>
//                 <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#fb923c', display:'inline-block' }}/>
//                 <span style={{ fontSize:'10px', fontWeight:600, color:'#fb923c' }}>
//                   DEMO · {demoFault?.replace(/_/g,' ').toUpperCase()}
//                 </span>
//               </div>
//             )}
//             {openIncidents > 0 && (
//               <button onClick={() => setActive('incidents')} className="animate-blink" style={{
//                 display:'flex', alignItems:'center', gap:'5px',
//                 padding:'3px 10px', borderRadius:'20px',
//                 background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
//                 cursor:'pointer',
//               }}>
//                 <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block' }}/>
//                 <span style={{ fontSize:'10px', fontWeight:600, color:'#f87171' }}>
//                   {openIncidents} INCIDENT{openIncidents > 1 ? 'S' : ''}
//                 </span>
//               </button>
//             )}
//             {!modelReady && connected && (
//               <span style={{ fontSize:'10px', fontWeight:600, color:'#f59e0b',
//                 padding:'3px 10px', borderRadius:'20px',
//                 background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)' }}>
//                 ⚠ Model not trained
//               </span>
//             )}
//             <a href="/metrics" target="_blank" rel="noopener noreferrer"
//               style={{ fontSize:'10px', fontWeight:600, color:'#fb923c',
//                 padding:'3px 10px', borderRadius:'20px',
//                 background:'rgba(251,146,60,0.08)', border:'1px solid rgba(251,146,60,0.2)',
//                 textDecoration:'none' }}>
//               /metrics ↗
//             </a>
//           </div>
//         </div>

//         {/* Scrollable page area */}
//         <div style={{ flex:1, overflowY:'auto', padding:'28px 32px 100px' }}>

//           {/* Hero bar on all pages */}
//           <HeroBar prediction={prediction} metrics={metrics} lastUpdate={lastUpdate}/>

//           {/* Page content */}
//           {active === 'overview'  && <OverviewPage  metrics={metrics} history={history} prediction={prediction}/>}
//           {active === 'analytics' && <AnalyticsPage history={history} prediction={prediction}/>}
//           {active === 'incidents' && <IncidentsPage incidents={incidents} ackIncident={ackIncident}/>}
//           {active === 'demo'      && <DemoPage      injectFault={injectFault} clearFault={clearFault} demoActive={demoActive} demoFault={demoFault}/>}

//           {/* Footer */}
//           <div style={{ marginTop:'48px', paddingTop:'16px', borderTop:'1px solid var(--border)', textAlign:'center' }}>
//             <p style={{ fontSize:'10px', color:'var(--text-3)', fontFamily:'Arial,sans-serif' }}>
//               AutoHealAI v2.0 · Ensemble ML (RF + GBM + LR) · SHAP · ARIA · FastAPI · Prometheus · SQLite
//             </p>
//             {connected && (
//               <p style={{ fontSize:'10px', color:'var(--text-3)', marginTop:'4px', fontFamily:'Arial,sans-serif' }}>
//                 <a href="/metrics" target="_blank" rel="noopener noreferrer"
//                   style={{ color:'inherit', textDecoration:'underline' }}>Prometheus</a>
//                 {' · '}
//                 <a href="/docs" target="_blank" rel="noopener noreferrer"
//                   style={{ color:'inherit', textDecoration:'underline' }}>API docs</a>
//                 {' · Updated: '}{lastUpdate}
//               </p>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* ARIA floating chat */}
//       <ChatWidget groqReady={groqReady}/>
//     </div>
//   )
// }

'use client'
import { useState } from 'react'
import { useAutoHeal }         from '@/src/hooks/useAutoHeal'
import { useTheme }            from '@/src/hooks/useTheme'
import { MetricsPanel }        from '@/src/components/panels/MetricsPanel'
import { PredictionPanel }     from '@/src/components/panels/PredictionPanel'
import { ActionsPanel }        from '@/src/components/panels/ActionsPanel'
import { ChartsPanel }         from '@/src/components/panels/ChartsPanel'
import { IncidentsPanel }      from '@/src/components/panels/IncidentsPanel'
import { ModelInfoPanel }      from '@/src/components/panels/ModelInfoPanel'
import { ShapPanel }           from '@/src/components/panels/ShapPanel'
import { FaultInjectionPanel } from '@/src/components/panels/FaultInjectionPanel'
import { ChatWidget }          from '@/src/components/panels/ChatWidget'
import {
  IconOverview, IconAnalytics, IconIncidents, IconDemoLab,
  IconMetrics, IconPrediction, IconActions, IconCharts,
  IconShap, IconModel, IconFault, IconList,
  IconSun, IconMoon, IconChevronLeft, IconChevronRight, IconPrometheus,
} from '@/src/components/ui/Icons'
import { cn } from '@/src/lib/utils'

type NavPage = 'overview' | 'analytics' | 'incidents' | 'demo'

/* ─── AutoHeal logo ─────────────────────────────────────────────────── */
function Logo({ mini }: { mini: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: mini ? 0 : 12 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
        width={mini ? 34 : 36} height={mini ? 34 : 36} style={{ flexShrink:0 }}>
        <defs>
          <linearGradient id="lbg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#1e3a5f"/></linearGradient>
          <linearGradient id="lrng" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="50%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
          <linearGradient id="lpls" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#818cf8"/><stop offset="45%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#4ade80"/></linearGradient>
          <radialGradient id="lglw" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.28"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0"/></radialGradient>
          <filter id="lshd"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.4"/></filter>
        </defs>
        <rect x="1.5" y="1.5" width="49" height="49" rx="13" fill="none" stroke="url(#lrng)" strokeWidth="1.5" opacity="0.65"/>
        <rect x="4" y="4" width="44" height="44" rx="10" fill="url(#lbg2)" filter="url(#lshd)"/>
        <rect x="4" y="4" width="44" height="44" rx="10" fill="url(#lglw)"/>
        <g stroke="#6366f1" strokeWidth="0.3" opacity="0.18" strokeDasharray="1.5 4">
          <line x1="4" y1="26" x2="48" y2="26"/><line x1="26" y1="4" x2="26" y2="48"/>
          <line x1="4" y1="17" x2="48" y2="17"/><line x1="4" y1="35" x2="48" y2="35"/>
        </g>
        <circle cx="11" cy="11" r="1.8" fill="#6366f1" opacity="0.55"/>
        <circle cx="41" cy="11" r="1.8" fill="#06b6d4" opacity="0.55"/>
        <circle cx="11" cy="41" r="1.8" fill="#4ade80" opacity="0.45"/>
        <circle cx="41" cy="41" r="1.8" fill="#8b5cf6" opacity="0.45"/>
        <line x1="6" y1="26" x2="46" y2="26" stroke="#6366f1" strokeWidth="0.6" opacity="0.1"/>
        <path d="M6 26 L13 26 L16 26 L19 13 L22 38 L25 18 L28 26 L31 26 L33 22 L35 26 L40 26 L46 26" fill="none" stroke="url(#lpls)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 26 L13 26 L16 26 L19 13 L22 38 L25 18 L28 26 L31 26 L33 22 L35 26 L40 26 L46 26" fill="none" stroke="#22d3ee" strokeWidth="4" opacity="0.08" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="40" cy="26" r="2.8" fill="#22d3ee" opacity="0.92"/>
        <circle cx="40" cy="26" r="5"   fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3"/>
        <circle cx="28" cy="26" r="1.6" fill="#818cf8"/>
        <line x1="28" y1="26" x2="25" y2="19" stroke="#6366f1" strokeWidth="0.55" opacity="0.45" strokeDasharray="1 1.5"/>
        <line x1="28" y1="26" x2="31" y2="19" stroke="#06b6d4" strokeWidth="0.55" opacity="0.45" strokeDasharray="1 1.5"/>
        <circle cx="25" cy="19" r="1.1" fill="#6366f1" opacity="0.65"/>
        <circle cx="31" cy="19" r="1.1" fill="#06b6d4" opacity="0.65"/>
        <rect x="33" y="5" width="14" height="9" rx="3" fill="#f59e0b" opacity="0.16"/>
        <rect x="33" y="5" width="14" height="9" rx="3" fill="none" stroke="#f59e0b" strokeWidth="0.75" opacity="0.65"/>
        <text x="40" y="12" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontSize="5.5" fontWeight="900" fill="#fde68a" letterSpacing="0.3">AI</text>
      </svg>
      {!mini && (
        <div style={{ lineHeight:1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 26" width="128" height="24">
            <defs>
              <linearGradient id="wrd2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="55%" stopColor="#f0f9ff"/><stop offset="100%" stopColor="#cffafe"/></linearGradient>
              <linearGradient id="wai2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
              <filter id="wg2"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#6366f1" floodOpacity="0.3"/></filter>
              <filter id="ag2"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="0.45"/></filter>
            </defs>
            <text x="0" y="20" fontFamily="Arial Black,Helvetica Neue,sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5" fill="url(#wrd2)" filter="url(#wg2)">AutoHeal</text>
            <text x="104" y="20" fontFamily="Arial Black,Helvetica Neue,sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5" fill="url(#wai2)" filter="url(#ag2)">AI</text>
          </svg>
          <p style={{ fontSize:'8px', fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-3)', marginTop:'1px', fontFamily:'Arial,sans-serif' }}>AIOps · v2.0</p>
        </div>
      )}
    </div>
  )
}

/* ─── Nav config ────────────────────────────────────────────────────── */
const NAV = [
  { id: 'overview'  as NavPage, icon: IconOverview,  label: 'Overview',  sub: 'System health at a glance' },
  { id: 'analytics' as NavPage, icon: IconAnalytics, label: 'Analytics', sub: 'Charts & SHAP attribution'  },
  { id: 'incidents' as NavPage, icon: IconIncidents, label: 'Incidents', sub: 'Timeline & incidents'       },
  { id: 'demo'      as NavPage, icon: IconDemoLab,   label: 'Demo Lab',  sub: 'Fault injection controls'   },
]

/* ─── Icon-boxed section heading ────────────────────────────────────── */
function SH({
  icon: Icon, title, sub, accent = '#6366f1',
}: {
  icon: React.ComponentType<{size?: number; color?: string}>
  title: string
  sub?: string
  accent?: string
}) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'20px' }}>
      <div style={{
        width:'40px', height:'40px', borderRadius:'10px', flexShrink:0,
        background: `${accent}18`,
        border:     `1px solid ${accent}35`,
        display:    'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon size={18} color={accent}/>
      </div>
      <div style={{ paddingTop:'2px' }}>
        <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text-1)', margin:0, lineHeight:1.1 }}>{title}</h2>
        {sub && <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'3px', lineHeight:1.4 }}>{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Divider ───────────────────────────────────────────────────────── */
function Div() {
  return <div style={{ height:'1px', background:'var(--border)', margin:'32px 0', opacity:0.45 }}/>
}

/* ─── Sidebar ───────────────────────────────────────────────────────── */
function Sidebar({
  active, setActive, connected, openIncidents,
  isDark, onTheme, mini, setMini,
}: {
  active: NavPage; setActive: (p: NavPage) => void
  connected: boolean; openIncidents: number
  isDark: boolean; onTheme: () => void
  mini: boolean; setMini: (v: boolean) => void
}) {
  const W = mini ? 64 : 224
  return (
    <aside style={{
      width: W, minHeight:'100vh', flexShrink:0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display:'flex', flexDirection:'column',
      transition:'width 0.24s cubic-bezier(0.4,0,0.2,1)',
      zIndex:30,
    }}>
      {/* Logo */}
      <div style={{
        padding: mini ? '18px 0' : '18px 16px',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center',
        justifyContent: mini ? 'center' : 'flex-start',
        minHeight:'68px',
      }}>
        <Logo mini={mini}/>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:'2px' }}>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active_ = active === id
          const hasAlert = id === 'incidents' && openIncidents > 0
          return (
            <button key={id} onClick={() => setActive(id)}
              title={mini ? label : undefined}
              style={{
                display:'flex', alignItems:'center',
                gap: mini ? 0 : 12,
                padding: mini ? '11px 0' : '10px 12px',
                justifyContent: mini ? 'center' : 'flex-start',
                borderRadius:'10px', border:'none', cursor:'pointer',
                background: active_ ? 'rgba(99,102,241,0.12)' : 'transparent',
                outline: `1px solid ${active_ ? 'rgba(99,102,241,0.32)' : 'transparent'}`,
                transition:'all 0.15s ease', width:'100%', position:'relative',
                textAlign:'left',
              }}
              onMouseEnter={e => { if (!active_) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)' }}
              onMouseLeave={e => { if (!active_) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {/* Active accent bar */}
              {active_ && (
                <span style={{
                  position:'absolute', left:0, top:'5px', bottom:'5px',
                  width:'3px', borderRadius:'0 3px 3px 0',
                  background:'linear-gradient(180deg,#6366f1,#8b5cf6)',
                }}/>
              )}
              {/* Icon in a small box */}
              <span style={{
                width:'28px', height:'28px', borderRadius:'7px', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: active_ ? 'rgba(99,102,241,0.18)' : 'var(--bg-card-2)',
                border:`1px solid ${active_ ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                transition:'all 0.15s',
              }}>
                <Icon size={14} color={active_ ? '#818cf8' : 'var(--text-3)' as string}/>
              </span>
              {!mini && (
                <span style={{
                  fontSize:'12px', fontWeight:600, flex:1,
                  color: active_ ? '#a5b4fc' : 'var(--text-2)',
                }}>
                  {label}
                </span>
              )}
              {hasAlert && (
                <span style={{
                  position: mini ? 'absolute' : 'relative',
                  top: mini ? '6px' : undefined, right: mini ? '6px' : undefined,
                  width:'7px', height:'7px', borderRadius:'50%',
                  background:'#ef4444', flexShrink:0,
                  animation:'blink 1.4s ease-in-out infinite',
                }}/>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:'10px 8px', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'7px' }}>
        {/* Status */}
        <div style={{
          display:'flex', alignItems:'center',
          justifyContent: mini ? 'center' : 'flex-start',
          gap:'7px', padding: mini ? '6px 0' : '6px 10px',
          borderRadius:'8px',
          background: connected ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
          border: `1px solid ${connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <span style={{
            width:'6px', height:'6px', borderRadius:'50%', flexShrink:0,
            background: connected ? '#22c55e' : '#ef4444',
            animation: connected ? 'pulse2 2s ease-in-out infinite' : 'none',
          }}/>
          {!mini && (
            <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em',
              color: connected ? '#4ade80' : '#f87171' }}>
              {connected ? 'LIVE' : 'OFFLINE'}
            </span>
          )}
        </div>

        {/* Theme + collapse */}
        <div style={{ display:'flex', gap:'6px', justifyContent: mini ? 'center' : 'stretch' }}>
          <button onClick={onTheme} title="Toggle theme"
            style={{
              flex: mini ? undefined : 1,
              height:'32px', borderRadius:'8px',
              border:'1px solid var(--border)',
              background:'var(--bg-card-2)',
              cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center',
              transition:'all 0.15s', padding: mini ? '0 9px' : '0',
            }}>
            {isDark
              ? <IconSun  size={14} color="var(--text-2)"/>
              : <IconMoon size={14} color="var(--text-2)"/>}
          </button>
          <button onClick={() => setMini(!mini)} title={mini ? 'Expand' : 'Collapse'}
            style={{
              height:'32px', padding:'0 9px', borderRadius:'8px',
              border:'1px solid var(--border)',
              background:'var(--bg-card-2)',
              cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
            }}>
            {mini
              ? <IconChevronRight size={13} color="var(--text-3)"/>
              : <IconChevronLeft  size={13} color="var(--text-3)"/>}
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ─── Top bar ───────────────────────────────────────────────────────── */
function TopBar({
  active, demoActive, demoFault, openIncidents, modelReady, connected, setActive,
}: {
  active: NavPage; demoActive: boolean; demoFault: string | null
  openIncidents: number; modelReady: boolean; connected: boolean
  setActive: (p: NavPage) => void
}) {
  return (
    <div style={{
      height:'50px', flexShrink:0,
      background:'var(--bg-card)',
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center',
      justifyContent:'space-between',
      padding:'0 28px',
      backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
    }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
        <span style={{ fontSize:'11px', color:'var(--text-3)' }}>AutoHealAI</span>
        <span style={{ fontSize:'11px', color:'var(--text-3)' }}>›</span>
        <span style={{ fontSize:'11px', fontWeight:600, color:'var(--text-1)' }}>
          {NAV.find(n => n.id === active)?.label}
        </span>
      </div>

      {/* Chips */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        {demoActive && (
          <div className="animate-blink" style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'4px 11px', borderRadius:'20px',
            background:'rgba(251,146,60,0.1)', border:'1px solid rgba(251,146,60,0.28)',
          }}>
            <IconDemoLab size={10} color="#fb923c"/>
            <span style={{ fontSize:'10px', fontWeight:600, color:'#fb923c' }}>
              {demoFault?.replace(/_/g,' ').toUpperCase()}
            </span>
          </div>
        )}
        {openIncidents > 0 && (
          <button onClick={() => setActive('incidents')} className="animate-blink" style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'4px 11px', borderRadius:'20px',
            background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.28)',
            cursor:'pointer',
          }}>
            <IconIncidents size={10} color="#f87171"/>
            <span style={{ fontSize:'10px', fontWeight:600, color:'#f87171' }}>
              {openIncidents} INCIDENT{openIncidents > 1 ? 'S' : ''}
            </span>
          </button>
        )}
        {!modelReady && connected && (
          <div style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'4px 11px', borderRadius:'20px',
            background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)',
          }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#f59e0b', display:'inline-block' }}/>
            <span style={{ fontSize:'10px', fontWeight:600, color:'#fbbf24' }}>Model not trained</span>
          </div>
        )}
        <a href="/metrics" target="_blank" rel="noopener noreferrer" style={{
          display:'flex', alignItems:'center', gap:'6px',
          padding:'4px 11px', borderRadius:'20px',
          background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.22)',
          textDecoration:'none',
        }}>
          <IconPrometheus size={11} color="#818cf8"/>
          <span style={{ fontSize:'10px', fontWeight:600, color:'#818cf8' }}>/metrics</span>
        </a>
      </div>
    </div>
  )
}

/* ─── Hero bar ──────────────────────────────────────────────────────── */
function HeroBar({ prediction, metrics, lastUpdate }: { prediction: any; metrics: any; lastUpdate: string }) {
  const failure  = prediction?.failure
  const severity = prediction?.severity ?? 'info'
  const conf     = prediction?.confidence ?? 0

  const col =
    !prediction               ? '#94a3b8' :
    failure && severity === 'critical' ? '#ef4444' :
    failure                   ? '#eab308' :
    '#22c55e'

  const bgGrad = failure && severity === 'critical'
    ? 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(15,23,42,0.55) 65%)'
    : failure
    ? 'linear-gradient(135deg, rgba(234,179,8,0.09) 0%, rgba(15,23,42,0.55) 65%)'
    : 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(15,23,42,0.50) 65%)'

  const borderCol = failure && severity === 'critical'
    ? 'rgba(239,68,68,0.28)' : failure ? 'rgba(234,179,8,0.28)' : 'rgba(34,197,94,0.22)'

  const statusPulse = failure
    ? `0 0 12px ${col}66` : `0 0 8px ${col}44`

  return (
    <div style={{
      background: bgGrad,
      border:`1px solid ${borderCol}`,
      borderRadius:'16px',
      padding:'20px 26px',
      marginBottom:'26px',
      display:'flex', alignItems:'center',
      justifyContent:'space-between',
      flexWrap:'wrap', gap:'16px',
      backdropFilter:'blur(14px)',
      WebkitBackdropFilter:'blur(14px)',
      boxShadow: failure ? `inset 0 0 40px ${col}0a` : 'none',
    }}>
      {/* Status */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
        <div style={{
          width:'14px', height:'14px', borderRadius:'50%', flexShrink:0,
          background:col, boxShadow:statusPulse,
          animation: failure ? 'blink 1.4s ease-in-out infinite' : 'pulse2 2s ease-in-out infinite',
        }}/>
        <div>
          <div style={{ fontSize:'20px', fontWeight:800, color:col, lineHeight:1.1,
            fontFamily:'Arial Black,sans-serif', letterSpacing:'-0.3px' }}>
            {prediction ? prediction.status : 'Connecting…'}
          </div>
          <div style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'3px', maxWidth:'420px', lineHeight:1.5 }}>
            {prediction?.explanation
              ? prediction.explanation.split('.')[0] + '.'
              : 'AutoHealAI AIOps Platform · Establishing connection…'}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
        {[
          { label:'ML Confidence', value: conf > 0 ? `${conf.toFixed(1)}%` : '—', col },
          { label:'CPU',     value: metrics ? `${metrics.cpu.toFixed(1)}%` : '—',     col: metrics?.cpu    > 80 ? '#ef4444' : 'var(--text-1)' },
          { label:'Memory',  value: metrics ? `${metrics.memory.toFixed(1)}%` : '—',  col: metrics?.memory > 85 ? '#ef4444' : 'var(--text-1)' },
          { label:'Latency', value: metrics ? `${metrics.latency.toFixed(0)}ms` : '—',col: metrics?.latency> 600? '#eab308' : 'var(--text-1)' },
          { label:'Updated', value: lastUpdate || '—', col: 'var(--text-2)' },
        ].map(s => (
          <div key={s.label} style={{
            padding:'8px 16px', borderRadius:'10px',
            background:'rgba(15,23,42,0.45)',
            border:'1px solid var(--border)',
            textAlign:'right', minWidth:'70px',
          }}>
            <div style={{ fontSize:'8.5px', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-3)', marginBottom:'3px' }}>{s.label}</div>
            <div style={{ fontSize:'16px', fontWeight:800, color:s.col as string, fontFamily:'Arial Black,sans-serif', letterSpacing:'-0.2px' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Pages ─────────────────────────────────────────────────────────── */
function OverviewPage({ metrics, prediction }: any) {
  return (
    <div className="animate-fadeUp">
      <SH icon={IconMetrics} title="System Health" sub="Live host metrics with real-time AI failure prediction" accent="#6366f1"/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        <MetricsPanel metrics={metrics}/>
        <PredictionPanel prediction={prediction}/>
      </div>
      <Div/>
      <SH icon={IconActions} title="Automated Recovery Actions" sub="Priority-ranked remediation steps queued by the AI decision engine" accent="#0f766e"/>
      <ActionsPanel prediction={prediction}/>
    </div>
  )
}

function AnalyticsPage({ history, prediction }: any) {
  return (
    <div className="animate-fadeUp">
      <SH icon={IconCharts} title="Real-Time Metrics" sub="Time-series charts — last 80 data points refreshed every 3 seconds" accent="#0891b2"/>
      <ChartsPanel history={history}/>
      <Div/>
      <SH icon={IconShap} title="SHAP Feature Attribution" sub="Per-feature contribution to the current ML prediction — why the model decided what it did" accent="#7c3aed"/>
      <ShapPanel shap={prediction?.shap ?? null} confidence={prediction?.confidence ?? 0}/>
      <Div/>
      <SH icon={IconModel} title="ML Ensemble Details" sub="Per-model probability breakdown and top feature importance ranking" accent="#0f766e"/>
      <ModelInfoPanel prediction={prediction}/>
    </div>
  )
}

function IncidentsPage({ incidents, ackIncident }: any) {
  const open   = incidents.filter((i: any) => !i.acknowledged).length
  const closed = incidents.filter((i: any) =>  i.acknowledged).length
  return (
    <div className="animate-fadeUp">
      <SH icon={IconList} title="Incident Timeline" sub="All detected failure events with root cause analysis and acknowledgement workflow" accent="#be123c"/>
      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Open Incidents',    value: open,                   col:'#f87171', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.22)'  },
          { label:'Acknowledged',      value: closed,                 col:'#4ade80', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.22)'  },
          { label:'Total Recorded',    value: incidents.length,       col:'#94a3b8', bg:'var(--bg-card-2)',      border:'var(--border)'         },
        ].map(s => (
          <div key={s.label} style={{
            padding:'16px 20px', borderRadius:'12px',
            background:s.bg, border:`1px solid ${s.border}`,
          }}>
            <div style={{ fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--text-3)', marginBottom:'6px' }}>{s.label}</div>
            <div style={{ fontSize:'28px', fontWeight:800, color:s.col, fontFamily:'Arial Black,sans-serif' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <IncidentsPanel incidents={incidents} onAck={ackIncident}/>
    </div>
  )
}

function DemoPage({ injectFault, clearFault, demoActive, demoFault }: any) {
  return (
    <div className="animate-fadeUp">
      <SH icon={IconFault} title="Demo Lab" sub="Inject fault overlays into the AI prediction pipeline — real monitoring data is never modified" accent="#dc2626"/>
      {/* Explainer */}
      <div style={{
        marginBottom:'28px', padding:'18px 22px', borderRadius:'14px',
        background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.2)',
        display:'flex', gap:'16px', alignItems:'flex-start',
      }}>
        <div style={{
          width:'36px', height:'36px', borderRadius:'9px', flexShrink:0,
          background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.28)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <IconFault size={16} color="#818cf8"/>
        </div>
        <div>
          <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text-1)', marginBottom:'5px' }}>How safe demo mode works</div>
          <p style={{ fontSize:'11px', color:'var(--text-2)', lineHeight:1.65, margin:0 }}>
            Each fault applies a metric overlay <strong style={{ color:'var(--text-1)' }}>only to the AI prediction pipeline</strong>.
            The ring buffer, SQLite database, and all charts continue showing real host data throughout.
            This mirrors production chaos engineering tools — inject at the signal level, never at the infrastructure level.
          </p>
        </div>
      </div>
      <div style={{ maxWidth:'540px' }}>
        <FaultInjectionPanel onInject={injectFault} onClear={clearFault} demoActive={demoActive} demoFault={demoFault}/>
      </div>
    </div>
  )
}

/* ─── Root ──────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const {
    metrics, history, prediction, incidents,
    connected, modelReady, groqReady,
    demoActive, demoFault, lastUpdate,
    ackIncident, injectFault, clearFault,
  } = useAutoHeal()

  const { isDark, toggle } = useTheme()
  const [active, setActive] = useState<NavPage>('overview')
  const [mini,   setMini]   = useState(false)
  const openIncidents = incidents.filter(i => !i.acknowledged).length

  return (
    <div className={cn('min-h-screen', isDark ? '' : 'light')}
      style={{ background:'var(--bg-page)', display:'flex' }}>

      <Sidebar
        active={active} setActive={setActive}
        connected={connected} openIncidents={openIncidents}
        isDark={isDark} onTheme={toggle}
        mini={mini} setMini={setMini}
      />

      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <TopBar
          active={active} demoActive={demoActive} demoFault={demoFault}
          openIncidents={openIncidents} modelReady={modelReady}
          connected={connected} setActive={setActive}
        />

        <div style={{ flex:1, overflowY:'auto', padding:'28px 32px 100px' }}>
          <HeroBar prediction={prediction} metrics={metrics} lastUpdate={lastUpdate}/>

          {active === 'overview'  && <OverviewPage  metrics={metrics} prediction={prediction}/>}
          {active === 'analytics' && <AnalyticsPage history={history} prediction={prediction}/>}
          {active === 'incidents' && <IncidentsPage incidents={incidents} ackIncident={ackIncident}/>}
          {active === 'demo'      && <DemoPage      injectFault={injectFault} clearFault={clearFault} demoActive={demoActive} demoFault={demoFault}/>}

          <div style={{ marginTop:'48px', paddingTop:'16px', borderTop:'1px solid var(--border)', textAlign:'center' }}>
            <p style={{ fontSize:'10px', color:'var(--text-3)', fontFamily:'Arial,sans-serif' }}>
              AutoHealAI v2.0 · Ensemble ML · SHAP · ARIA · FastAPI · Prometheus · SQLite
            </p>
          </div>
        </div>
      </main>

      <ChatWidget groqReady={groqReady}/>
    </div>
  )
}