'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { cn } from '@/src/lib/utils'
import type { ChatMessage } from '@/src/types'

interface Props { groqReady: boolean }

const SUGGESTIONS = [
  'Why is the system failing right now?',
  'Explain the top SHAP features',
  'What should I do about this crash loop?',
  'How serious is this incident?',
]

const OFFLINE_MSG: ChatMessage = {
  role: 'assistant',
  content:
    "AI assistant is offline. Add your free Groq API key to `.env` to enable me.\n\n" +
    "Steps:\n" +
    "1. Visit https://console.groq.com (free, no credit card)\n" +
    "2. Create an API key\n" +
    "3. Add to autoheal_ai_v2/.env:\n" +
    "   GROQ_API_KEY=gsk_your_key_here\n" +
    "4. Restart the backend",
}

const ONLINE_MSG: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm AutoHealAI's SRE assistant powered by Llama 3.3 70B. " +
    "I can see your live metrics and ML predictions. " +
    "Ask me anything about your system's health.",
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-blink"
          style={{ animationDelay: i * 0.2 + 's' }} />
      ))}
    </div>
  )
}

export function ChatPanel({ groqReady }: Props) {
  const [messages,  setMessages]  = useState<ChatMessage[]>([])
  const [initiated, setInitiated] = useState(false)
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [expanded,  setExpanded]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initiated) return
    const timer = setTimeout(() => {
      setMessages([groqReady ? ONLINE_MSG : OFFLINE_MSG])
      setInitiated(true)
    }, 3200)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initiated) return
    setMessages(prev => {
      if (prev.length === 1 && prev[0].content === OFFLINE_MSG.content && groqReady) {
        return [ONLINE_MSG]
      }
      return prev
    })
  }, [groqReady, initiated])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async (text: string) => {
    const msg = text.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = messages.slice(-8)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
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
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const chatHeight = expanded ? 'h-[520px]' : 'h-[360px]'

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle icon="💬">AI SRE Assistant</CardTitle>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full border font-semibold',
            groqReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          )}>
            {groqReady ? '● Llama 3.3 70B' : '○ Offline'}
          </span>
          <button onClick={() => setExpanded(e => !e)}
            className="text-[10px] text-[var(--text-3)] hover:text-[var(--text-2)] px-1.5 py-0.5 rounded border border-[var(--border)] transition-colors">
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </CardHeader>

      <div className={cn('flex-1 overflow-y-auto space-y-3 pr-1 mb-3', chatHeight)}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-20 text-[var(--text-3)] text-xs">
            Connecting to backend…
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] mr-2 mt-0.5 flex-shrink-0 text-white font-bold">
                AI
              </div>
            )}
            <div className={cn(
              'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed animate-fadeUp',
              m.role === 'user'
                ? 'bg-indigo-600/80 text-white rounded-tr-sm'
                : 'bg-slate-800/70 border border-slate-700/40 text-[var(--text-1)] rounded-tl-sm',
            )}>
              {m.content.split('\n').map((line, j) => (
                line === '' ? <div key={j} className="h-1.5" /> : <p key={j}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] mr-2 mt-0.5 text-white font-bold">AI</div>
            <div className="bg-slate-800/70 border border-slate-700/40 rounded-2xl rounded-tl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {groqReady && messages.length <= 2 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-[10px] px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={groqReady ? 'Ask about your system… (Enter to send)' : 'Configure GROQ_API_KEY to enable'}
          disabled={loading || !groqReady}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-slate-900/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm',
            'text-[var(--text-1)] placeholder:text-[var(--text-3)]',
            'focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-colors',
            (!groqReady || loading) && 'opacity-50 cursor-not-allowed',
          )}
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !groqReady || !input.trim()}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
            input.trim() && groqReady && !loading
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-slate-800/60 text-slate-600 cursor-not-allowed',
          )}
        >
          {loading
            ? <span className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor" /></svg>
          }
        </button>
      </div>

      <p className="text-[9px] text-[var(--text-3)] text-center mt-2">
        Powered by Groq · llama-3.3-70b-versatile · Free tier
      </p>
    </Card>
  )
}