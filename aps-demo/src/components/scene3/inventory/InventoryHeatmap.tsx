'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadKpiInventory } from '@/lib/data-loader'

const raw = loadKpiInventory()

// Exact cycle labels as they appear in the data
const CYCLES = ['＜1', '1--3', '3--6', '＞6']
const CYCLE_LABELS = ['<1月', '1-3月', '3-6月', '>6月']

const categories = [...new Set(raw.map((r) => r.steelCategory))].slice(0, 10)

export function InventoryHeatmap() {
  const data: [number, number, number][] = []
  raw.forEach((r) => {
    const x = CYCLES.indexOf(r.stockCycle)
    const y = categories.indexOf(r.steelCategory)
    if (x >= 0 && y >= 0) data.push([x, y, r.weight])
  })

  const option = {
    tooltip: {
      formatter: (p: { data: [number, number, number] }) =>
        `${categories[p.data[1]]} / ${CYCLE_LABELS[p.data[0]]}: ${p.data[2].toFixed(0)}t`,
    },
    grid: { top: 10, right: 80, bottom: 30, left: 80 },
    xAxis: {
      type: 'category',
      data: CYCLE_LABELS,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 10 },
    },
    visualMap: {
      min: 0,
      max: 5000,
      calculable: true,
      orient: 'vertical',
      right: 0,
      top: 'center',
      inRange: { color: ['#f0f7ff', '#4a7cdc', '#1e3a6e'] },
      textStyle: { fontSize: 10 },
    },
    series: [
      {
        type: 'heatmap',
        data,
        emphasis: { itemStyle: { shadowBlur: 8 } },
      },
    ],
  }
  return <ChartWrapper option={option} height={300} />
}
