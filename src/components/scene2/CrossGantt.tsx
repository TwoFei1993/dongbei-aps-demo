'use client'

import { useState, useMemo } from 'react'
import { ChartWrapper } from '@/components/shared/ChartWrapper'
import { loadGantt } from '@/lib/data-loader'
import type { GanttTask } from '@/types'

const STAGE_COLORS: Record<GanttTask['stage'], string> = {
  casting: '#4a7cdc',
  heating: '#f59e0b',
  rolling: '#10b981',
  finishing: '#8b5cf6',
}

const STAGE_LABELS: Record<GanttTask['stage'], string> = {
  casting: '连铸',
  heating: '加热',
  rolling: '轧制',
  finishing: '精整',
}

const BASE_TIME = new Date('2026-06-21T00:00:00').getTime()
const WINDOW_MS = 72 * 60 * 60 * 1000

export function CrossGantt() {
  const tasks = useMemo(() => loadGantt(), [])
  const [highlightBatch, setHighlightBatch] = useState<string | null>(null)

  const equipments = useMemo(
    () => [...new Set(tasks.map((t) => t.equipment))],
    [tasks]
  )

  const events = useMemo(
    () => ({
      click: (params: unknown) => {
        const p = params as { data?: { value?: [number, number, number, GanttTask] } }
        const batchId = p.data?.value?.[3]?.batchId ?? null
        setHighlightBatch((prev) => (prev === batchId ? null : batchId))
      },
    }),
    []
  )

  const option = useMemo(() => {
    const series = [{
      type: 'custom',
      renderItem: (
        _params: unknown,
        api: {
          value: (idx: number) => number
          coord: (val: [number, number]) => [number, number]
          size: (val: [number, number]) => [number, number]
          style: () => Record<string, unknown>
        }
      ) => {
        const startVal = api.value(0)
        const endVal = api.value(1)
        const yIdx = api.value(2)

        const start = api.coord([startVal, yIdx])
        const end = api.coord([endVal, yIdx])
        const height = api.size([0, 1])[1] * 0.7
        const x = start[0]
        const y = start[1] - height / 2
        const width = end[0] - start[0]

        return {
          type: 'rect',
          shape: { x, y, width: Math.max(width, 2), height },
          style: api.style(),
          focus: 'self',
        }
      },
      encode: { x: [0, 1], y: 2 },
      data: tasks.map((t) => {
        const start = new Date(t.startTime).getTime() - BASE_TIME
        const end = new Date(t.endTime).getTime() - BASE_TIME
        const yIdx = equipments.indexOf(t.equipment)
        const color = STAGE_COLORS[t.stage]
        const opacity =
          highlightBatch === null ? 1 : t.batchId === highlightBatch ? 1 : 0.2
        return {
          value: [start, end, yIdx, t],
          itemStyle: { color, opacity },
        }
      }),
    }]

    return {
      animation: false,
      legend: {
        data: Object.entries(STAGE_LABELS).map(([key, label]) => ({
          name: label,
          itemStyle: { color: STAGE_COLORS[key as GanttTask['stage']] },
        })),
        textStyle: { color: '#94a3b8' },
        top: 4,
      },
      tooltip: {
        formatter: (params: { data?: { value?: [number, number, number, GanttTask] } }) => {
          const t = params.data?.value?.[3]
          if (!t) return ''
          return [
            `<b>${STAGE_LABELS[t.stage]}</b> · ${t.equipment}`,
            `钢种: ${t.steelGrade}`,
            `规格: ${t.spec}`,
            `批次: ${t.batchId}`,
          ].join('<br/>')
        },
      },
      grid: { left: 100, right: 20, top: 50, bottom: 30 },
      xAxis: {
        type: 'value',
        min: 0,
        max: WINDOW_MS,
        axisLabel: {
          formatter: (val: number) => `${Math.round(val / 3600000)}h`,
          color: '#94a3b8',
        },
        splitLine: { lineStyle: { color: '#334155' } },
      },
      yAxis: {
        type: 'category',
        data: equipments,
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series,
    }
  }, [tasks, equipments, highlightBatch])

  return (
    <div data-testid="cross-gantt-chart">
      <ChartWrapper option={option} height={420} onEvents={events} />
    </div>
  )
}
