'use client'

import { useState } from 'react'
import { Settings, Package, FileText, BarChart2, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  icon: React.ReactNode
  label: string
  items: string[]
}

const CATEGORIES: Category[] = [
  {
    id: 'process',
    icon: <Settings size={14} />,
    label: '生产工艺约束条件',
    items: ['工艺路径库', '各工序最小订单量(MOQ)', '浇次约束规则', '钢种截面匹配矩阵', '产线能力日历', '检修计划'],
  },
  {
    id: 'inventory',
    icon: <Package size={14} />,
    label: '库存数据',
    items: ['原料库存', '在制品库存', '成品库存', '备坯要求'],
  },
  {
    id: 'order',
    icon: <FileText size={14} />,
    label: '订单信息',
    items: ['钢种/冶金规范', '规格/数量/交期', '客户优先级分类', 'ATP承诺校验'],
  },
  {
    id: 'finance',
    icon: <BarChart2 size={14} />,
    label: '财务数据',
    items: ['标准成本参数', '吨钢毛利基准', '历史成本数据'],
  },
]

export function InputPanel() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id))
  )
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="space-y-1">
      {CATEGORIES.map((cat) => {
        const isOpen = openIds.has(cat.id)
        return (
          <div key={cat.id}>
            <button
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
              style={
                isOpen
                  ? {
                      backgroundColor: 'var(--color-primary-light)',
                      borderLeft: '3px solid var(--color-primary)',
                      color: 'var(--color-text-title)',
                    }
                  : {
                      borderLeft: '3px solid transparent',
                      color: 'var(--color-text-body)',
                    }
              }
            >
              <span className="flex items-center gap-2 text-[12px] font-medium">
                {cat.icon}
                {cat.label}
              </span>
              <ChevronDown
                size={12}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: 'var(--color-text-muted)',
                }}
              />
            </button>
            {isOpen && (
              <ul className="mt-1 ml-6 mb-2 space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px]"
                      style={{ color: 'var(--color-text-body)' }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
