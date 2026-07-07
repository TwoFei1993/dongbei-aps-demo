'use client'
import { useEffect } from 'react'
import type { AgentCardData } from '../data/OverviewAgentData'

export function AgentDetailModal({
  agent, color, onClose,
}: { agent: AgentCardData | null; color: string; onClose: () => void }) {
  useEffect(() => {
    if (!agent) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [agent, onClose])

  if (!agent) return null
  const Icon = agent.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
      >
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-card-border)' }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}18`, color }}
          >
            <Icon size={18} />
          </div>
          <h3 className="flex-1 text-sm font-bold" style={{ color: 'var(--color-text-title)' }}>
            {agent.title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-lg leading-none transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-wrap gap-1.5">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {agent.detail && (
            <>
              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                  基本信息
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                  {agent.detail.overview}
                </p>
              </div>

              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                  运作流程
                </div>
                <ol className="flex flex-col gap-2">
                  {agent.detail.workflow.map((step, idx) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
