'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiService } from '@/lib/data-loader'

const data = loadKpiService()

export function OtifChart() {
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['已结算', '未结算', '完成率'], top: 0, right: 0, textStyle: { fontSize: 10 } },
    grid: { top: 30, right: 60, bottom: 20, left: 40 },
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
  return <ChartWrapper option={option} height={200} />
}
