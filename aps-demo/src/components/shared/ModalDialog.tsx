'use client'
import { useEffect, type ReactNode } from 'react'

interface ModalDialogProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  title: string
  children: ReactNode
}

export function ModalDialog({ open, onClose, onApply, title, children }: ModalDialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-card-border)' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-lg leading-none transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">{children}</div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--color-card-border)' }}
        >
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-text-body)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            取消
          </button>
          <button
            onClick={() => { onApply(); onClose() }}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          >
            应用
          </button>
        </div>
      </div>
    </div>
  )
}
