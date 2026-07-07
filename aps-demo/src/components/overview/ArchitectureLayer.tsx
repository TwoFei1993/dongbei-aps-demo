'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import type { ArchitectureLayerData } from './data/ArchitectureData'
import type { AgentCardData } from './data/OverviewAgentData'
import { AgentLayerSection } from './agent/AgentLayerSection'
import { AgentDetailModal } from './agent/AgentDetailModal'
import { ProductionStageFlow } from './flow/ProductionStageFlow'
import { SubFlowChain } from './flow/SubFlowChain'

export function ArchitectureLayer({ layer, defaultOpen }: { layer: ArchitectureLayerData; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const [detailAgent, setDetailAgent] = useState<AgentCardData | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<HTMLSpanElement>(null)

  function toggle() {
    if (!layer.expandable) return
    const next = !open
    setOpen(next)
    const body = bodyRef.current
    const chevron = chevronRef.current
    if (!body) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set(body, next ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 })
      if (chevron) gsap.set(chevron, { rotate: next ? 180 : 0 })
      return
    }
    if (next) {
      gsap.set(body, { height: 'auto' })
      const h = body.offsetHeight
      gsap.fromTo(body, { height: 0, opacity: 0 }, { height: h, opacity: 1, duration: 0.35, ease: 'power2.out' })
    } else {
      gsap.to(body, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
    }
    if (chevron) gsap.to(chevron, { rotate: next ? 180 : 0, duration: 0.3, ease: 'power2.out' })
  }

  const HeaderTag = layer.expandable ? 'button' : 'div'

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}
    >
      <HeaderTag
        onClick={layer.expandable ? toggle : undefined}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
        style={{ backgroundColor: open && layer.expandable ? 'var(--color-primary-light)' : 'transparent' }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: layer.color }}
        >
          {layer.index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold leading-tight" style={{ color: 'var(--color-text-title)' }}>
            {layer.title}
          </div>
          <div className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {layer.subtitle}
          </div>
        </div>
        {layer.href && (
          <Link
            href={layer.href}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: layer.color, color: '#fff' }}
          >
            进入场景 →
          </Link>
        )}
        {layer.expandable && (
          <span ref={chevronRef} className="shrink-0" style={{ color: 'var(--color-text-muted)' }}>
            <ChevronDown size={20} strokeWidth={2.25} />
          </span>
        )}
      </HeaderTag>

      <div className="flex flex-col gap-4 px-5 pb-5 pt-1">
        {layer.subFlows && <SubFlowChain nodes={layer.subFlows} color={layer.color} />}
        {layer.stageFlow && <ProductionStageFlow stages={layer.stageFlow} color={layer.color} />}
      </div>

      {layer.expandable && layer.agentLayers && (
        <div ref={bodyRef} style={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="px-5">
          <div className="flex flex-col gap-4 border-t pb-5 pt-4" style={{ borderColor: 'var(--color-card-border)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
              Agent 分层架构 · 决策层 → 执行层 → 汇报层
            </div>
            {layer.agentLayers.map((agentLayer) => (
              <AgentLayerSection
                key={agentLayer.key}
                layer={agentLayer}
                color={layer.color}
                onOpenDetail={setDetailAgent}
              />
            ))}
          </div>
        </div>
      )}

      <AgentDetailModal agent={detailAgent} color={layer.color} onClose={() => setDetailAgent(null)} />
    </div>
  )
}
