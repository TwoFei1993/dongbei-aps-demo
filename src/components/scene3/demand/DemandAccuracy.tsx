'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiDemand } from '@/lib/data-loader'

const data = loadKpiDemand()

export function DemandAccuracy() {
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 16, bottom: 20, left: 40 },
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
        type: 'bar',
        data: data.map((d) => d.demandAccuracy),
        itemStyle: { color: '#4a7cdc', borderRadius: [4, 4, 0, 0] },
        barWidth: '50%',
      },
      {
        type: 'line',
        data: data.map((d) => d.demandAccuracy),
        smooth: true,
        lineStyle: { color: '#10b981', width: 2 },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#10b981' },
      },
    ],
  }
  return <ChartWrapper option={option} height={200} />
}
