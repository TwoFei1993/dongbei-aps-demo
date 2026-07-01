'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface KpiCardData {
  label: string
  value: string | number
  unit?: string
  trend?: string
}

export function KpiCardsRow({ cards }: { cards: KpiCardData[] }) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rowRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const items = Array.from(rowRef.current.querySelectorAll('.kpi-card'))
    if (!items.length) return
    gsap.set(items, { opacity: 0, y: 24 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: { each: 0.1, from: 'start' },
    })
  }, [])

  return (
    <div ref={rowRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const isPositive = card.trend?.startsWith('+') || card.trend?.startsWith('↑')
        const isNegative = card.trend?.startsWith('-') || card.trend?.startsWith('↓')
        const trendColor = isPositive
          ? 'var(--color-positive)'
          : isNegative
          ? 'var(--color-danger)'
          : 'var(--color-text-muted)'

        return (
          <div
            key={card.label}
            className="kpi-card rounded-xl p-4"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            <div className="mb-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {card.label}
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold leading-none" style={{ color: 'var(--color-text-title)' }}>
                {card.value}
              </span>
              {card.unit && (
                <span className="mb-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {card.unit}
                </span>
              )}
            </div>
            {card.trend && (
              <div className="mt-1 text-xs font-medium" style={{ color: trendColor }}>
                {card.trend}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
