const API_KEY =
  'sk-cp-ihhjmyj48ttkXIyeu7NsXSNXXmJxM48gIZWFuAp-oOzu8qJ6eeSWjzJaKYMFyZybdH4xaN0VNteP4qZa7BM8dHMY3iDnBdw-ohVpkL8JO0B_2lzpfUQfSw0'
const API_URL = 'https://api.minimaxi.com/v1/chat/completions'
const MODEL = 'MiniMax-M3'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Strip <think>…</think> blocks (including incomplete ones while streaming)
export function stripThink(text: string): string {
  let s = text.replace(/<think>[\s\S]*?<\/think>/g, '')
  s = s.replace(/<think>[\s\S]*$/, '')
  return s.trim()
}

interface StreamChatOptions {
  systemPrompt: string
  history: ChatMessage[]
  signal: AbortSignal
  onDelta: (accumulated: string) => void
}

export async function streamMinimaxChat({ systemPrompt, history, signal, onDelta }: StreamChatOptions): Promise<void> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    signal,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
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
        onDelta(acc)
      } catch { /* skip malformed SSE lines */ }
    }
  }
}
