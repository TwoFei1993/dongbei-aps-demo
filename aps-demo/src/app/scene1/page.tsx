'use client'
import { useState, useCallback } from 'react'
import { AlgoFlow } from '@/components/scene1/AlgoFlow'
import { ScenarioRadar } from '@/components/scene1/ScenarioRadar'
import { ResultTable } from '@/components/scene1/ResultTable'
import { InputPanel } from '@/components/scene1/InputPanel'
import { CostModel } from '@/components/scene1/CostModel'
import { OptimizationModal } from '@/components/scene1/OptimizationModal'
import { OptimizingOverlay } from '@/components/shared/OptimizingOverlay'

export default function Scene1Page() {
  const [modalOpen, setModalOpen] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleApply = useCallback(() => {
    setIsOptimizing(true)
    setTimeout(() => setIsOptimizing(false), 3500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-title)' }}>
            场景 01 · 智能订单评审系统
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            多约束订单组合优化 · OBBT 算法 · 三情景方案决策
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          ⚙ 调整优化参数
        </button>
      </div>

      <div className="flex gap-3 text-[10px] font-medium uppercase tracking-wider">
        {['多条件约束', '订单组合优化', '交期承诺测算', '多情景决策'].map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid gap-4 items-stretch" style={{ gridTemplateColumns: '300px 1fr 360px' }}>
        <div
          className="rounded-xl p-4 flex flex-col"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-title)' }}>
            输入数据
          </h3>
          <div className="flex-1">
            <InputPanel />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-title)' }}>
              算法 · OBBT 订单组合优化模型
            </h3>
            <AlgoFlow />
          </div>
          <div
            className="relative rounded-xl p-4 flex-1"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-title)' }}>
              成本 · 交期 · 产能测算模型
            </h3>
            <CostModel />
            {isOptimizing && <OptimizingOverlay />}
          </div>
        </div>

        <div
          className="relative rounded-xl p-4 flex flex-col"
          style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-title)' }}>
            输出 · 三情景方案对比
          </h3>
          <div className="flex-1">
            <ScenarioRadar />
          </div>
          {isOptimizing && <OptimizingOverlay />}
        </div>
      </div>

      <div
        className="relative rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
      >
        <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
          订单组合优化结果（按当前情景排序）
        </h3>
        <ResultTable />
        {isOptimizing && <OptimizingOverlay />}
      </div>

      <OptimizationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={handleApply}
      />
    </div>
  )
}
