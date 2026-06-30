import { create } from 'zustand'
import type { FilterState, ScenarioKey } from '@/types'

interface AppStore extends FilterState {
  setTimeRange: (v: string) => void
  setProductLine: (v: string) => void
  setSteelCategory: (v: string) => void
  setScenario: (v: ScenarioKey) => void
}

export const useAppStore = create<AppStore>((set) => ({
  timeRange: '5月',
  productLine: '全部',
  steelCategory: '全部',
  scenario: 'capacity',
  setTimeRange: (timeRange) => set({ timeRange }),
  setProductLine: (productLine) => set({ productLine }),
  setSteelCategory: (steelCategory) => set({ steelCategory }),
  setScenario: (scenario) => set({ scenario }),
}))
