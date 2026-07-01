'use client'

import { useState, useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadFurnaceModel } from '@/lib/data-loader'
import { useAppStore } from '@/lib/store'
import type { FurnaceModelData } from '@/types'

function buildGroupOption(model: FurnaceModelData) {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 90, right: 30, top: 20, bottom: 30 },
    xAxis: {
      type: 'value',
      name: 'ΔT(°)',
      nameTextStyle: { color: '#94a3b8' },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'category',
      data: model.loadingGroups.map((g) => g.steelGrade),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: model.loadingGroups.map((g) => ({
          name: g.steelGrade,
          value: g.deltaT,
          itemStyle: { color: g.color },
        })),
      },
    ],
  }
}

function buildRhythmOption(model: FurnaceModelData, furnaceCapacity: number) {
  const capacityScale = furnaceCapacity / 8
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['出炉节拍', '轧机需求'],
      textStyle: { color: '#94a3b8' },
      top: 4,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: model.rhythmMatch.map((d) => d.time),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        name: '出炉节拍',
        type: 'bar',
        data: model.rhythmMatch.map((d) => Math.round(d.furnaceOutput * capacityScale)),
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: '轧机需求',
        type: 'line',
        data: model.rhythmMatch.map((d) => d.millDemand),
        itemStyle: { color: '#4a7cdc' },
        lineStyle: { color: '#4a7cdc' },
        symbol: 'circle',
        symbolSize: 4,
        smooth: true,
      },
    ],
  }
}

function buildHeatOption(model: FurnaceModelData, targetTemp: number) {
  const offset = (targetTemp - 1240) * 0.5
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['预测', '实际'],
      textStyle: { color: '#94a3b8' },
      top: 4,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: model.heatPrediction.map((d) => d.time),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        name: '预测',
        type: 'line',
        data: model.heatPrediction.map((d) => Math.round(d.predicted + offset)),
        itemStyle: { color: '#4a7cdc' },
        lineStyle: { color: '#4a7cdc' },
        symbol: 'none',
        smooth: true,
      },
      {
        name: '实际',
        type: 'line',
        data: model.heatPrediction.map((d) => d.actual),
        itemStyle: { color: '#10b981' },
        lineStyle: { color: '#10b981', type: 'dashed' },
        symbol: 'none',
        smooth: true,
      },
    ],
  }
}

export function FurnaceModel() {
  const [activeId, setActiveId] = useState(1)
  const model = useMemo(() => loadFurnaceModel(), [])
  const { furnaceParams } = useAppStore()
  const {
    targetTemp,
    soakingTime,
    tempGroupDelta,
    hotChargeRate,
    hotChargeMinTemp,
    furnaceCapacity,
  } = furnaceParams

  const models = useMemo(() => [
    {
      id: 1,
      title: '加热时间预测',
      subtitle: `Theat = f(钢种, 断面, 入炉温度 → 目标 ${targetTemp}°C)`,
      accuracy: '目标精度 ±5min',
    },
    {
      id: 2,
      title: '装炉排序优化',
      subtitle: `ΔT≤${tempGroupDelta}° 分组 · 组内单调排序 · 炉容 ${furnaceCapacity} 块`,
      accuracy: '过渡次数 −40%',
    },
    {
      id: 3,
      title: '模铸均热时间优化',
      subtitle: `保温 ${soakingTime}min · 热装率目标 ${hotChargeRate}% · 最低入炉 ${hotChargeMinTemp}°C`,
      accuracy: '轧线等炉 −50%',
    },
  ], [targetTemp, soakingTime, tempGroupDelta, hotChargeRate, hotChargeMinTemp, furnaceCapacity])

  const activeModel = models.find((m) => m.id === activeId) ?? models[0]

  const option = useMemo(() => {
    if (activeId === 1) return buildHeatOption(model, targetTemp)
    if (activeId === 2) return buildGroupOption(model)
    return buildRhythmOption(model, furnaceCapacity)
  }, [activeId, model, targetTemp, furnaceCapacity])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor:
                activeId === m.id ? 'var(--color-primary)' : 'var(--color-card-bg)',
              color: activeId === m.id ? '#ffffff' : 'var(--color-text-muted)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            模型 {m.id} · {m.title}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl p-4 space-y-2"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {activeModel.subtitle}
          </p>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', opacity: 0.85 }}
          >
            {activeModel.accuracy}
          </span>
        </div>
        <ChartWrapper option={option} height={220} />
      </div>
    </div>
  )
}
