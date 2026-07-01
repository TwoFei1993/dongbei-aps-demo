'use client'
import { useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiDemand } from '@/lib/data-loader'
import { useAppStore } from '@/lib/store'

const LINE_SCALE: Record<string, number> = {
  '全部': 1.0, '炼钢': 1.08, '线材': 0.92, '小棒': 0.85,
  '银亮材': 1.15, '钢丝': 0.78, '大型材': 1.12, '模具': 1.22,
  '锻钢': 0.95, '精密': 1.05, '特冶': 0.88,
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function sliceByRange<T>(arr: T[], timeRange: string): T[] {
  if (timeRange === '当月') return arr.slice(-1)
  if (timeRange === '3个月') return arr.slice(-3)
  if (timeRange === '6个月') return arr.slice(-6)
  return arr
}

export function DemandAccuracy() {
  const { productLine, timeRange } = useAppStore()
  const raw = useMemo(() => loadKpiDemand(), [])
  const scale = LINE_SCALE[productLine] ?? 1.0
  const data = useMemo(
    () => sliceByRange(raw, timeRange).map((d) => ({
      ...d,
      demandAccuracy: clamp(d.demandAccuracy * scale, 70, 100),
      forecastAcc: clamp(d.forecastAcc * scale, 70, 100),
    })),
    [raw, scale, timeRange]
  )

  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      right: 0,
      textStyle: { fontSize: 11 },
      data: ['准发量率', '预测准确率'],
    },
    grid: { top: 28, right: 16, bottom: 20, left: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 100,
      axisLabel: { formatter: '{value}%', fontSize: 11 },
    },
    series: [
      {
        name: '准发量率',
        type: 'bar',
        data: data.map((d) => d.demandAccuracy),
        itemStyle: { color: '#4a7cdc', borderRadius: [4, 4, 0, 0] },
        barWidth: '50%',
      },
      {
        name: '预测准确率',
        type: 'line',
        data: data.map((d) => d.forecastAcc),
        smooth: true,
        lineStyle: { color: '#10b981', width: 2 },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#10b981' },
      },
    ],
  }
  return <ChartWrapper option={option} height={240} />
}
