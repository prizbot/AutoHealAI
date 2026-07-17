'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/src/lib/utils'
import type { ChatMessage } from '@/src/types'

interface Props { groqReady: boolean }

type Gender = 'neutral' | 'female' | 'male'

const AI_NAME = 'ARIA'
const AI_FULL = 'Autonomous Response Intelligence Assistant'

const SUGGESTIONS = [
  'Why is the system failing?',
  'Explain the SHAP features',
  'What recovery actions should I take?',
  'How critical is this incident?',
]

/* ── Avatars ──────────────────────────────────────────────────────────── */
function AvatarNeutral({ size = 48, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgN" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#4f46e5"/>
        </radialGradient>
      </defs>
      {pulse && <circle cx="24" cy="24" r="23" fill="#818cf8" fillOpacity="0.25"/>}
      <circle cx="24" cy="24" r="22" fill="url(#bgN)"/>
      <path d="M24 8l6 3.5v7L24 22l-6-3.5v-7L24 8z" fill="white" fillOpacity="0.18"/>
      <circle cx="24" cy="20" r="7" fill="white" fillOpacity="0.92"/>
      <circle cx="21.5" cy="19" r="1.2" fill="#4f46e5"/>
      <circle cx="26.5" cy="19" r="1.2" fill="#4f46e5"/>
      <circle cx="22" cy="18.5" r="0.4" fill="white"/>
      <circle cx="27" cy="18.5" r="0.4" fill="white"/>
      <path d="M21 22c1 1.2 5 1.2 6 0" stroke="#4f46e5" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
      <path d="M15 36c0-5 4-8 9-8s9 3 9 8" fill="white" fillOpacity="0.85"/>
      <path d="M6 24h3M39 24h3M24 6v3M24 39v3" stroke="white" strokeWidth="0.8" strokeOpacity="0.45" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"/>
    </svg>
  )
}

function AvatarFemale({ size = 48, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgF" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#db2777"/>
        </radialGradient>
      </defs>
      {pulse && <circle cx="24" cy="24" r="23" fill="#f472b6" fillOpacity="0.25"/>}
      <circle cx="24" cy="24" r="22" fill="url(#bgF)"/>
      <ellipse cx="24" cy="15" rx="9" ry="6" fill="white" fillOpacity="0.88"/>
      <ellipse cx="14" cy="20" rx="3" ry="7" fill="white" fillOpacity="0.78"/>
      <ellipse cx="34" cy="20" rx="3" ry="7" fill="white" fillOpacity="0.78"/>
      <circle cx="24" cy="21" r="7" fill="white" fillOpacity="0.95"/>
      <ellipse cx="21.5" cy="20" rx="1.4" ry="1.6" fill="#db2777"/>
      <ellipse cx="26.5" cy="20" rx="1.4" ry="1.6" fill="#db2777"/>
      <circle cx="22" cy="19.3" r="0.45" fill="white"/>
      <circle cx="27" cy="19.3" r="0.45" fill="white"/>
      <path d="M20 18l-0.6-0.9M21.5 17.7v-1M23 18l0.5-0.9" stroke="#db2777" strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M25 18l-0.5-0.9M26.5 17.7v-1M28 18l0.6-0.9" stroke="#db2777" strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M21 23c1 1.4 5 1.4 6 0" stroke="#db2777" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
      <path d="M14 37c0-5 4.5-8 10-8s10 3 10 8" fill="white" fillOpacity="0.85"/>
      <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"/>
    </svg>
  )
}

function AvatarMale({ size = 48, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgM" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#059669"/>
        </radialGradient>
      </defs>
      {pulse && <circle cx="24" cy="24" r="23" fill="#34d399" fillOpacity="0.25"/>}
      <circle cx="24" cy="24" r="22" fill="url(#bgM)"/>
      <path d="M15 18c0-6 18-6 18 0v2H15v-2z" fill="white" fillOpacity="0.85"/>
      <circle cx="24" cy="21" r="7.5" fill="white" fillOpacity="0.95"/>
      <circle cx="21.5" cy="20" r="1.4" fill="#059669"/>
      <circle cx="26.5" cy="20" r="1.4" fill="#059669"/>
      <circle cx="22" cy="19.4" r="0.45" fill="white"/>
      <circle cx="27" cy="19.4" r="0.45" fill="white"/>
      <path d="M20 17.7c0.7-0.5 2-0.5 3 0" stroke="#059669" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M25 17.7c0.7-0.5 2-0.5 3 0" stroke="#059669" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M21.5 23.2c0.8 1 4.2 1 5 0" stroke="#059669" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
      <path d="M13 37c0-5 5-8 11-8s11 3 11 8" fill="white" fillOpacity="0.85"/>
      <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"/>
    </svg>
  )
}

function Avatar({ gender, size = 48, pulse = false }: { gender: Gender; size?: number; pulse?: boolean }) {
  if (gender === 'female') return <AvatarFemale size={size} pulse={pulse}/>
  if (gender === 'male')   return <AvatarMale   size={size} pulse={pulse}/>
  return <AvatarNeutral size={size} pulse={pulse}/>
}

/* ── Orb button ─────────────────────────────────────────────────────────── */
function ChatOrb({ gender, onClick }: { gender: Gender; onClick: () => void }) {
  const grad = {
    neutral: { a: '#6366f1', b: '#7c3aed' },
    female:  { a: '#ec4899', b: '#db2777' },
    male:    { a: '#10b981', b: '#059669' },
  }[gender]

  return (
    <button onClick={onClick}
      className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none"
      style={{ background: `linear-gradient(135deg, ${grad.a}, ${grad.b})` }}
      title={`Chat with ${AI_NAME}`}>
      <span className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: grad.a }}/>
      <span className="absolute inset-0 rounded-full animate-pulse2 opacity-10"
        style={{ background: grad.b }}/>
      <Avatar gender={gender} size={40}/>
    </button>
  )
}

