'use client'
import { useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { useAppStore } from '@/lib/store'

const ALL_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月']
const ALL_ACTUAL = [1820, 1650, 1980, 1740, 2100, 1890]
const ALL_PLANNED = [1800, 1800, 1800, 1800, 1800, 1800]

function sliceN(timeRange: string): number {
  if (timeRange === '当月') return 1
  if (timeRange === '3个月') return 3
  if (timeRange === '6个月') return 6
  return ALL_MONTHS.length
}

export function OrderPaceChart() {
  const { timeRange } = useAppStore()
  const n = sliceN(timeRange)
  const months = useMemo(() => ALL_MONTHS.slice(-n), [n])
  const actual = useMemo(() => ALL_ACTUAL.slice(-n), [n])
  const planned = useMemo(() => ALL_PLANNED.slice(-n), [n])
  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      right: 0,
      textStyle: { fontSize: 10 },
      data: ['实际接单', '计划节奏'],
    },
    grid: { top: 30, right: 16, bottom: 20, left: 45 },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, formatter: '{value}' },
    },
    series: [
      {
        name: '实际接单',
        type: 'bar',
        data: actual,
        itemStyle: { color: '#4a7cdc', borderRadius: [3, 3, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '计划节奏',
        type: 'line',
        data: planned,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2, type: 'dashed' },
        symbol: 'none',
        itemStyle: { color: '#f59e0b' },
      },
    ],
  }

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-card-border)' }}>
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-title)' }}>
        接单节奏 vs 计划
      </p>
      <ChartWrapper option={option} height={190} />
    </div>
  )
}
