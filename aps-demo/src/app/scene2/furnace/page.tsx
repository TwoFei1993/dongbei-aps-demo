'use client'

import { useState, useCallback } from 'react'
import { FurnaceModel } from '@/components/scene2/FurnaceModel'
import { FurnaceInputs } from '@/components/scene2/FurnaceInputs'
import { FurnaceParamsModal } from '@/components/scene2/FurnaceParamsModal'
import { OptimizingOverlay } from '@/components/shared/OptimizingOverlay'

// 历史统计基准值（典型改善区间），非实时数据，不随下方三模型步进器参数变化
const IMPROVEMENTS = [
  { value: '-50%', label: '轧线等炉停机', sub: '14% → 8% 损失',  color: '#10b981' },
  { value: '+6%',  label: 'OEE 提升',     sub: '大棒线整线',     color: '#4a7cdc' },
  { value: '-8%',  label: '加热/均热能耗', sub: '煤气单耗降低',   color: '#f59e0b' },
  { value: '+15%', label: '热装热送率',    sub: '冷装率同步降低', color: '#8b5cf6' },
]

export default function FurnacePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleApply = useCallback(() => {
    setIsOptimizing(true)
    setTimeout(() => setIsOptimizing(false), 3500)
  }, [])

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-title)' }}>
            场景 02B · 加热炉出炉节拍预测与模铸均热协同
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            三层协同模型 · 预测精度 ±5min · 基于第二轧钢厂过程分析数据
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          ⚙ 调整炉参数
        </button>
      </div>

      {/* 改善效果卡片（历史统计典型值，非实时） */}
      <div className="grid grid-cols-4 gap-3">
        {IMPROVEMENTS.map((imp) => (
          <div
            key={imp.value}
            className="relative rounded-xl px-4 py-3 text-center"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            <span
              className="absolute top-1.5 right-1.5 rounded px-1 text-[9px] font-medium"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-text-muted)' }}
            >
              典型值
            </span>
            <p className="text-xl font-bold" style={{ color: imp.color }}>{imp.value}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--color-text-title)' }}>
              {imp.label}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{imp.sub}</p>
          </div>
        ))}
      </div>

      {/* 主体内容 */}
      <div className="grid gap-6 items-start" style={{ gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)' }}>
        {/* 左栏：输入数据面板 */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            输入数据
          </h3>
          <FurnaceInputs />
        </div>

        {/* 右栏：三模型步进器 */}
        <div
          className="relative rounded-xl p-4 space-y-4"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            三模型协同步进器
          </h3>
          <FurnaceModel />
          {isOptimizing && <OptimizingOverlay />}
        </div>
      </div>

      <FurnaceParamsModal open={modalOpen} onClose={() => setModalOpen(false)} onApply={handleApply} />
    </div>
  )
}
