import { loadFurnaceModel } from '@/lib/data-loader'
import type { ImprovementMetric } from '@/types'

function MetricCard({ metric }: { metric: ImprovementMetric }) {
  const isPositive = metric.improvement.startsWith('+')
  return (
    <div
      className="rounded-xl p-4 space-y-2"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
      }}
    >
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {metric.label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: isPositive ? 'var(--color-positive)' : 'var(--color-primary)' }}
      >
        {metric.improvement}
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {metric.before}{metric.unit} → {metric.after}{metric.unit}
      </p>
    </div>
  )
}

export function ImproveCards() {
  const model = loadFurnaceModel()
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {model.improvements.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  )
}
