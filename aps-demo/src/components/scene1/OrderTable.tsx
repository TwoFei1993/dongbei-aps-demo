'use client'
import { useState } from 'react'
import { loadOrders } from '@/lib/data-loader'
import type { Order } from '@/types'

const ALL = loadOrders()
const GRADES = ['全部', ...new Set(ALL.map((o) => o.steelCategory).filter(Boolean))].slice(0, 8)

export function OrderTable() {
  const [category, setCategory] = useState('全部')
  const filtered: Order[] = category === '全部' ? ALL : ALL.filter((o) => o.steelCategory === category)
  const shown = filtered.slice(0, 12)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1">
        {GRADES.map((g) => (
          <button key={g} onClick={() => setCategory(g)}
            className="rounded px-2 py-0.5 text-[10px] transition-colors"
            style={{
              backgroundColor: category === g ? 'var(--color-primary)' : 'var(--color-primary-light)',
              color: category === g ? '#fff' : 'var(--color-primary)',
            }}>
            {g}
          </button>
        ))}
      </div>
      <div className="overflow-auto rounded-lg border" style={{ borderColor: 'var(--color-card-border)', maxHeight: 320 }}>
        <table className="w-full text-[11px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary-light)' }}>
              {['订单号', '钢号', '钢类', '产线', '排产量(t)', '交货状态', '超期'].map((h) => (
                <th key={h} className="px-2 py-1.5 text-left font-semibold"
                    style={{ color: 'var(--color-text-title)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((o, i) => (
              <tr key={o.orderId} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfd' }}>
                <td className="px-2 py-1 font-mono" style={{ color: 'var(--color-text-muted)' }}>{o.orderId.slice(-8)}</td>
                <td className="px-2 py-1 font-semibold" style={{ color: 'var(--color-text-title)' }}>{o.steelGrade}</td>
                <td className="px-2 py-1">{o.steelCategory}</td>
                <td className="px-2 py-1">{o.productLine}</td>
                <td className="px-2 py-1 text-right">{o.plannedTons.toFixed(1)}</td>
                <td className="px-2 py-1">{o.deliveryState}</td>
                <td className="px-2 py-1 text-center">
                  {o.isOverdue ? <span style={{ color: 'var(--color-danger)' }}>●</span> : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
        显示前 {shown.length} / {filtered.length} 条（共 {ALL.length} 条真实排产合同）
      </p>
    </div>
  )
}
