'use client'
import { useAppStore } from '@/lib/store'
import { loadOrderGroups } from '@/lib/data-loader'

const groups = loadOrderGroups()

const STATUS_COLORS = {
  optimal: { bg: '#dcfce7', text: '#16a34a', label: '最优解' },
  feasible: { bg: '#eff4ff', text: '#4a7cdc', label: '有效解' },
}

export function ResultTable() {
  const { scenario } = useAppStore()
  const sorted = [...groups].sort((a, b) =>
    scenario === 'profit' ? b.grossProfitPerTon - a.grossProfitPerTon :
    scenario === 'capacity' ? b.totalTons - a.totalTons :
    a.earliestDelivery.localeCompare(b.earliestDelivery)
  )

  return (
    <div className="overflow-auto rounded-lg border" style={{ borderColor: 'var(--color-card-border)' }}>
      <table className="w-full text-[11px]">
        <thead>
          <tr style={{ backgroundColor: 'var(--color-primary-light)' }}>
            {['组号', '钢号', '订单数', '总吨位', '最早交期', '毛利(元/t)', '产能占用', '状态'].map((h) => (
              <th key={h} className="px-2 py-1.5 text-left font-semibold"
                  style={{ color: 'var(--color-text-title)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((g, i) => {
            const s = STATUS_COLORS[g.status]
            return (
              <tr key={g.groupId} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfd' }}>
                <td className="px-2 py-1.5 font-bold" style={{ color: 'var(--color-primary)' }}>{g.groupId}</td>
                <td className="px-2 py-1.5 font-semibold" style={{ color: 'var(--color-text-title)' }}>{g.steelGrade}</td>
                <td className="px-2 py-1.5 text-center">{g.orderCount}</td>
                <td className="px-2 py-1.5 text-right">{g.totalTons}t</td>
                <td className="px-2 py-1.5">{g.earliestDelivery}</td>
                <td className="px-2 py-1.5 text-right font-semibold" style={{ color: 'var(--color-text-title)' }}>
                  {g.grossProfitPerTon.toLocaleString()}
                </td>
                <td className="px-2 py-1.5">{g.capacityUsage}</td>
                <td className="px-2 py-1.5">
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
