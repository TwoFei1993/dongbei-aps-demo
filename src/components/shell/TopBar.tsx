'use client'
import { loadGlobalKpi } from '@/lib/data-loader'

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
          <span
            key={k.label}
            className="flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] whitespace-nowrap"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span className="font-bold text-white">
              {k.direction === 'up' ? '↑' : '↓'}{k.value}
            </span>
            <span className="opacity-75">{k.label}</span>
          </span>
        ))}
      </div>
    </header>
  )
}
