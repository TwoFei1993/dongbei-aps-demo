'use client'
import { loadGlobalKpi } from '@/lib/data-loader'
import { KpiCapsule } from './KpiCapsule'

const kpis = loadGlobalKpi()

export function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center gap-4 px-4"
      style={{ backgroundColor: 'var(--color-topbar)' }}
    >
      <span className="text-sm font-bold tracking-wide text-white whitespace-nowrap">
        东北特钢 APS 智能排产
      </span>
      <div className="flex flex-1 gap-2 overflow-hidden">
        {kpis.map((k) => (
          <KpiCapsule key={k.label} kpi={k} />
        ))}
      </div>
    </header>
  )
}
