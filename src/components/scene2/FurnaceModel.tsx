'use client'

import { useState, useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadFurnaceModel } from '@/lib/data-loader'
import type { FurnaceModelData } from '@/types'

const MODELS = [
  {
    id: 1,
    title: '加热时间预测',
    subtitle: 'Theat = f(钢种, 断面, 入炉温度, 目标温度, 炉膛温度)',
    accuracy: '目标精度 ±5min',
  },
  {
    id: 2,
    title: '装炉排序优化',
    subtitle: 'ΔT≤50° 分组，组内单调排序，最小化升温过渡次数',
    accuracy: '过渡次数 −40%',
  },
  {
    id: 3,
    title: '模铸均热时间优化',
    subtitle: '热坑加热时间与轧机节拍反算匹配，消除等待与温度偏差',
    accuracy: '轧线等炉 −50%',
  },
]

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

function buildRhythmOption(model: FurnaceModelData) {
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
        data: model.rhythmMatch.map((d) => d.furnaceOutput),
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

function buildHeatOption(model: FurnaceModelData) {
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
        data: model.heatPrediction.map((d) => d.predicted),
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
  const activeModel = MODELS.find((m) => m.id === activeId) ?? MODELS[0]

  const option = useMemo(() => {
    if (activeId === 1) return buildHeatOption(model)
    if (activeId === 2) return buildGroupOption(model)
    return buildRhythmOption(model)
  }, [activeId, model])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {MODELS.map((m) => (
          <button
            key={m.id}
            data-testid={`furnace-model-${m.id}`}
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