/* ── Typing dots ────────────────────────────────────────────────────────── */
function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0,1,2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full animate-blink"
          style={{ background: color, animationDelay: `${i * 0.18}s`, opacity: 0.7 }}/>
      ))}
    </div>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function ChatWidget({ groqReady }: Props) {
  const [open,     setOpen]     = useState(false)
  const [gender,   setGender]   = useState<Gender>('neutral')
  const [showPick, setShowPick] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const accent = { neutral: '#6366f1', female: '#ec4899', male: '#10b981' }[gender]

  // Set greeting when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: groqReady
          ? `Hi there! I'm ${AI_NAME} — your AI SRE. I have real-time visibility into your metrics and ML predictions. What would you like to know?`
          : `Hi! I'm ${AI_NAME}. To enable me, add your free Groq key to autoheal_ai_v2/.env:\n\nGROQ_API_KEY=gsk_your_key_here\n\nGet a free key at https://console.groq.com`,
      }])
    }
  }, [open, groqReady])

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages, loading, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const send = useCallback(async (text: string) => {
    const msg = text.trim()
    if (!msg || loading || !groqReady) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages.slice(-8) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error — is the backend running on port 8000?',
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, groqReady])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">

      {/* Chat window */}
      <div
        className="w-[370px] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid var(--border)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          maxHeight: 580,
          transformOrigin: 'bottom right',
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(16px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
        }}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}/>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 border-b"
          style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-shrink-0">
            <Avatar gender={gender} size={42} pulse={loading}/>
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{
                background: groqReady ? '#22c55e' : '#94a3b8',
                borderColor: 'var(--bg-card)',
              }}/>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>{AI_NAME}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>
                {gender}
              </span>
            </div>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-3)' }}>{AI_FULL}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowPick(p => !p)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors hover:scale-110"
              style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)' }}
              title="Choose avatar style">
              👤
            </button>
            <button onClick={() => { setOpen(false); setShowPick(false) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
              style={{ background: 'var(--bg-card-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Gender picker */}
        {showPick && (
          <div className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0"
            style={{ background: 'var(--bg-card-2)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
              style={{ color: 'var(--text-3)' }}>Avatar</span>
            {(['neutral','female','male'] as Gender[]).map(g => (
              <button key={g} onClick={() => { setGender(g); setShowPick(false) }}
                className="flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all"
                style={{
                  border: `1px solid ${gender === g ? accent : 'var(--border)'}`,
                  background: gender === g ? `${accent}18` : 'transparent',
                  transform: gender === g ? 'scale(1.05)' : 'scale(1)',
                  opacity: gender === g ? 1 : 0.6,
                }}>
                <Avatar gender={g} size={30}/>
                <span className="text-[9px] font-semibold capitalize"
                  style={{ color: gender === g ? accent : 'var(--text-3)' }}>{g}</span>
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ minHeight: 180, maxHeight: 300 }}>
          {messages.map((m, i) => (
            <div key={i} className={cn('flex gap-2 items-end', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && <Avatar gender={gender} size={24}/>}
              <div className="max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed"
                style={m.role === 'user'
                  ? { background: accent, color: 'white', borderRadius: '16px 4px 16px 16px' }
                  : { background: 'var(--bg-card-2)', color: 'var(--text-1)',
                      border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px' }
                }>
                {m.content.split('\n').map((line, j) =>
                  line === '' ? <div key={j} className="h-1.5"/> :
                  <p key={j}>{line}</p>
                )}
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: accent }}>U</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-end">
              <Avatar gender={gender} size={24}/>
              <div className="rounded-2xl px-3 py-2"
                style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px' }}>
                <TypingDots color={accent}/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Suggestion chips */}
        {groqReady && messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-[10px] px-2.5 py-1 rounded-full transition-colors"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 items-end px-3 pb-3 pt-1 flex-shrink-0 border-t"
          style={{ borderColor: 'var(--border)' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={groqReady ? `Ask ${AI_NAME} anything… (Enter)` : 'Add GROQ_API_KEY to enable'}
            disabled={loading || !groqReady}
            rows={1}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-[13px] focus:outline-none transition-all"
            style={{
              background: 'var(--bg-card-2)',
              color: 'var(--text-1)',
              border: `1px solid ${input && groqReady ? accent + 'aa' : 'var(--border)'}`,
              maxHeight: 90, overflowY: 'auto',
              opacity: !groqReady ? 0.5 : 1,
            }}
          />
          <button onClick={() => send(input)}
            disabled={!input.trim() || loading || !groqReady}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={{
              background: input.trim() && !loading && groqReady ? accent : 'var(--bg-card-2)',
              color: input.trim() && !loading && groqReady ? 'white' : 'var(--text-3)',
              border: '1px solid var(--border)',
            }}>
            {loading
              ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
              : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor"/></svg>
            }
          </button>
        </div>

        <p className="text-center text-[9px] pb-2 flex-shrink-0" style={{ color: 'var(--text-3)' }}>
          {AI_NAME} · Groq · Llama 3.3 70B · Free tier
        </p>
      </div>

      {/* Orb */}
      {!open
        ? <ChatOrb gender={gender} onClick={() => setOpen(true)}/>
        : (
          <button onClick={() => setOpen(false)}
            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: accent }}>
            ✕
          </button>
        )
      }
    </div>
  )
}