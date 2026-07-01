'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const API_KEY =
  'sk-cp-ihhjmyj48ttkXIyeu7NsXSNXXmJxM48gIZWFuAp-oOzu8qJ6eeSWjzJaKYMFyZybdH4xaN0VNteP4qZa7BM8dHMY3iDnBdw-ohVpkL8JO0B_2lzpfUQfSw0'
const API_URL = 'https://api.minimax.chat/v1/chat/completions'
const MODEL = 'MiniMax-M3'

const SYSTEM_PROMPT = `你是东北特钢 APS 智能排产系统的 AI 助手，精通钢铁生产计划、跨工序排程优化、库存管理与客户服务履约分析。
请用简洁专业的中文回答问题，适当引用系统中的指标（如 OTIF、合同完成率、排产损失等）来辅助说明。`

// Strip <think>…</think> blocks (including incomplete ones while streaming)
function stripThink(text: string): string {
  // Remove complete think blocks
  let s = text.replace(/<think>[\s\S]*?<\/think>/g, '')
  // Remove incomplete think block still being streamed
  s = s.replace(/<think>[\s\S]*$/, '')
  return s.trim()
}

interface Message {
  role: 'user' | 'assistant'
  content: string // raw (may contain think blocks)
}

const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
)
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
)

// Markdown renderer for assistant messages
function MdContent({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  const visible = stripThink(content)
  return (
    <span className="prose-ai">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold" style={{ color: 'var(--color-text-title)' }}>{children}</strong>,
          ul: ({ children }) => <ul className="my-1 ml-3 list-disc space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 ml-3 list-decimal space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded border" style={{ borderColor: 'var(--color-card-border)' }}>
              <table className="w-full text-[10px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead style={{ backgroundColor: 'var(--color-primary-light)' }}>{children}</thead>,
          th: ({ children }) => <th className="px-2 py-1 text-left font-semibold" style={{ color: 'var(--color-text-title)' }}>{children}</th>,
          td: ({ children }) => <td className="border-t px-2 py-1" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-body)' }}>{children}</td>,
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            return isBlock
              ? <code className="block my-1 rounded p-2 text-[10px] font-mono leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-topbar)', color: '#93c5fd' }}>{children}</code>
              : <code className="rounded px-1 font-mono" style={{ backgroundColor: 'rgba(74,124,220,0.12)', color: 'var(--color-primary)' }}>{children}</code>
          },
        }}
      >
        {visible}
      </ReactMarkdown>
      {isStreaming && (
        <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-current align-middle opacity-70" />
      )}
    </span>
  )
}

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const history: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setStreaming(true)
    setMessages([...history, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          max_tokens: 2048,
        }),
      })

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          const t = line.replace(/^data:\s*/, '').trim()
          if (!t || t === '[DONE]') continue
          try {
            const delta = JSON.parse(t).choices?.[0]?.delta?.content ?? ''
            acc += delta
            setMessages([...history, { role: 'assistant', content: acc }])
          } catch { /* skip malformed SSE lines */ }
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setMessages([...history, { role: 'assistant', content: '⚠️ 请求失败，请检查网络连接。' }])
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [input, messages, streaming])

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '关闭 AI 助手' : '打开 AI 助手'}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
      >
        {open ? <IconClose /> : <IconChat />}
      </button>

      {/* 对话面板 */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 380,
            height: 520,
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: 'var(--color-topbar)' }}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
                <path d="M2 20a10 10 0 0 1 16.5-7.5"/>
                <circle cx="18" cy="18" r="4"/><path d="m20 16-2 2-1-1"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-none">APS 智能助手</p>
              <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>MiniMax-M3 · 东北特钢</p>
            </div>
            <div className="ml-auto flex h-2 w-2 shrink-0 rounded-full bg-emerald-400" title="在线" />
          </div>

          {/* 消息区 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                  <IconChat />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  你好！我是 APS 智能助手<br />可以询问生产排程、指标分析等问题
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    m.role === 'user'
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                      : {
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-text-body)',
                          border: '1px solid var(--color-card-border)',
                        }
                  }
                >
                  {m.role === 'user' ? (
                    <span className="whitespace-pre-wrap break-words">{m.content}</span>
                  ) : m.content === '' && streaming && i === messages.length - 1 ? (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : (
                    <MdContent
                      content={m.content}
                      isStreaming={streaming && i === messages.length - 1}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区 */}
          <div
            className="flex items-center gap-2 px-3 py-2.5"
            style={{ borderTop: '1px solid var(--color-card-border)' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() } }}
              placeholder="询问排程策略、指标分析…"
              disabled={streaming}
              className="flex-1 rounded-lg px-3 py-2 text-xs outline-none disabled:opacity-60"
              style={{
                backgroundColor: 'var(--color-content-bg)',
                color: 'var(--color-text-body)',
                border: '1px solid var(--color-card-border)',
              }}
            />
            <button
              onClick={() => void send()}
              disabled={!input.trim() || streaming}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              aria-label="发送"
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
