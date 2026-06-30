const LANES = [
  { stage: '连铸智能组浇', output: '出坯计划', color: '#4a7cdc' },
  { stage: '加热炉-轧线协同', output: '加热瓶颈反馈', color: '#f59e0b' },
  { stage: '轧线智能组辊', output: '换辊窗口', color: '#10b981' },
  { stage: '精整工序排产', output: '完工计划', color: '#8b5cf6' },
]

export function ProcessLanes() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {LANES.map((lane, i) => (
        <div key={lane.stage} className="flex items-center gap-2 flex-shrink-0">
          <div
            className="rounded-lg px-4 py-3 min-w-[140px]"
            style={{
              backgroundColor: lane.color + '15',
              border: `1px solid ${lane.color}40`,
            }}
          >
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: lane.color }}
            >
              {lane.stage}
            </div>
            <div
              className="text-[11px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ↳ {lane.output}
            </div>
          </div>
          {i < LANES.length - 1 && (
            <span
              className="text-lg font-light flex-shrink-0"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ⟶
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
