import {
  loadKpiDemand,
  loadKpiService,
  loadKpiProduction,
  loadKpiInventory,
  loadOrderGroups,
  loadGantt,
  loadFurnaceModel,
} from '@/lib/data-loader'
import type { ModuleKpiItem } from '@/types'

export interface ModuleKpiGroup {
  id: string
  title: string
  subtitle: string
  color: string
  href?: string
  // kpis[0..1] are the top-2 default items; the full array is shown when expanded
  kpis: ModuleKpiItem[]
}

function avg(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length
}

function getDemandForecastKpis(): ModuleKpiItem[] {
  const rows = loadKpiDemand()
  const latest = rows[rows.length - 1]
  return [
    { label: '准发量率（最新）', value: latest.demandAccuracy.toFixed(1), unit: '%' },
    { label: '预测准确率（最新）', value: latest.forecastAcc.toFixed(1), unit: '%' },
    { label: '准发量率（近5月均值）', value: avg(rows.map((r) => r.demandAccuracy)).toFixed(1), unit: '%' },
    { label: '预测准确率（近5月均值）', value: avg(rows.map((r) => r.forecastAcc)).toFixed(1), unit: '%' },
  ]
}

function getResourcePlanKpis(): ModuleKpiItem[] {
  const groups = loadOrderGroups()
  const usage = groups.map((g) => parseFloat(g.capacityUsage))
  const inv = loadKpiInventory()
  const totalWeight = inv.reduce((s, r) => s + r.weight, 0)
  const optimalRatio = (groups.filter((g) => g.status === 'optimal').length / groups.length) * 100
  return [
    { label: '平均产能利用率', value: avg(usage).toFixed(1), unit: '%' },
    { label: '在库总量', value: (totalWeight / 10000).toFixed(2), unit: '万吨' },
    { label: '资源配置最优方案占比', value: optimalRatio.toFixed(0), unit: '%' },
    { label: '库存品类总数', value: String(new Set(inv.map((r) => r.steelCategory)).size), unit: '类' },
  ]
}

function getOrderReceivingKpis(): ModuleKpiItem[] {
  const rows = loadKpiService()
  const latest = rows[rows.length - 1]
  return [
    { label: '吨数结算完成率（最新）', value: latest.tonsRate.toFixed(1), unit: '%' },
    { label: '件数结算完成率（最新）', value: latest.countRate.toFixed(1), unit: '%' },
    { label: '本月合同吨数', value: (latest.contractTons / 10000).toFixed(1), unit: '万吨' },
    { label: '本月已结算吨数', value: (latest.settledTons / 10000).toFixed(1), unit: '万吨' },
    { label: '近5月平均吨数结算率', value: avg(rows.map((r) => r.tonsRate)).toFixed(1), unit: '%' },
    { label: '近5月平均件数结算率', value: avg(rows.map((r) => r.countRate)).toFixed(1), unit: '%' },
  ]
}

function getPlanningCoordinationKpis(): ModuleKpiItem[] {
  const tasks = loadGantt()
  const batchIds = [...new Set(tasks.map((t) => t.batchId))]
  const equipments = new Set(tasks.map((t) => t.equipment))
  const normalRatio = (tasks.filter((t) => t.constraint === 'normal').length / tasks.length) * 100
  const spans = batchIds.map((id) => {
    const rows = tasks.filter((t) => t.batchId === id)
    const start = Math.min(...rows.map((t) => new Date(t.startTime).getTime()))
    const end = Math.max(...rows.map((t) => new Date(t.endTime).getTime()))
    return (end - start) / 3600000
  })
  return [
    { label: '在排批次数', value: String(batchIds.length), unit: '批' },
    { label: '批次平均跨工序时长', value: avg(spans).toFixed(1), unit: '小时' },
    { label: '涉及设备数', value: String(equipments.size), unit: '台' },
    { label: '正常约束批次占比', value: normalRatio.toFixed(0), unit: '%' },
  ]
}

function getProductionSchedulingKpis(): ModuleKpiItem[] {
  const rows = loadKpiProduction()
  const totalContractTons = rows.reduce((s, r) => s + r.contractTons, 0)
  const totalBacklogTons = rows.reduce((s, r) => s + r.backlogTons, 0)
  const best = rows.reduce((a, b) => (b.completionRate > a.completionRate ? b : a))
  const worst = rows.reduce((a, b) => (b.completionRate < a.completionRate ? b : a))
  return [
    { label: '平均计划完成率', value: avg(rows.map((r) => r.completionRate)).toFixed(1), unit: '%' },
    { label: '欠交总吨数', value: (totalBacklogTons / 1000).toFixed(1), unit: '千吨' },
    { label: '合同总吨数', value: (totalContractTons / 10000).toFixed(1), unit: '万吨' },
    { label: '完成率最高产线', value: `${best.completionRate.toFixed(1)}%`, trend: best.productLine },
    { label: '完成率最低产线', value: `${worst.completionRate.toFixed(1)}%`, trend: worst.productLine },
    { label: '涉及产线数', value: String(rows.length), unit: '条' },
  ]
}

function getExecutionOptimizationKpis(): ModuleKpiItem[] {
  const model = loadFurnaceModel()
  return model.improvements.map((m) => ({
    label: m.label,
    value: String(m.after),
    unit: m.unit,
    trend: m.improvement,
  }))
}

export function getModuleKpiGroups(): ModuleKpiGroup[] {
  return [
    {
      id: 'demand-forecast',
      title: '需求预测',
      subtitle: '订单评审预测模型',
      color: '#4a7cdc',
      href: '/scene1',
      kpis: getDemandForecastKpis(),
    },
    {
      id: 'resource-plan',
      title: '资源计划',
      subtitle: '资源配置优化',
      color: '#8b5cf6',
      href: '/scene1',
      kpis: getResourcePlanKpis(),
    },
    {
      id: 'order-receiving',
      title: '订单接收',
      subtitle: '智能评审与排序',
      color: '#f59e0b',
      kpis: getOrderReceivingKpis(),
    },
    {
      id: 'planning-coordination',
      title: '计划协同',
      subtitle: '铁钢界面协议 · 跨工序时间窗口约束',
      color: '#0ea5e9',
      href: '/scene2',
      kpis: getPlanningCoordinationKpis(),
    },
    {
      id: 'production-scheduling',
      title: '生产调度',
      subtitle: '核心动态排程层',
      color: '#10b981',
      href: '/scene2',
      kpis: getProductionSchedulingKpis(),
    },
    {
      id: 'execution-optimization',
      title: '执行优化',
      subtitle: '钢包调选 · 发运优化',
      color: '#ec4899',
      href: '/scene2',
      kpis: getExecutionOptimizationKpis(),
    },
  ]
}
