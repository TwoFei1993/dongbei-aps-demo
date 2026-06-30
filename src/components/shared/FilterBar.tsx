'use client'

import { useAppStore } from '@/lib/store'

const TIME_RANGES = ['当月', '3个月', '6个月', '全年']

const PRODUCT_LINES = [
  '全部',
  '大型材',
  '小型材',
  '模具钢',
  '商品锭坯',
  '锻钢',
  '银亮材',
  '钢丝',
  '线材',
  '精密',
  '特冶',
]

export function FilterBar() {
  const { timeRange, productLine, setTimeRange, setProductLine } = useAppStore()

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-xl px-4 py-3"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
      }}
    >
      {/* Time range buttons */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          时间范围
        </span>
        <div className="flex gap-1">
          {TIME_RANGES.map((t) => {
            const active = timeRange === t
            return (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className="rounded-lg px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: active
                    ? 'var(--color-primary)'
                    : 'var(--color-primary-light)',
                  color: active ? '#fff' : 'var(--color-primary)',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-5 w-px"
        style={{ backgroundColor: 'var(--color-card-border)' }}
      />

      {/* Product line select */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          产品线
        </span>
        <select
          value={productLine}
          onChange={(e) => setProductLine(e.target.value)}
          className="rounded-lg px-3 py-1 text-xs font-medium outline-none"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          {PRODUCT_LINES.map((pl) => (
            <option key={pl} value={pl}>
              {pl}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
