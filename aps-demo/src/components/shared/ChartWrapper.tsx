'use client'

import dynamic from 'next/dynamic'

// SSR-safe: ECharts uses browser APIs (canvas/WebGL), so disable SSR entirely
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

interface ChartWrapperProps {
  option: Record<string, unknown>
  height?: number
  onEvents?: Record<string, (params: unknown) => void>
}

export function ChartWrapper({ option, height = 300, onEvents }: ChartWrapperProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      onEvents={onEvents}
      notMerge
      lazyUpdate
    />
  )
}
