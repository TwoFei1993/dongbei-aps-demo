'use client'
import { useState } from 'react'
import { ModalDialog } from '@/components/shared/ModalDialog'
import { useAppStore } from '@/lib/store'

interface Props { open: boolean; onClose: () => void; onApply?: () => void }

const LABEL_STYLE = { color: 'var(--color-text-body)' }
const INPUT_STYLE = {
  backgroundColor: 'var(--color-primary-light)',
  border: '1px solid var(--color-card-border)',
  color: 'var(--color-text-body)',
}
const SECTION_STYLE = { borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem' }

function ToggleGroup({ options, value, onChange, colors }: {
  options: { label: string; value: string | number }[]
  value: string | number
  onChange: (v: string | number) => void
  colors?: string[]
}) {
  return (
    <div className="flex gap-2">
      {options.map((o, i) => {
        const active = value === o.value
        const activeColor = colors?.[i] ?? 'var(--color-primary)'
        return (
          <button key={String(o.value)} onClick={() => onChange(o.value)}
            className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: active ? activeColor : 'var(--color-primary-light)',
              color: active ? '#ffffff' : 'var(--color-text-body)',
              border: `1px solid ${active ? activeColor : 'var(--color-card-border)'}`,
            }}
          >{o.label}</button>
        )
      })}
    </div>
  )
}

export function ScheduleParamsModal({ open, onClose, onApply }: Props) {
  const { scene2Params, setScene2Params } = useAppStore()
  const [draft, setDraft] = useState({ ...scene2Params })

  const [prevOpen, setPrevOpen] = useState(open)
  if (open && !prevOpen) { setPrevOpen(true); setDraft({ ...scene2Params }) }
  else if (!open && prevOpen) { setPrevOpen(false) }

  const set = <K extends keyof typeof draft>(k: K, v: typeof draft[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  return (
    <ModalDialog open={open} onClose={onClose} onApply={() => { setScene2Params(draft); onApply?.() }} title="调整排程约束">
      {/* 区块1：排程总参数 */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-[11px] block mb-1.5" style={LABEL_STYLE}>排程窗口</label>
          <ToggleGroup
            options={[{ label: '48h', value: 48 }, { label: '72h', value: 72 }, { label: '96h', value: 96 }]}
            value={draft.horizon}
            onChange={(v) => set('horizon', v as 48 | 72 | 96)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] block mb-1" style={LABEL_STYLE}>在线设备台数</label>
            <input type="number" min={1} max={12} value={draft.equipmentCount}
              onChange={(e) => set('equipmentCount', Number(e.target.value))}
              className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
            />
          </div>
          <div>
            <label className="text-[11px] block mb-1" style={LABEL_STYLE}>工艺路径规则数</label>
            <input type="number" min={10} max={100} value={draft.ruleCount}
              onChange={(e) => set('ruleCount', Number(e.target.value))}
              className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] block mb-1.5" style={LABEL_STYLE}>优化目标</label>
          <ToggleGroup
            options={[
              { label: '交付优先', value: 'delivery' },
              { label: '成本优先', value: 'cost' },
              { label: '均衡', value: 'balanced' },
            ]}
            value={draft.optimizeTarget}
            onChange={(v) => set('optimizeTarget', v as 'delivery' | 'cost' | 'balanced')}
            colors={['#2563eb', '#16a34a', '#ea580c']}
          />
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
            {draft.optimizeTarget === 'delivery' && '最大化准时率，接受更高能耗'}
            {draft.optimizeTarget === 'cost' && '最小化切换损失，接受少量延期'}
            {draft.optimizeTarget === 'balanced' && '交付与成本加权平衡'}
          </p>
        </div>
      </div>

      {/* 区块2：连铸约束 */}
      <div style={SECTION_STYLE} className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text-title)' }}>
          连铸约束
          <span className="font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>
            （来自设计规范：MOQ 4-8炉，混浇坯≤70t）
          </span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] block mb-1" style={LABEL_STYLE}>浇次最小炉次 MOQ_min</label>
            <input type="number" min={1} max={draft.castingMoqMax} step={1} value={draft.castingMoqMin}
              onChange={(e) => set('castingMoqMin', Math.min(Number(e.target.value), draft.castingMoqMax))}
              className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
            />
          </div>
          <div>
            <label className="text-[11px] block mb-1" style={LABEL_STYLE}>浇次最大炉次 MOQ_max</label>
            <input type="number" min={draft.castingMoqMin} max={20} step={1} value={draft.castingMoqMax}
              onChange={(e) => set('castingMoqMax', Math.max(Number(e.target.value), draft.castingMoqMin))}
              className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px]" style={LABEL_STYLE}>混浇坯单次上限 (t)</label>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              ≤{draft.maxMixedCastTons}t/次
            </span>
          </div>
          <input type="range" min={40} max={100} step={5} value={draft.maxMixedCastTons}
            onChange={(e) => set('maxMixedCastTons', Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            <span>40t</span><span>100t</span>
          </div>
        </div>
      </div>

      {/* 区块3：加热约束 */}
      <div style={SECTION_STYLE} className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text-title)' }}>
          加热约束
          <span className="font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>
            （ΔT分组减少炉内温度波动）
          </span>
        </p>
        <div>
          <label className="text-[11px] block mb-1" style={LABEL_STYLE}>温度分组阈值 ΔT (°C)</label>
          <select value={draft.heatGroupDelta}
            onChange={(e) => set('heatGroupDelta', Number(e.target.value))}
            className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
          >
            {[30, 40, 50, 60, 70].map(v => (
              <option key={v} value={v}>{v} °C</option>
            ))}
          </select>
          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
            同组内温度差≤ΔT的品种连续装炉
          </p>
        </div>
      </div>

      {/* 区块4：轧线约束 */}
      <div style={SECTION_STYLE} className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text-title)' }}>轧线约束</p>
        <div>
          <label className="text-[11px] block mb-1" style={LABEL_STYLE}>换辊周期 (h)</label>
          <input type="number" min={12} max={48} step={4} value={draft.rollChangePeriodHours}
            onChange={(e) => set('rollChangePeriodHours', Number(e.target.value))}
            className="w-full rounded-lg px-3 py-1.5 text-sm" style={INPUT_STYLE}
          />
          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
            每隔此周期预留换辊窗口，影响轧制排序
          </p>
        </div>
      </div>

      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
        约束越严（MOQ范围窄、ΔT小），排程质量越高但求解耗时增加。
      </p>
    </ModalDialog>
  )
}
