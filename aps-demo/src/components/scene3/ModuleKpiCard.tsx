'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ModuleKpiItem } from '@/types'

interface ModuleKpiCardProps {
  title: string
  subtitle: string
  color: string
  href?: string
  kpis: ModuleKpiItem[]
}

function MiniKpi({ item, color }: { item: ModuleKpiItem; color: string }) {
  const isPositive = item.trend?.startsWith('+') || item.trend?.startsWith('↑')
  const isNegative = item.trend?.startsWith('-') || item.trend?.startsWith('↓')
  const trendColor = isPositive
    ? 'var(--color-positive)'
    : isNegative
    ? 'var(--color-danger)'
    : 'var(--color-text-muted)'

  return (
    <div
      className="rounded-lg p-3"
      style={{ backgroundColor: 'var(--color-bg)', border: `1px solid ${color}33` }}
    >
      <div className="mb-1 text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
        {item.label}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-xl font-bold leading-none" style={{ color: 'var(--color-text-title)' }}>
          {item.value}
        </span>
        {item.unit && (
          <span className="mb-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {item.unit}
          </span>
        )}
      </div>
      {item.trend && (
        <div className="mt-1 text-xs font-medium" style={{ color: trendColor }}>
          {item.trend}
        </div>
      )}
    </div>
  )
}

export function ModuleKpiCard({ title, subtitle, color, href, kpis }: ModuleKpiCardProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? kpis : kpis.slice(0, 2)

  return (
    <div
      className="rounded-xl p-4 flex flex-col"
      style={{ backgroundColor: 'var(--color-card-bg)', border: `1px solid ${color}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
              {title}
            </h3>
          </div>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
            {href && (
              <>
                {' '}
                ·{' '}
                <Link href={href} className="underline" style={{ color }}>
                  查看详情
                </Link>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors"
          style={{ color, border: `1px solid ${color}66` }}
        >
          {expanded ? '收起' : `展开全部 (${kpis.length})`}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {visible.map((item) => (
          <MiniKpi key={item.label} item={item} color={color} />
        ))}
      </div>
    </div>
  )
}
