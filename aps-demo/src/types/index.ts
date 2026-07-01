export interface GlobalKpi {
  label: string; value: string; direction: 'up' | 'down'; unit: string
}
export interface Order {
  orderId: string; contractId: string; steelGrade: string; steelCategory: string
  productLine: string; equipment: string; plannedTons: number; shape: string
  thickness: number; width: number; length: number
  deliveryState: string; plannedMonth: string; isOverdue: boolean
  priority: 'high' | 'medium' | 'low'
}
export interface OrderGroup {
  groupId: string; steelGrade: string; orderCount: number; totalTons: number
  earliestDelivery: string; grossProfitPerTon: number
  capacityUsage: string; status: 'optimal' | 'feasible'
}
export type ScenarioKey = 'capacity' | 'profit' | 'strategic'
export interface ScenarioRadarPoint {
  dimension: string; capacity: number; profit: number; strategic: number
}
export interface GanttTask {
  id: string; batchId: string; line: string; equipment: string
  steelGrade: string; standard: string; spec: string
  startTime: string; endTime: string; constraint: string
  stage: 'casting' | 'heating' | 'rolling' | 'finishing'
}
export interface FurnaceDataPoint { time: string; predicted: number; actual: number }
export interface LoadingGroup { groupId: string; steelGrade: string; deltaT: number; color: string }
export interface RhythmPoint { time: string; furnaceOutput: number; millDemand: number }
export interface ImprovementMetric {
  label: string; before: number; after: number; unit: string; improvement: string
}
export interface FurnaceModelData {
  heatPrediction: FurnaceDataPoint[]
  loadingGroups: LoadingGroup[]
  rhythmMatch: RhythmPoint[]
  improvements: ImprovementMetric[]
}
export interface MonthlyCompletion {
  month: string; contractCount: number; contractTons: number
  settledCount: number; settledTons: number; countRate: number; tonsRate: number
}
export interface ProductLineContract {
  productLine: string; contractCount: number; contractTons: number
  backlogTons: number; completionRate: number
}
export interface InventoryBucket { steelCategory: string; stockCycle: string; weight: number }
export interface MonthlyDemandAccuracy { month: string; demandAccuracy: number; forecastAcc: number }
export interface FilterState {
  timeRange: string; productLine: string; steelCategory: string; scenario: ScenarioKey
}
export interface Scene1Params {
  // 优化目标权重（合计应=100）
  profitWeight: number        // 吨钢毛利权重
  capacityWeight: number      // 产能利用率权重
  deliveryWeight: number      // 战略交付权重
  // 连铸约束
  moqMin: number              // 浇次最小炉次数（默认4）
  moqMax: number              // 浇次最大炉次数（默认8）
  maxMixedCastTons: number    // 混浇坯单次上限吨位（默认70t）
  switchCostLevel: 'low' | 'medium' | 'high'  // 钢种切换成本等级
  // 订单与规划参数
  atpWindowDays: number       // ATP承诺交期窗口（天）
  priorityAMinTons: number    // A类客户优先级最小吨位阈值
  horizonDays: number         // 规划周期（天）
}
export interface Scene2Params {
  horizon: 48 | 72 | 96      // 排程窗口（小时）
  equipmentCount: number      // 在线设备台数
  ruleCount: number           // 工艺路径规则数
  // 连铸约束
  castingMoqMin: number       // 浇次最小炉次
  castingMoqMax: number       // 浇次最大炉次
  maxMixedCastTons: number    // 混浇坯上限
  // 加热约束
  heatGroupDelta: number      // 温度分组阈值ΔT（°C）
  // 轧线约束
  rollChangePeriodHours: number  // 换辊周期（小时）
  // 优化目标
  optimizeTarget: 'delivery' | 'cost' | 'balanced'
}
export interface FurnaceParams {
  targetTemp: number          // 目标加热温度 °C（1150–1280）
  soakingTime: number         // 均热保温时间 min
  tempGroupDelta: number      // 温度分组阈值ΔT °C
  hotChargeRate: number       // 热装热送率目标 %
  hotChargeMinTemp: number    // 热装最低入炉温度 °C（默认850）
  furnaceCapacity: number     // 加热炉容量（块数，默认8）
}
