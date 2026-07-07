'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { stripThink } from '@/lib/minimax'

export function MdContent({ content, isStreaming }: { content: string; isStreaming: boolean }) {
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
