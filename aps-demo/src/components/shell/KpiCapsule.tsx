import type { GlobalKpi } from '@/types'

interface KpiCapsuleProps {
  kpi: GlobalKpi
}

export function KpiCapsule({ kpi }: KpiCapsuleProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs"
      style={{
        backgroundColor: 'var(--color-topbar-pill-bg)',
        color: 'var(--color-topbar-pill-text)',
      }}
    >
      <span className="font-bold">
        {kpi.direction === 'up' ? '↑' : '↓'}{kpi.value}
      </span>
      <span className="opacity-75">{kpi.label}</span>
    </div>
  )
}
