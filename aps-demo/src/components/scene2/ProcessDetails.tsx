'use client'
import { useAppStore } from '@/lib/store'

interface ProcessCard {
  name: string
  color: string
  input: string
  constraint: string
  model: string
  output: string
}

interface BadgeProps {
  label: string
  bg: string
  text: string
}

function Badge({ label, bg, text }: BadgeProps) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 shrink-0"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}

function ProcessCardItem({ process }: { process: ProcessCard }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        borderLeft: `3px solid ${process.color}`,
      }}
    >
      <h4 className="text-sm font-bold" style={{ color: process.color }}>
        {process.name}
      </h4>
      <div className="flex flex-col gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <div className="flex items-start">
          <Badge label="输入" bg="var(--color-card-border)" text="var(--color-text-muted)" />
          <span className="leading-relaxed">{process.input}</span>
        </div>
        <div className="flex items-start">
          <Badge label="约束" bg="#fff3cd" text="#92400e" />
          <span className="leading-relaxed">{process.constraint}</span>
        </div>
        <div className="flex items-start">
          <Badge label="模型" bg="#e0e7ff" text="#3730a3" />
          <span className="leading-relaxed">{process.model}</span>
        </div>
        <div className="flex items-start">
          <Badge label="输出" bg="#d1fae5" text="#065f46" />
          <span className="leading-relaxed">{process.output}</span>
        </div>
      </div>
    </div>
  )
}

export function ProcessDetails() {
  const { scene2Params: p } = useAppStore()

  const processes: ProcessCard[] = [
    {
      name: '连铸智能组浇',
      color: '#4a7cdc',
      input: '订单池 · 钢种冶金规范 · 浇次约束规则',
      constraint: `MOQ ${p.castingMoqMin}-${p.castingMoqMax}炉 | 混浇坯≤${p.maxMixedCastTons}t/次 | 钢种切换成本矩阵`,
      model: '订单凑批 → 浇次编排 → 钢种排序优化',
      output: `${p.horizon}h浇次计划 · 出坯计划`,
    },
    {
      name: '加热炉-轧线协同',
      color: '#f59e0b',
      input: '出坯计划 · 加热工艺标准库 · 炉机状态',
      constraint: `炉-线产能匹配 | ΔT≤${p.heatGroupDelta}°分组 | 热送时间窗口`,
      model: '装炉分组 → 加热时间预测 → 出炉节拍匹配',
      output: '装炉/出炉计划 · 空耗预警',
    },
    {
      name: '轧线智能组辊优化',
      color: '#10b981',
      input: '轧辊台账 · 规格-辊型映射库 · 订单结构',
      constraint: `辊期约束 | 辊型兼容性分组 | 换辊窗口${p.rollChangePeriodHours}h预留`,
      model: '订单分组 → 辊型匹配 → 辊期排序优化',
      output: '轧制排程计划 · 轧线节拍需求',
    },
    {
      name: '精整工序排产',
      color: '#8b5cf6',
      input: '轧制完工计划 · 客户交期与优先级 · 精整资源状态',
      constraint: '精整设备约束 | 交期倒排调度 | 资源平衡',
      model: '退火/探伤/矫直排程 → 交付节点倒排 → 资源平衡',
      output: '精整排程计划 · 交付承诺',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {processes.map((proc) => (
        <ProcessCardItem key={proc.name} process={proc} />
      ))}
    </div>
  )
}
