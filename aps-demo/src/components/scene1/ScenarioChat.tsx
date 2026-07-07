'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { streamMinimaxChat, type ChatMessage } from '@/lib/minimax'
import { MdContent } from '@/components/shared/MdContent'

const SYSTEM_PROMPT = `你是东北特钢智能订单评审系统中的方案讨论助手，正在与计划人员讨论"产能利用率最优 / 吨钢毛利最优 / 战略客户交付最优"三个订单组合情景方案。
请结合雷达图中的吨钢毛利、产能利用率、战略客户交期、整体交付率、库存水平等维度，用简洁专业的中文分析各情景的取舍，并在被问到时给出选型建议。`

const SEED_MESSAGES: ChatMessage[] = [
  { role: 'user', content: '这三个情景方案，从毛利角度看应该选哪个？' },
  {
    role: 'assistant',
    content:
      '从雷达图看，**吨钢毛利最优**情景在毛利维度达到 95 分，明显领先另外两个方案，但战略客户交期只有 72 分，若近期有重点客户订单需要保交付，可能会有履约风险。',
  },
  { role: 'user', content: '那如果这个月产能比较紧张，应该怎么权衡？' },
  {
    role: 'assistant',
    content:
      '产能紧张的情况下建议参考**产能利用率最优**情景，该方案产能利用率达 91 分，能更充分消化现有产能，但吨钢毛利会降到 70 分左右，需要和销售端确认是否能接受这部分利润损失。',
  },
]

const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
)
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
)

export function ScenarioChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const history: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setStreaming(true)
    setMessages([...history, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()
    try {
      await streamMinimaxChat({
        systemPrompt: SYSTEM_PROMPT,
        history,
        signal: abortRef.current.signal,
        onDelta: (acc) => setMessages([...history, { role: 'assistant', content: acc }]),
      })
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
    <div
      className="rounded-xl p-4 flex flex-col"
      style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <IconChat />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
          情景方案讨论
        </h3>
        <span className="ml-auto text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
          MiniMax-M3
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: 280 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed"
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
                <MdContent content={m.content} isStreaming={streaming && i === messages.length - 1} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="mt-3 flex items-center gap-2 pt-3"
        style={{ borderTop: '1px solid var(--color-card-border)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() } }}
          placeholder="针对三情景方案提问…"
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
  )
}
