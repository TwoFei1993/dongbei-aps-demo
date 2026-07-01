'use client'
import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { KpiCard } from '@/components/shared/KpiCard'
import { loadKpiService, loadKpiProduction } from '@/lib/data-loader'

const LINE_SCALE: Record<string, number> = {
  '全部': 1.0, '炼钢': 1.08, '线材': 0.92, '小棒': 0.85,
  '银亮材': 1.15, '钢丝': 0.78, '大型材': 1.12, '模具': 1.22,
  '锻钢': 0.95, '精密': 1.05, '特冶': 0.88,
}

export function KpiSummary() {
  const { productLine } = useAppStore()
  const allService = useMemo(() => loadKpiService(), [])
  const allProd = useMemo(() => loadKpiProduction(), [])

  const scale = LINE_SCALE[productLine] ?? 1.0
  const latest = allService[allService.length - 1]

  const filtered = useMemo(
    () => (productLine === '全部' ? allProd : allProd.filter((p) => p.productLine === productLine)),
    [allProd, productLine]
  )

  const totalContractTons = filtered.reduce((s, p) => s + p.contractTons, 0)
  const totalBacklogTons = filtered.reduce((s, p) => s + p.backlogTons, 0)
  const avgCompletionRate = filtered.length
    ? filtered.reduce((s, p) => s + p.completionRate, 0) / filtered.length
    : 0

  const countRate = Math.min(100, (latest?.countRate ?? 0) * scale)
  const tonsRate = Math.min(100, (latest?.tonsRate ?? 0) * scale)
  const contractCount = Math.round(
    (latest?.contractCount ?? 0) * (productLine === '全部' ? 1 : scale * 0.1)
  )

  return (
    <div className="grid grid-cols-4 gap-4">
      <KpiCard
        label="本月合同件数"
        value={contractCount.toLocaleString()}
        unit="件"
        trend={`件数完成率 ${countRate.toFixed(1)}%`}
      />
      <KpiCard
        label="合同吨数"
        value={(totalContractTons / 10000).toFixed(1)}
        unit="万吨"
        trend={`吨数完成率 ${tonsRate.toFixed(1)}%`}
      />
      <KpiCard
        label="计划完成率"
        value={avgCompletionRate.toFixed(1)}
        unit="%"
        trend={productLine === '全部' ? '全线平均' : productLine}
      />
      <KpiCard
        label="欠交量"
        value={(totalBacklogTons / 1000).toFixed(0)}
        unit="千吨"
        trend={`合同总量 ${(totalContractTons / 10000).toFixed(1)} 万吨`}
      />
    </div>
  )
}
