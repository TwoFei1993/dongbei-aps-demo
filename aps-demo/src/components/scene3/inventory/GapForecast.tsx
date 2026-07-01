'use client'
import { useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { useAppStore } from '@/lib/store'

const ALL_MONTHS = ['7月', '8月', '9月', '10月', '11月', '12月']
const ALL_SURPLUS = [8.2, 5.1, -2.3, -6.8, 3.4, 1.9]

function sliceN(timeRange: string): number {
  if (timeRange === '当月') return 1
  if (timeRange === '3个月') return 3
  if (timeRange === '6个月') return 6
  return ALL_MONTHS.length
}

export function GapForecast() {
  const { timeRange } = useAppStore()
  const n = sliceN(timeRange)
  const months = useMemo(() => ALL_MONTHS.slice(-n), [n])
  const surplus = useMemo(() => ALL_SURPLUS.slice(-n), [n])
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, right: 16, bottom: 20, left: 50 },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => `${v}k`, fontSize: 10 },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'bar',
        data: surplus.map((v) => ({
          value: v,
          itemStyle: {
            color: v >= 0 ? '#10b981' : '#ef4444',
            borderRadius: v >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],
          },
        })),
        barWidth: '55%',
      },
    ],
  }

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-card-border)' }}>
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-title)' }}>
        供需缺口预测（千吨，绿=过剩，红=缺口）
      </p>
      <ChartWrapper option={option} height={170} />
    </div>
  )
}
