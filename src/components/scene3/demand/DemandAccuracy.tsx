'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiDemand } from '@/lib/data-loader'

const data = loadKpiDemand()

export function DemandAccuracy() {
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
  return (
    <div data-testid="demand-accuracy-chart">
      <ChartWrapper option={option} height={200} />
    </div>
  )
}
