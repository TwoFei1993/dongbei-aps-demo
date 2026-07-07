import { ArrowRight } from 'lucide-react'

const STAGE_COLORS: Record<string, string> = {
  原料场: '#8896aa',
  炼铁: '#c2410c',
  炼钢: '#dc2626',
  热轧: '#ea580c',
  热处理: '#d97706',
  冷轧: '#0ea5e9',
  深加工: '#7c3aed',
}

export function ProductionStageFlow({ stages, color }: { stages: string[]; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
        产线工序流
      </div>
      <div className="flex items-stretch gap-1.5">
        {stages.map((stage, idx) => (
          <div key={stage} className="flex flex-1 items-stretch gap-1.5">
            <div
              className="flex flex-1 items-center justify-center rounded-lg px-3 py-3 text-center text-xs font-semibold text-white"
              style={{ backgroundColor: STAGE_COLORS[stage] ?? color }}
            >
              {stage}
            </div>
            {idx < stages.length - 1 && (
              <span className="flex shrink-0 items-center" style={{ color: 'var(--color-text-muted)' }}>
                <ArrowRight size={20} strokeWidth={2.25} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
