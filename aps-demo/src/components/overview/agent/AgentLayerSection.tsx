import type { AgentCardData, AgentLayerData } from '../data/OverviewAgentData'
import { AgentCard } from './AgentCard'

const LAYER_ACCENT: Record<AgentLayerData['key'], string> = {
  decision: '#253348',
  execution: '#4a7cdc',
  reporting: '#7ba7e8',
}

export function AgentLayerSection({
  layer, color, onOpenDetail,
}: { layer: AgentLayerData; color: string; onOpenDetail?: (agent: AgentCardData) => void }) {
  const accent = LAYER_ACCENT[layer.key]
  return (
    <div className="agent-layer flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {layer.label}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          {layer.desc}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {layer.agents.map((agent) => (
          <AgentCard key={agent.title} {...agent} color={color} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  )
}
