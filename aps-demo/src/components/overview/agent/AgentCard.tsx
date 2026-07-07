import type { AgentCardData } from '../data/OverviewAgentData'

export function AgentCard({
  icon: Icon, title, desc, tags, detail, color, onOpenDetail,
}: AgentCardData & { color: string; onOpenDetail?: (agent: AgentCardData) => void }) {
  const clickable = !!detail && !!onOpenDetail
  const Tag = clickable ? 'button' : 'div'

  return (
    <Tag
      onClick={clickable ? () => onOpenDetail!({ icon: Icon, title, desc, tags, detail }) : undefined}
      className="agent-card card-hover flex flex-col gap-2 rounded-xl p-3 text-left"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon size={16} />
        </div>
        <h4 className="text-[13px] font-bold leading-tight" style={{ color: 'var(--color-text-title)' }}>
          {title}
        </h4>
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {desc}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {tag}
          </span>
        ))}
        {clickable && (
          <span className="ml-auto text-[10px] font-medium" style={{ color: 'var(--color-primary)' }}>
            查看详情 →
          </span>
        )}
      </div>
    </Tag>
  )
}
