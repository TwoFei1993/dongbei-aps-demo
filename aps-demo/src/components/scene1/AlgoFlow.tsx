'use client'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 1, label: '订单池构建', desc: '按钢种/产线/交期将散单归集为候选批次，MOQ 约束过滤' },
  { id: 2, label: 'OBBT 迭代紧缩', desc: '多约束下对解空间进行分支定界，逐步排除不可行解' },
  { id: 3, label: '解池生成', desc: '保留所有满足生产约束的可行解（产能·交期·库存均满足）' },
  { id: 4, label: '可行性校验', desc: '对每个可行解进行成本·产能·交期三维测算与验证' },
  { id: 5, label: '最优解输出', desc: '按选定情景目标（产能最优/毛利最优/战略交付）选择最优方案' },
]

export function AlgoFlow() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] mb-1" style={{ color: 'var(--color-text-muted)' }}>
        点击节点查看算法说明
      </p>
      {STEPS.map((step, i) => (
        <div key={step.id}>
          <button
            onClick={() => setActive(active === step.id ? null : step.id)}
            className="w-full rounded-lg px-3 py-2 text-left text-[12px] font-semibold transition-all"
            style={{
              backgroundColor: active === step.id ? 'var(--color-primary)' : 'var(--color-primary-light)',
              color: active === step.id ? '#fff' : 'var(--color-primary)',
              border: '1px solid',
              borderColor: active === step.id ? 'var(--color-primary)' : 'var(--color-card-border)',
            }}
          >
            <span className="mr-2 opacity-60">0{step.id}</span>{step.label}
          </button>
          {active === step.id && (
            <div className="ml-4 mt-1 rounded-lg p-3 text-[11px]"
                 style={{ backgroundColor: '#f0f4ff', color: 'var(--color-text-body)', borderLeft: '3px solid var(--color-primary)' }}>
              {step.desc}
            </div>
          )}
          {i < STEPS.length - 1 && (
            <div className="flex justify-center py-0.5">
              <ChevronRight size={14} className="rotate-90" style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
