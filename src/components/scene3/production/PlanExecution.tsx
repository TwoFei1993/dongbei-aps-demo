'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiProduction } from '@/lib/data-loader'

const raw = loadKpiProduction().slice(0, 8)

export function PlanExecution() {
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 60, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: raw.map((r) => r.productLine),
      axisLabel: { rotate: 30, fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        name: '吨',
        axisLabel: { fontSize: 10 },
      },
      {
        type: 'value',
        name: '完成率',
        min: 0,
        max: 150,
        axisLabel: {
          formatter: (v: number) => `${v}%`,
          fontSize: 10,
        },
      },
    ],
    series: [
      {
        name: '合同吨数',
        type: 'bar',
        data: raw.map((r) => r.contractTons),
        itemStyle: { color: '#4a7cdc', borderRadius: [3, 3, 0, 0] },
        barWidth: '35%',
      },
      {
        name: '欠交吨数',
        type: 'bar',
        data: raw.map((r) => r.backlogTons),
        itemStyle: { color: '#f59e0b', borderRadius: [3, 3, 0, 0] },
        barWidth: '35%',
      },
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 1,
        data: raw.map((r) => r.completionRate),
        smooth: true,
        lineStyle: { color: '#10b981', width: 2 },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#10b981' },
      },
    ],
  }
  return <ChartWrapper option={option} height={220} />
}
