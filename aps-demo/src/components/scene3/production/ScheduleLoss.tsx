'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'

const LOSS_DATA = [
  { name: '钢种切换损失', value: 32, color: '#f59e0b' },
  { name: '设备等待',     value: 24, color: '#ef4444' },
  { name: '换辊停机',     value: 18, color: '#8b5cf6' },
  { name: '工序等待',     value: 15, color: '#4a7cdc' },
  { name: '其他',         value: 11, color: '#94a3b8' },
]

export function ScheduleLoss() {
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { fontSize: 10 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        data: LOSS_DATA.map((d) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color },
        })),
        label: { show: false },
      },
    ],
  }

  return (
    <div>
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-title)' }}>
        排产损失结构
      </p>
      <ChartWrapper option={option} height={260} />
    </div>
  )
}
