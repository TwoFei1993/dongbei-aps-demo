'use client'
import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadScenariosRadar } from '@/lib/data-loader'
import type { ScenarioKey } from '@/types'

const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  capacity: '产能利用率最优',
  profit: '吨钢毛利最优',
  strategic: '战略客户交付最优',
}

const COLORS: Record<ScenarioKey, string> = {
  capacity: '#4a7cdc',
  profit: '#10b981',
  strategic: '#f59e0b',
}

export function ScenarioRadar() {
  const { scenario, setScenario, scene1Params } = useAppStore()

  const baseData = useMemo(() => loadScenariosRadar(), [])
  const data = useMemo(() => {
    const pDelta = (scene1Params.profitWeight - 33) * 0.15
    const cDelta = (scene1Params.capacityWeight - 34) * 0.15
    const dDelta = (scene1Params.deliveryWeight - 33) * 0.15
    return baseData.map(point => ({
      ...point,
      profit:    Math.min(100, Math.max(40, point.profit + pDelta)),
      capacity:  Math.min(100, Math.max(40, point.capacity + cDelta)),
      strategic: Math.min(100, Math.max(40, point.strategic + dDelta)),
    }))
  }, [baseData, scene1Params])

  const option = {
    tooltip: {},
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    radar: {
      indicator: data.map((d) => ({ name: d.dimension, max: 100 })),
      radius: '65%',
    },
    series: [{
      type: 'radar',
      data: (Object.keys(SCENARIO_LABELS) as ScenarioKey[]).map((key) => ({
        name: SCENARIO_LABELS[key],
        value: data.map((d) => d[key]),
        lineStyle: { color: COLORS[key], width: scenario === key ? 2.5 : 1 },
        areaStyle: { color: COLORS[key], opacity: scenario === key ? 0.15 : 0.04 },
        itemStyle: { color: COLORS[key] },
        symbol: scenario === key ? 'circle' : 'none',
        symbolSize: 6,
      })),
    }],
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(Object.keys(SCENARIO_LABELS) as ScenarioKey[]).map((key) => (
          <button key={key} onClick={() => setScenario(key)}
            className="flex-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all"
            style={{
              backgroundColor: scenario === key ? COLORS[key] : 'var(--color-primary-light)',
              color: scenario === key ? '#fff' : 'var(--color-text-body)',
              border: '1px solid',
              borderColor: scenario === key ? COLORS[key] : 'var(--color-card-border)',
            }}>
            {SCENARIO_LABELS[key]}
          </button>
        ))}
      </div>
      <ChartWrapper option={option} height={320} />
    </div>
  )
}
