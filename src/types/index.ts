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
