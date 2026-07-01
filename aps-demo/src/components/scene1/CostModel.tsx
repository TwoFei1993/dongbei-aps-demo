'use client'
import { useAppStore } from '@/lib/store'
import type { Scene1Params } from '@/types'

const SCENARIO_COLOR = {
  capacity: '#4a7cdc',
  profit:   '#10b981',
  strategic:'#f59e0b',
} as const

type ScenarioKey = keyof typeof SCENARIO_COLOR

const SCENARIO_NAMES: Record<ScenarioKey, string> = {
  capacity:  '产能利用率最优',
  profit:    '吨钢毛利最优',
  strategic: '战略客户交付最优',
}

const BASE_MARGIN  = { capacity: 980,  profit: 1180, strategic: 1050 }
const BASE_UTIL    = { capacity: 94,   profit: 82,   strategic: 88   }
const BASE_DAYS    = { capacity: 25,   profit: 33,   strategic: 22   }
const SCORES: Record<ScenarioKey, { margin: number; utilization: number; delivery: number }> = {
  capacity:  { margin: 3, utilization: 5, delivery: 4 },
  profit:    { margin: 5, utilization: 3, delivery: 2 },
  strategic: { margin: 4, utilization: 4, delivery: 5 },
}

const SWITCH_PENALTY = { low: 20, medium: 0, high: -30 } as const

function calcMargin(key: ScenarioKey, p: Scene1Params): number {
  const sw  = SWITCH_PENALTY[p.switchCostLevel]
  const mq  = (p.moqMin - 4) * 8
  const pb  = key === 'profit' && p.profitWeight > 50 ? (p.profitWeight - 50) * 3 : 0
  return Math.round(BASE_MARGIN[key] + sw + mq + pb)
}

function calcUtil(key: ScenarioKey, p: Scene1Params): number {
  const mix = (p.maxMixedCastTons - 70) * 0.1
  const cap = key === 'capacity' ? (p.capacityWeight - 34) * 0.15 : 0
  return Math.min(99, Math.max(75, Math.round((BASE_UTIL[key] + mix + cap) * 10) / 10))
}

function calcDeliveryDate(key: ScenarioKey, p: Scene1Params): string {
  const atpOffset     = (p.atpWindowDays - 5) * 0.5
  const deliveryBonus = key === 'strategic' ? -(p.deliveryWeight - 33) * 0.2 : 0
  const totalDays     = Math.round(BASE_DAYS[key] + atpOffset + deliveryBonus)
  const base = new Date('2026-06-30')
  base.setDate(base.getDate() + totalDays)
  return base.toISOString().slice(0, 10)
}

function calcScore(key: ScenarioKey, p: Scene1Params): string {
  const s      = SCORES[key]
  const totalW = (p.profitWeight + p.capacityWeight + p.deliveryWeight) || 100
  const score  = (s.margin * p.profitWeight + s.utilization * p.capacityWeight + s.delivery * p.deliveryWeight) / totalW
  return score.toFixed(1)
}

export function CostModel() {
  const { scene1Params: p } = useAppStore()

  return (
    <div>
      <p className="text-[10px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
        成本 · 交期 · 产能测算模型（基于回归模型 + GAN数据增强）
      </p>
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(SCENARIO_COLOR) as ScenarioKey[]).map((key, i) => {
          const color = SCENARIO_COLOR[key]
          return (
            <div key={key} className="px-3 py-2"
              style={i < 2 ? { borderRight: '1px solid var(--color-card-border)' } : {}}>
              <p className="text-[10px] mb-3 font-semibold" style={{ color }}>{SCENARIO_NAMES[key]}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>预计毛利 (元/t)</p>
                  <p className="text-base font-bold" style={{ color }}>
                    ¥{calcMargin(key, p).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>产能占用率</p>
                  <p className="text-base font-bold" style={{ color }}>{calcUtil(key, p)}%</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>承诺最早交期</p>
                  <p className="text-sm font-bold" style={{ color }}>{calcDeliveryDate(key, p)}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '0.5rem' }}>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>综合评分</p>
                  <p className="text-xl font-bold" style={{ color }}>{calcScore(key, p)}<span className="text-[10px] font-normal"> / 5</span></p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
