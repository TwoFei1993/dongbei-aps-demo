import { FilterBar } from '@/components/shared/FilterBar'
import { KpiSummary } from '@/components/scene3/KpiSummary'
import { DemandAccuracy } from '@/components/scene3/demand/DemandAccuracy'
import { OrderPaceChart } from '@/components/scene3/demand/OrderPaceChart'
import { OtifChart } from '@/components/scene3/service/OtifChart'
import { LateDelivery } from '@/components/scene3/service/LateDelivery'
import { InventoryHeatmap } from '@/components/scene3/inventory/InventoryHeatmap'
import { GapForecast } from '@/components/scene3/inventory/GapForecast'
import { PlanExecution } from '@/components/scene3/production/PlanExecution'
import { ScheduleLoss } from '@/components/scene3/production/ScheduleLoss'
import { DeviationAlert } from '@/components/scene3/production/DeviationAlert'

export default function Scene3Page() {
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

      <KpiSummary />

      <div className="grid grid-cols-2 gap-4" style={{ alignItems: 'stretch' }}>
        {/* 需求域 */}
        <div
          className="rounded-xl p-4 flex flex-col"
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
          <div className="flex-1 flex flex-col">
            <DemandAccuracy />
            <OrderPaceChart />
          </div>
        </div>

        {/* 客户服务域 */}
        <div
          className="rounded-xl p-4 flex flex-col"
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
          <div className="flex-1 flex flex-col">
            <OtifChart />
            <LateDelivery />
          </div>
        </div>

        {/* 库存与供应域 */}
        <div
          className="rounded-xl p-4 flex flex-col"
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
          <div className="flex-1 flex flex-col">
            <InventoryHeatmap />
            <GapForecast />
          </div>
        </div>

        {/* 生产执行域 — top 2-col + bottom full-width */}
        <div
          className="rounded-xl p-4 flex flex-col"
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
          <div className="flex flex-col flex-1">
            <div className="grid grid-cols-2 gap-4">
              <PlanExecution />
              <ScheduleLoss />
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-card-border)' }}>
              <DeviationAlert />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
