import { create } from 'zustand'
import type { FilterState, ScenarioKey, Scene1Params, Scene2Params, FurnaceParams } from '@/types'

interface AppStore extends FilterState {
  setTimeRange: (v: string) => void
  setProductLine: (v: string) => void
  setSteelCategory: (v: string) => void
  setScenario: (v: ScenarioKey) => void
  scene1Params: Scene1Params
  setScene1Params: (p: Partial<Scene1Params>) => void
  scene2Params: Scene2Params
  setScene2Params: (p: Partial<Scene2Params>) => void
  furnaceParams: FurnaceParams
  setFurnaceParams: (p: Partial<FurnaceParams>) => void
}

export const useAppStore = create<AppStore>((set) => ({
  timeRange: '6个月',
  productLine: '全部',
  steelCategory: '全部',
  scenario: 'capacity',
  setTimeRange: (timeRange) => set({ timeRange }),
  setProductLine: (productLine) => set({ productLine }),
  setSteelCategory: (steelCategory) => set({ steelCategory }),
  setScenario: (scenario) => set({ scenario }),

  scene1Params: {
    profitWeight: 33,
    capacityWeight: 34,
    deliveryWeight: 33,
    moqMin: 4,
    moqMax: 8,
    maxMixedCastTons: 70,
    switchCostLevel: 'medium',
    atpWindowDays: 5,
    priorityAMinTons: 200,
    horizonDays: 7,
  },
  setScene1Params: (p) =>
    set((s) => ({ scene1Params: { ...s.scene1Params, ...p } })),

  scene2Params: {
    horizon: 72,
    equipmentCount: 6,
    ruleCount: 48,
    castingMoqMin: 4,
    castingMoqMax: 8,
    maxMixedCastTons: 70,
    heatGroupDelta: 50,
    rollChangePeriodHours: 24,
    optimizeTarget: 'balanced',
  },
  setScene2Params: (p) =>
    set((s) => ({ scene2Params: { ...s.scene2Params, ...p } })),

  furnaceParams: {
    targetTemp: 1240,
    soakingTime: 45,
    tempGroupDelta: 50,
    hotChargeRate: 65,
    hotChargeMinTemp: 850,
    furnaceCapacity: 8,
  },
  setFurnaceParams: (p) =>
    set((s) => ({ furnaceParams: { ...s.furnaceParams, ...p } })),
}))
