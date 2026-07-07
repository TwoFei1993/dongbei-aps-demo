import { ArrowRight } from 'lucide-react'
import type { SubFlowNode } from '../data/ArchitectureData'

export function SubFlowChain({ nodes, color }: { nodes: SubFlowNode[]; color: string }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1.5">
      {nodes.map((node, idx) => (
        <div key={node.title} className="flex flex-1 items-stretch gap-1.5">
          <div
            className="flex flex-1 flex-col gap-1.5 rounded-xl p-3"
            style={{ backgroundColor: 'var(--color-content-bg)', border: `1px solid ${color}30` }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <h5 className="text-[12px] font-bold leading-tight" style={{ color: 'var(--color-text-title)' }}>
                {node.title}
              </h5>
            </div>
            <ul className="flex flex-col gap-0.5 pl-3">
              {node.points.map((point) => (
                <li
                  key={point}
                  className="list-disc text-[11px] leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          {idx < nodes.length - 1 && (
            <div className="flex items-center justify-center px-0.5">
              <ArrowRight size={20} strokeWidth={2.25} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
