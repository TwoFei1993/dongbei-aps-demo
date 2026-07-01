'use client'
import { useState, useEffect } from 'react'
import { ModalDialog } from '@/components/shared/ModalDialog'
import { useAppStore } from '@/lib/store'

interface Props {
  open: boolean
  onClose: () => void
  onApply?: () => void
}

const labelStyle = { color: 'var(--color-text-body)' } as const
const muteStyle  = { color: 'var(--color-text-muted)' } as const
const inputStyle = {
  backgroundColor: 'var(--color-primary-light)',
  border: '1px solid var(--color-card-border)',
  color: 'var(--color-text-body)',
} as const
const sectionStyle = {
  borderTop: '1px solid var(--color-card-border)',
  paddingTop: '0.875rem',
  marginTop: '0.875rem',
} as const

export function FurnaceParamsModal({ open, onClose, onApply }: Props) {
  const { furnaceParams, setFurnaceParams } = useAppStore()
  const [draft, setDraft] = useState({ ...furnaceParams })

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setDraft({ ...furnaceParams }), 0)
      return () => clearTimeout(id)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof typeof draft>(key: K, val: (typeof draft)[K]) =>
    setDraft(d => ({ ...d, [key]: val }))

  return (
    <ModalDialog open={open} onClose={onClose} onApply={() => { setFurnaceParams(draft); onApply?.() }} title="调整加热炉参数">

      {/* ── 区块1：加热温度控制 ── */}
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
        区块 1 · 加热温度控制
      </p>

      {/* 目标加热温度 */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px]" style={labelStyle}>目标加热温度 (°C)</label>
          <span className="text-[11px] font-mono font-semibold" style={{ color: '#f59e0b' }}>{draft.targetTemp}°C</span>
        </div>
        <input
          type="range" min={1150} max={1280} step={10} value={draft.targetTemp}
          onChange={e => set('targetTemp', Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#f59e0b' }}
        />
        <div className="flex justify-between text-[10px] mt-0.5" style={muteStyle}>
          <span>1150°C</span><span>1280°C</span>
        </div>
        <p className="text-[10px] mt-1" style={muteStyle}>低温节能但强度下降，高温提升轧制性能但增加氧化烧损</p>
      </div>

      {/* 均热保温时间 */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px]" style={labelStyle}>均热保温时间 (min)</label>
          <span className="text-[11px] font-mono font-semibold" style={{ color: '#4a7cdc' }}>{draft.soakingTime} min</span>
        </div>
        <input
          type="number" min={20} max={90} step={5} value={draft.soakingTime}
          onChange={e => set('soakingTime', Number(e.target.value))}
          className="w-full rounded-lg px-3 py-1.5 text-sm"
          style={inputStyle}
        />
        <p className="text-[10px] mt-1" style={muteStyle}>均热时间越长，断面温度均匀度越高，但炉子产能降低</p>
      </div>

      {/* ── 区块2：装炉分组与热装 ── */}
      <div style={sectionStyle}>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-primary)' }}>
          区块 2 · 装炉分组与热装
        </p>

        {/* 温度分组阈值 */}
        <div className="mb-3">
          <label className="text-[11px] block mb-1" style={labelStyle}>温度分组阈值 ΔT (°C)</label>
          <select
            value={draft.tempGroupDelta}
            onChange={e => set('tempGroupDelta', Number(e.target.value))}
            className="w-full rounded-lg px-3 py-1.5 text-sm"
            style={inputStyle}
          >
            {[20, 30, 40, 50, 60, 70].map(v => <option key={v} value={v}>ΔT ≤ {v}°C</option>)}
          </select>
          <p className="text-[10px] mt-1" style={muteStyle}>同组内钢坯温差 ≤ΔT 连续装炉，ΔT 越小分组越细，炉内均匀性越好</p>
        </div>

        {/* 热装率目标 */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <label className="text-[11px]" style={labelStyle}>热装率目标 (%)</label>
            <span className="text-[11px] font-mono font-semibold" style={{ color: '#8b5cf6' }}>{draft.hotChargeRate}%</span>
          </div>
          <input
            type="range" min={40} max={90} step={5} value={draft.hotChargeRate}
            onChange={e => set('hotChargeRate', Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#8b5cf6' }}
          />
          <div className="flex justify-between text-[10px] mt-0.5" style={muteStyle}>
            <span>40%</span><span>90%</span>
          </div>
          <p className="text-[10px] mt-1" style={muteStyle}>热装率越高，能耗越低；需保证来料温度 ≥ 最低入炉温度</p>
        </div>

        {/* 热装最低入炉温度 */}
        <div>
          <label className="text-[11px] block mb-1" style={labelStyle}>热装最低入炉温度 (°C)</label>
          <input
            type="number" min={600} max={950} step={50} value={draft.hotChargeMinTemp}
            onChange={e => set('hotChargeMinTemp', Number(e.target.value))}
            className="w-full rounded-lg px-3 py-1.5 text-sm"
            style={inputStyle}
          />
          <p className="text-[10px] mt-1" style={muteStyle}>低于此温度的钢坯视为冷装，按冷装工艺处理</p>
        </div>
      </div>

      {/* ── 区块3：炉体容量 ── */}
      <div style={sectionStyle}>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-primary)' }}>
          区块 3 · 炉体容量
        </p>
        <div>
          <label className="text-[11px] block mb-1" style={labelStyle}>加热炉容量 (块)</label>
          <input
            type="number" min={4} max={24} step={2} value={draft.furnaceCapacity}
            onChange={e => set('furnaceCapacity', Number(e.target.value))}
            className="w-full rounded-lg px-3 py-1.5 text-sm"
            style={inputStyle}
          />
          <p className="text-[10px] mt-1" style={muteStyle}>加热炉当前有效装载块数上限，影响炉-线节奏匹配计算</p>
        </div>
      </div>

      {/* 底部说明 */}
      <p className="text-[10px] rounded-lg px-3 py-2" style={{ ...muteStyle, backgroundColor: 'var(--color-primary-light)' }}>
        参数调整后点击「应用」，加热预测曲线、装炉分组和炉线节奏图将实时更新。
      </p>
    </ModalDialog>
  )
}
