import type {
  GlobalKpi,
  MonthlyCompletion,
  ProductLineContract,
  InventoryBucket,
  MonthlyDemandAccuracy,
  Order,
  OrderGroup,
  ScenarioRadarPoint,
  GanttTask,
  FurnaceModelData,
} from '@/types'

export function loadGlobalKpi(): GlobalKpi[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/global/global-kpi.json') as GlobalKpi[]
}
export function loadKpiService(): MonthlyCompletion[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene3/kpi-service.json') as MonthlyCompletion[]
}
export function loadKpiDemand(): MonthlyDemandAccuracy[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene3/kpi-demand.json') as MonthlyDemandAccuracy[]
}
export function loadKpiProduction(): ProductLineContract[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene3/kpi-production.json') as ProductLineContract[]
}
export function loadKpiInventory(): InventoryBucket[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene3/kpi-inventory.json') as InventoryBucket[]
}
export function loadOrders(): Order[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene1/orders-sample.json') as Order[]
}
export function loadOrderGroups(): OrderGroup[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene1/order-groups.json') as OrderGroup[]
}
export function loadScenariosRadar(): ScenarioRadarPoint[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene1/scenarios-radar.json') as ScenarioRadarPoint[]
}
export function loadGantt(): GanttTask[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene2/gantt-schedule.json') as GanttTask[]
}
export function loadFurnaceModel(): FurnaceModelData {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/data/scene2/furnace-model.json') as FurnaceModelData
}
