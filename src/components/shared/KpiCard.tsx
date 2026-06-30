// src/components/shared/KpiCard.tsx

interface KpiCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: string
}

export function KpiCard({ label, value, unit, trend }: KpiCardProps) {
  const isPositive = trend?.startsWith('+') || trend?.startsWith('↑')
  const isNegative = trend?.startsWith('-') || trend?.startsWith('↓')

  const trendColor = isPositive
    ? 'var(--color-positive)'
    : isNegative
    ? 'var(--color-danger)'
    : 'var(--color-text-muted)'

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
      }}
    >
      <div
        className="mb-1 text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </div>
      <div className="flex items-end gap-1">
        <span
          className="text-2xl font-bold leading-none"
          style={{ color: 'var(--color-text-title)' }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="mb-0.5 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <div
          className="mt-1 text-xs font-medium"
          style={{ color: trendColor }}
        >
          {trend}
        </div>
      )}
    </div>
  )
}
