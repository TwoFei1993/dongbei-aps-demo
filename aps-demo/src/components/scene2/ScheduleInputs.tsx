'use client'
import { useAppStore } from '@/lib/store'

export function ScheduleInputs() {
  const { scene2Params: p } = useAppStore()

  const heatCount = Math.round(p.equipmentCount * p.horizon * 0.38)
  const continuousCastRate = Math.min(95, 75 + (p.castingMoqMin - 1) * 3)
  const rollChanges = Math.ceil(p.horizon / p.rollChangePeriodHours)

  const stats = [
    { label: '订单池炉次任务', value: heatCount, unit: '个' },
    { label: '设备资源', value: p.equipmentCount, unit: '台' },
    { label: '工艺路径库', value: p.ruleCount, unit: '条规则' },
    { label: '排程窗口', value: p.horizon, unit: 'h' },
    { label: '连浇率目标', value: continuousCastRate, unit: '%' },
    { label: '换辊次数预测', value: rollChanges, unit: '次' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl px-3 py-2.5"
          style={{
            backgroundColor: 'var(--color-content-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {s.value}<span className="text-xs ml-0.5">{s.unit}</span>
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}
