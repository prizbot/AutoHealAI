// import { cn } from '@/src/lib/utils'

// interface CardProps {
//   children: React.ReactNode
//   className?: string
//   glow?: 'green'|'red'|'yellow'|'indigo'|'none'
// }

// export function Card({ children, className, glow = 'none' }: CardProps) {
//   return (
//     <div className={cn('glass rounded-2xl p-5 transition-all duration-300',
//       glow !== 'none' && `glow-${glow}`, className)}>
//       {children}
//     </div>
//   )
// }

// export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
//   return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
// }

// export function CardTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
//   return (
//     <h3 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
//       style={{ color: 'var(--text-3)' }}>
//       {icon && <span className="text-base leading-none">{icon}</span>}
//       {children}
//     </h3>
//   )
// }

import { cn } from '@/src/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: 'green' | 'red' | 'yellow' | 'indigo' | 'none'
}

export function Card({ children, className, glow = 'none' }: CardProps) {
  const glowStyle = {
    green:  '0 0 0 1px rgba(34,197,94,0.2), 0 8px 32px rgba(34,197,94,0.08)',
    red:    '0 0 0 1px rgba(239,68,68,0.22), 0 8px 32px rgba(239,68,68,0.10)',
    yellow: '0 0 0 1px rgba(234,179,8,0.22), 0 8px 32px rgba(234,179,8,0.08)',
    indigo: '0 0 0 1px rgba(99,102,241,0.22), 0 8px 32px rgba(99,102,241,0.08)',
    none:   '0 1px 3px rgba(0,0,0,0.12)',
  }[glow]

  return (
    <div
      className={cn('rounded-2xl p-5 transition-all duration-300', className)}
      style={{
        background:    'var(--bg-card)',
        border:        '1px solid var(--border)',
        boxShadow:     glowStyle,
        backdropFilter:'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-3)' }}>
        {children}
      </h3>
    </div>
  )
}