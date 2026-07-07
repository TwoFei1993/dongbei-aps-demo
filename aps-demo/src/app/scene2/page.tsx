'use client'
import { useState, useCallback } from 'react'
import { CrossGantt } from '@/components/scene2/CrossGantt'
import { ScheduleInputs } from '@/components/scene2/ScheduleInputs'
import { ProcessDetails } from '@/components/scene2/ProcessDetails'
import { ScheduleParamsModal } from '@/components/scene2/ScheduleParamsModal'
import { OptimizingOverlay } from '@/components/shared/OptimizingOverlay'

export default function Scene2Page() {
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
            场景 02A · 全流程跨工序动态排程
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            四工序协同甘特图 · 排程窗口 · 点击色块高亮同批次
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          ⚙ 调整排程约束
        </button>
      </div>

      <ScheduleParamsModal open={modalOpen} onClose={() => setModalOpen(false)} onApply={handleApply} />

      <div className="grid gap-4 items-stretch" style={{ gridTemplateColumns: 'minmax(300px, 380px) minmax(0, 1fr)' }}>
        <div className="relative rounded-xl p-4" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            排程输入参数
          </h3>
          <ScheduleInputs />
          {isOptimizing && <OptimizingOverlay />}
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            工序排程逻辑
          </h3>
          <ProcessDetails />
        </div>
      </div>

      <div
        className="relative rounded-xl p-4"
        style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
      >
        <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
          跨工序甘特图（排程窗口）
        </h3>
        <CrossGantt />
        {isOptimizing && <OptimizingOverlay />}
      </div>
    </div>
  )
}
