import Link from 'next/link'

interface FlowStep {
  label: string
  sublabel: string
  href: string
  scene: string
}

const FLOW_STEPS: FlowStep[] = [
  {
    label: '订单评审',
    sublabel: '智能订单可行性分析',
    href: '/scene1',
    scene: '场景1',
  },
  {
    label: '跨工序排程',
    sublabel: '四工序协同 + 加热炉优化',
    href: '/scene2',
    scene: '场景2',
  },
  {
    label: '全局监控',
    sublabel: '多维驾驶舱 & 执行看板',
    href: '/scene3',
    scene: '场景3',
  },
]

export function BusinessFlow() {
  return (
    <div className="flex items-stretch gap-0">
      {FLOW_STEPS.map((step, idx) => (
        <div key={step.href} className="flex items-center">
          {/* Step box */}
          <Link
            href={step.href}
            className="group flex flex-col items-center gap-1 rounded-xl px-8 py-5 text-center transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1.5px solid var(--color-card-border)',
              minWidth: '160px',
              boxShadow: '0 2px 8px rgba(37,51,72,0.07)',
            }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-primary)' }}
            >
              {step.scene}
            </div>
            <div
              className="text-base font-bold"
              style={{ color: 'var(--color-text-title)' }}
            >
              {step.label}
            </div>
            <div
              className="text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {step.sublabel}
            </div>
            <div
              className="mt-1 rounded px-3 py-0.5 text-[11px] font-medium transition-colors group-hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              进入场景 →
            </div>
          </Link>

          {/* Arrow between steps */}
          {idx < FLOW_STEPS.length - 1 && (
            <div
              className="flex items-center px-3 text-2xl font-light"
              style={{ color: 'var(--color-text-muted)' }}
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
