'use client'
import { useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiService } from '@/lib/data-loader'
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

export function OtifChart() {
  const { productLine, timeRange } = useAppStore()
  const raw = useMemo(() => loadKpiService(), [])
  const scale = LINE_SCALE[productLine] ?? 1.0
  const data = useMemo(
    () => sliceByRange(raw, timeRange).map((d) => ({
      ...d,
      settledTons: Math.round(d.settledTons * scale),
      contractTons: Math.round(d.contractTons * scale),
      tonsRate: clamp(d.tonsRate * scale, 70, 110),
    })),
    [raw, scale, timeRange]
  )

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['已结算', '未结算', '完成率'], bottom: 4, left: 'center', textStyle: { fontSize: 10 } },
    grid: { top: 10, right: 60, bottom: 40, left: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      axisLabel: { fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: '吨',
        axisLabel: {
          formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
          fontSize: 11,
        },
      },
      {
        type: 'value',
        name: '完成率',
        min: 70,
        max: 110,
        axisLabel: { formatter: (v: number) => `${v}%`, fontSize: 10 },
      },
    ],
    series: [
      {
        name: '已结算',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.settledTons),
        itemStyle: { color: '#4a7cdc' },
        barWidth: '50%',
      },
      {
        name: '未结算',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.contractTons - d.settledTons),
        itemStyle: { color: '#e2e8f6' },
      },
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((d) => d.tonsRate),
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2, type: 'dashed' },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#f59e0b' },
      },
    ],
  }
  return <ChartWrapper option={option} height={240} />
}
