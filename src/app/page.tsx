import { KpiCard } from '@/components/shared/KpiCard'
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
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-title)' }}
        >
          APS 系统架构总览
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          东北特钢智能高级计划与排程系统 — 四层架构体系
        </p>
      </div>

      {/* KPI targets section */}
      <section>
        <h2
          className="mb-3 text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          目标指标
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {KPI_CARDS.map((card) => (
            <KpiCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Four-layer pyramid */}
      <section>
        <h2
          className="mb-3 text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          四层架构体系
        </h2>
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <PyramidArch />
        </div>
      </section>

      {/* Business flow diagram */}
      <section>
        <h2
          className="mb-3 text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          业务流程导航
        </h2>
        <div
          className="flex justify-center rounded-2xl p-8"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <BusinessFlow />
        </div>
      </section>
    </div>
  )
}
