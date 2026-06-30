// src/app/scene3/page.tsx
import { FilterBar } from '@/components/shared/FilterBar'
import { KpiCard } from '@/components/shared/KpiCard'
import { DemandAccuracy } from '@/components/scene3/demand/DemandAccuracy'
import { OtifChart } from '@/components/scene3/service/OtifChart'
import { InventoryHeatmap } from '@/components/scene3/inventory/InventoryHeatmap'
import { PlanExecution } from '@/components/scene3/production/PlanExecution'
import { loadKpiService, loadKpiProduction } from '@/lib/data-loader'

export default function Scene3Page() {
  const service = loadKpiService()
  const latest = service[service.length - 1]

  const prod = loadKpiProduction()
  // Aggregate totals across all product lines
  const totalContractCount = prod.reduce((sum, p) => sum + p.contractCount, 0)
  const totalContractTons = prod.reduce((sum, p) => sum + p.contractTons, 0)
  const totalBacklogTons = prod.reduce((sum, p) => sum + p.backlogTons, 0)
  const avgCompletionRate =
    prod.reduce((sum, p) => sum + p.completionRate, 0) / prod.length

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-title)' }}
        >
          场景 03 · 多维指标驾驶舱
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          需求 · 客户服务 · 库存与供应 · 生产执行 四域全景监控
        </p>
      </div>

      <FilterBar />

      {/* 顶部 KPI 胶囊 */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="本月合同件数"
          value={latest?.contractCount.toLocaleString() ?? '—'}
          unit="件"
          trend={`件数完成率 ${(latest?.countRate ?? 0).toFixed(1)}%`}
        />
        <KpiCard
          label="本月合同吨数"
          value={((latest?.contractTons ?? 0) / 10000).toFixed(1)}
          unit="万吨"
          trend={`吨数完成率 ${(latest?.tonsRate ?? 0).toFixed(1)}%`}
        />
        <KpiCard
          label="全线合同总件数"
          value={totalContractCount.toLocaleString()}
          unit="件"
          trend={`平均完成率 ${avgCompletionRate.toFixed(1)}%`}
        />
        <KpiCard
          label="欠交量"
          value={(totalBacklogTons / 1000).toFixed(0)}
          unit="千吨"
          trend={`合同总量 ${(totalContractTons / 10000).toFixed(1)} 万吨`}
        />
      </div>

      {/* 四象限 */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: 'var(--color-text-title)' }}
          >
            需求域 · 结算合同完成率趋势
          </h3>
          <DemandAccuracy />
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: 'var(--color-text-title)' }}
          >
            客户服务域 · OTIF 合同吨数履约
          </h3>
          <OtifChart />
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: 'var(--color-text-title)' }}
          >
            库存与供应域 · 成品库存周转热力图
          </h3>
          <InventoryHeatmap />
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: 'var(--color-text-title)' }}
          >
            生产执行域 · 各产线合同完成情况
          </h3>
          <PlanExecution />
        </div>
      </div>
    </div>
  )
}
