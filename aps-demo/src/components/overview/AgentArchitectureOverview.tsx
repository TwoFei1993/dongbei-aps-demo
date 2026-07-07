'use client'
import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ARCHITECTURE_LAYERS } from './data/ArchitectureData'
import { ArchitectureLayer } from './ArchitectureLayer'

export function AgentArchitectureOverview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const layers = Array.from(containerRef.current.querySelectorAll('.arch-layer'))
    const connectors = Array.from(containerRef.current.querySelectorAll('.arch-connector'))
    gsap.set(layers, { opacity: 0, y: 20 })
    gsap.set(connectors, { opacity: 0 })
    const tl = gsap.timeline()
    layers.forEach((layer, idx) => {
      tl.to(layer, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, idx * 0.15)
      if (connectors[idx]) {
        tl.to(connectors[idx], { opacity: 1, duration: 0.3, ease: 'power2.out' }, idx * 0.15 + 0.35)
      }
    })
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {ARCHITECTURE_LAYERS.map((layer, idx) => (
        <div key={layer.id} className="flex flex-col gap-2">
          <div className="arch-layer">
            <ArchitectureLayer layer={layer} />
          </div>
          {idx < ARCHITECTURE_LAYERS.length - 1 && (
            <div className="arch-connector flex justify-center" style={{ color: 'var(--color-text-muted)' }}>
              <ChevronDown size={28} strokeWidth={2.25} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
