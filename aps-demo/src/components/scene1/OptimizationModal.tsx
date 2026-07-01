'use client'
import { useState, useEffect } from 'react'
import { ModalDialog } from '@/components/shared/ModalDialog'
import { useAppStore } from '@/lib/store'

interface Props { open: boolean; onClose: () => void; onApply?: () => void }

const inputCls = "w-full rounded-lg px-3 py-1.5 text-sm"
const inputStyle = {
  backgroundColor: 'var(--color-primary-light)',
  border: '1px solid var(--color-card-border)',
  color: 'var(--color-text-body)',
}
const sectionTitle = "text-[11px] font-semibold uppercase tracking-wide mb-3"
const labelCls = "text-[11px] block mb-1"
const hintCls = "text-[10px] mt-1"

const SWITCH_OPTIONS = [
  { value: 'low',    label: '低', color: '#16a34a', bg: '#dcfce7' },
  { value: 'medium', label: '中', color: '#d97706', bg: '#fef3c7' },
  { value: 'high',   label: '高', color: '#dc2626', bg: '#fee2e2' },
] as const

export function OptimizationModal({ open, onClose, onApply }: Props) {
  const { scene1Params, setScene1Params } = useAppStore()
  const [draft, setDraft] = useState({ ...scene1Params })

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setDraft({ ...scene1Params }), 0)
      return () => clearTimeout(id)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalWeight = draft.profitWeight + draft.capacityWeight + draft.deliveryWeight
  const set = <K extends keyof typeof draft>(k: K, v: typeof draft[K]) =>
    setDraft(d => ({ ...d, [k]: v }))
  const setNum = (k: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(k, Number(e.target.value) as never)

  return (
    <ModalDialog open={open} onClose={onClose} onApply={() => { setScene1Params(draft); onApply?.() }} title="调整优化参数">

      {/* 区块1：优化目标权重 */}
      <div>
        <p className={sectionTitle} style={{ color: 'var(--color-text-muted)' }}>
          优化目标权重（合计: <span style={{ color: totalWeight === 100 ? 'inherit' : '#ef4444' }}>{totalWeight}%</span>）
        </p>
        <div className="space-y-3">
          {([
            ['profitWeight',   '吨钢毛利权重',   '#10b981'],
            ['capacityWeight', '产能利用率权重', '#4a7cdc'],
            ['deliveryWeight', '战略交付权重',   '#f59e0b'],
          ] as const).map(([key, label, color]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <label className="text-[11px]" style={{ color: 'var(--color-text-body)' }}>{label}</label>
                <span className="text-[11px] font-mono font-semibold" style={{ color }}>{draft[key]}%</span>
              </div>
              <input type="range" min={0} max={100} value={draft[key]}
                onChange={(e) => set(key, Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: color }}
              />
            </div>
          ))}
        </div>
        {totalWeight !== 100 && (
          <p className="mt-2 text-[10px]" style={{ color: '#ef4444' }}>
            ⚠ 权重合计应为 100%（当前 {totalWeight}%）
          </p>
        )}
      </div>

      {/* 区块2：连铸约束 */}
      <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem' }}>
        <p className={sectionTitle} style={{ color: 'var(--color-text-muted)' }}>连铸约束</p>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>浇次最小炉次数 MOQ_min</label>
            <input type="number" min={1} max={draft.moqMax} value={draft.moqMin}
              onChange={setNum('moqMin')} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>浇次最大炉次数 MOQ_max</label>
            <input type="number" min={draft.moqMin} max={20} value={draft.moqMax}
              onChange={setNum('moqMax')} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>混浇坯单次上限 (t)</label>
            <input type="number" min={20} max={150} step={10} value={draft.maxMixedCastTons}
              onChange={setNum('maxMixedCastTons')} className={inputCls} style={inputStyle} />
          </div>
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>钢种切换成本等级</label>
          <div className="flex gap-2 mb-1">
            {SWITCH_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => set('switchCostLevel', opt.value)}
                className="flex-1 rounded-lg py-1 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: draft.switchCostLevel === opt.value ? opt.bg : 'var(--color-primary-light)',
                  color: draft.switchCostLevel === opt.value ? opt.color : 'var(--color-text-muted)',
                  border: `1px solid ${draft.switchCostLevel === opt.value ? opt.color : 'var(--color-card-border)'}`,
                }}>
                {opt.label}
              </button>
            ))}
          </div>
          <p className={hintCls} style={{ color: 'var(--color-text-muted)' }}>
            高=优先同钢种连续排产，中=允许少量切换，低=不限制切换
          </p>
        </div>
      </div>

      {/* 区块3：订单优先级与ATP */}
      <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem' }}>
        <p className={sectionTitle} style={{ color: 'var(--color-text-muted)' }}>订单优先级与 ATP</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>A类客户最小批量 (t)</label>
            <input type="number" min={50} max={500} step={50} value={draft.priorityAMinTons}
              onChange={setNum('priorityAMinTons')} className={inputCls} style={inputStyle} />
            <p className={hintCls} style={{ color: 'var(--color-text-muted)' }}>超过此吨位的订单自动升为A类优先处理</p>
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>ATP 承诺窗口 (天)</label>
            <input type="number" min={1} max={14} value={draft.atpWindowDays}
              onChange={setNum('atpWindowDays')} className={inputCls} style={inputStyle} />
            <p className={hintCls} style={{ color: 'var(--color-text-muted)' }}>系统可承诺交期的最大提前量</p>
          </div>
        </div>
      </div>

      {/* 区块4：规划参数 */}
      <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem' }}>
        <p className={sectionTitle} style={{ color: 'var(--color-text-muted)' }}>规划参数</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--color-text-body)' }}>规划周期 (天)</label>
            <input type="number" min={1} max={30} value={draft.horizonDays}
              onChange={setNum('horizonDays')} className={inputCls} style={inputStyle} />
          </div>
        </div>
      </div>

      <p className="text-[10px] rounded-lg px-3 py-2" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-primary-light)' }}>
        参数调整后点击「应用」，系统将重新计算各情景下的毛利、产能占用与交期指标。
      </p>
    </ModalDialog>
  )
}
