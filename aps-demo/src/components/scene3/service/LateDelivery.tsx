'use client'
import { ChartWrapper } from '@/components/shared/ChartWrapper'

const ITEMS = [
  { customer: '宝钢集团',  steelGrade: 'Q345B',   tons: 280, delayDays: 8 },
  { customer: '中联重科',  steelGrade: '42CrMo',  tons: 165, delayDays: 6 },
  { customer: '三一重工',  steelGrade: 'GCr15',   tons: 92,  delayDays: 4 },
  { customer: '徐工机械',  steelGrade: 'H13',     tons: 78,  delayDays: 3 },
  { customer: '中铁建设',  steelGrade: 'HRB400',  tons: 340, delayDays: 2 },
]

function delayColor(days: number) {
  if (days >= 7) return '#dc2626'
  if (days >= 4) return '#f59e0b'
  return '#eab308'
}

export function LateDelivery() {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: { dataIndex: number }[]) => {
        const i = params[0].dataIndex
        const d = ITEMS[i]
        return `${d.customer}<br/>${d.steelGrade} · ${d.tons}t<br/>延迟 <b style="color:${delayColor(d.delayDays)}">${d.delayDays}天</b>`
      },
    },
    grid: { top: 8, right: 48, bottom: 20, left: 60 },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => `${v}天`, fontSize: 10 },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    yAxis: {
      type: 'category',
      data: ITEMS.map((d) => d.customer),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: ITEMS.map((d) => ({
          value: d.delayDays,
          itemStyle: { color: delayColor(d.delayDays), borderRadius: [0, 3, 3, 0] },
        })),
        barWidth: '55%',
        label: { show: true, position: 'right', formatter: '{c}天', fontSize: 10, color: '#64748b' },
      },
    ],
  }

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-card-border)' }}>
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-title)' }}>
        延迟交付 Top5（天）
      </p>
      <ChartWrapper option={option} height={190} />
    </div>
  )
}

