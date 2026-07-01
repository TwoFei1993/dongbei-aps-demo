'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'

const ALERTS = [
  { productLine: '大型材', deviation: -18.5, reason: '原料供应延迟' },
  { productLine: '银亮材', deviation: -12.3, reason: '设备检修' },
  { productLine: '模具',   deviation: -8.7,  reason: '订单临时追加' },
  { productLine: '线材',   deviation: 6.2,   reason: '计划超额完成' },
  { productLine: '精密',   deviation: -5.1,  reason: '工艺参数调整' },
]

export function DeviationAlert() {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: { dataIndex: number }[]) => {
        const a = ALERTS[params[0].dataIndex]
        const sign = a.deviation > 0 ? '+' : ''
        const color = a.deviation < 0 ? '#dc2626' : '#16a34a'
        return `${a.productLine}<br/>${a.reason}<br/>偏差 <b style="color:${color}">${sign}${a.deviation}%</b>`
      },
    },
    grid: { top: 8, right: 48, bottom: 20, left: 54 },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => `${v}%`, fontSize: 10 },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    yAxis: {
      type: 'category',
      data: ALERTS.map((a) => a.productLine),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: ALERTS.map((a) => ({
          value: a.deviation,
          itemStyle: {
            color: a.deviation < 0 ? '#ef4444' : '#10b981',
            borderRadius: a.deviation < 0 ? [3, 0, 0, 3] : [0, 3, 3, 0],
          },
        })),
        barWidth: '55%',
        label: {
          show: true,
          position: 'right',
          formatter: (p: { value: number }) => `${p.value > 0 ? '+' : ''}${p.value}%`,
          fontSize: 10,
          color: '#64748b',
        },
      },
    ],
  }

  return (
    <div>
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-title)' }}>
        供给偏差预警 Top5
      </p>
      <ChartWrapper option={option} height={170} />
    </div>
  )
}

