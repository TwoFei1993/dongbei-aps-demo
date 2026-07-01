import { KpiCardsRow } from '@/components/shared/KpiCardsRow'
import { PyramidArch } from '@/components/overview/PyramidArch'
import { BusinessFlow } from '@/components/overview/BusinessFlow'

const KPI_CARDS = [
  {
    label: '交付准时率提升',
    value: '8~10',
    unit: '%',
    trend: '↑ 目标提升',
  },
  {
    label: '排程效率提升',
    value: '50~70',
    unit: '%',
    trend: '↓ 50~70% 时间节省',
  },
  {
    label: '综合成本降低',
    value: '15~20',
    unit: '%',
    trend: '↓ 目标降低',
  },
  {
    label: 'OEE 综合效率提升',
    value: '6~8',
    unit: '%',
    trend: '↑ 目标提升',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-title)' }}>
          APS 系统架构总览
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          东北特钢智能高级计划与排程系统 — 四层架构体系
        </p>
      </div>

      <KpiCardsRow cards={KPI_CARDS} />

      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            四层架构体系
          </h2>
          <PyramidArch />
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            业务流程导航
          </h2>
          <BusinessFlow />
        </div>
      </div>
    </div>
  )
}
