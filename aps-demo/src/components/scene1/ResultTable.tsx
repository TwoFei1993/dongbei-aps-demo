'use client'
import { useAppStore } from '@/lib/store'
import { loadOrderGroups } from '@/lib/data-loader'
import type { OrderGroup } from '@/types'

const groups = loadOrderGroups()

const STATUS_COLORS = {
  optimal:  { bg: '#dcfce7', text: '#16a34a', label: '最优解' },
  feasible: { bg: '#eff4ff', text: '#4a7cdc', label: '有效解' },
}

// ATP 超期基准：今天 + atpWindowDays*2
function atpDeadline(atpWindowDays: number): string {
  const d = new Date('2026-06-30')
  d.setDate(d.getDate() + atpWindowDays * 2)
  return d.toISOString().slice(0, 10)
}

function resolveStatus(
  g: OrderGroup,
  switchCostLevel: 'low' | 'medium' | 'high',
  moqMin: number,
  moqMax: number,
): 'optimal' | 'feasible' {
  const moqOk = g.orderCount >= moqMin && g.orderCount <= moqMax
  if (!moqOk) return 'feasible'
  if (switchCostLevel === 'high') {
    // 高切换成本：只有 orderCount 足够多（认为同钢种概率高）才是 optimal
    return g.orderCount >= moqMin * 2 ? 'optimal' : 'feasible'
  }
  if (switchCostLevel === 'low') {
    // 低切换成本：只要满足 MOQ 就 optimal
    return 'optimal'
  }
  // medium：沿用原始 status
  return g.status
}

export function ResultTable() {
  const { scenario, scene1Params: p } = useAppStore()

  const deadline = atpDeadline(p.atpWindowDays)

  const sorted = [...groups].sort((a, b) =>
    scenario === 'profit'   ? b.grossProfitPerTon - a.grossProfitPerTon :
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
            const status = resolveStatus(g, p.switchCostLevel, p.moqMin, p.moqMax)
            const s = STATUS_COLORS[status]
            const isA = g.totalTons >= p.priorityAMinTons
            const atpWarn = g.earliestDelivery > deadline
            return (
              <tr key={g.groupId} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfd' }}>
                <td className="px-2 py-1.5 font-bold" style={{ color: 'var(--color-primary)' }}>{g.groupId}</td>
                <td className="px-2 py-1.5 font-semibold" style={{ color: 'var(--color-text-title)' }}>
                  {isA && (
                    <span className="inline-block rounded px-1 mr-1 text-[9px] font-bold"
                          style={{ backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #fdba74' }}>
                      A
                    </span>
                  )}
                  {g.steelGrade}
                </td>
                <td className="px-2 py-1.5 text-center">{g.orderCount}</td>
                <td className="px-2 py-1.5 text-right">{g.totalTons.toLocaleString()}t</td>
                <td className="px-2 py-1.5">
                  {g.earliestDelivery}
                  {atpWarn && <span className="ml-1 text-[10px]" style={{ color: '#ef4444' }}>⚠</span>}
                </td>
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
