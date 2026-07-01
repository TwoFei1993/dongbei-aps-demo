'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PyramidLayer {
  label: string
  color: string
  textColor: string
  items: Array<{ text: string; href?: string; hrefLabel?: string; sub?: string }>
  widthClass: string
}

const LAYERS: PyramidLayer[] = [
  {
    label: '业务目标层',
    color: 'var(--color-pyramid-apex)',
    textColor: '#ffffff',
    widthClass: 'w-[55%]',
    items: [
      { text: '交付准时率↑8~10%', sub: '客户满意度提升' },
      { text: '排程效率↓50~70%', sub: '人工干预大幅减少' },
      { text: '综合成本↓15~20%', sub: '切换损失+库存优化' },
      { text: 'OEE↑6~8%', sub: '设备综合效率' },
    ],
  },
  {
    label: '业务流程层',
    color: 'var(--color-pyramid-process)',
    textColor: '#ffffff',
    widthClass: 'w-[70%]',
    items: [
      { text: '高级计划模块', sub: '订单评审·OBBT算法', href: '/scene1', hrefLabel: '进入场景1' },
      { text: '高级排程模块', sub: '跨工序排程·加热炉协同', href: '/scene2', hrefLabel: '进入场景2/3' },
    ],
  },
  {
    label: '体系支撑层',
    color: 'var(--color-pyramid-support)',
    textColor: '#ffffff',
    widthClass: 'w-[85%]',
    items: [
      { text: '业绩管控', sub: 'KPI体系·驾驶舱' },
      { text: '数字信息化', sub: 'ERP-APS-MES-L2全链路' },
      { text: '组织能力', sub: '流程变革·人才培养' },
    ],
  },
  {
    label: '数据基础层',
    color: 'var(--color-pyramid-base)',
    textColor: '#253348',
    widthClass: 'w-full',
    items: [
      { text: 'ERP', sub: '合同·订单' },
      { text: 'MES', sub: '生产执行' },
      { text: 'L2自动化', sub: '设备控制' },
      { text: '工艺数据库', sub: '标准·路径' },
      { text: '质量数据', sub: '检验·追溯' },
    ],
  },
]

export function PyramidArch() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const layers = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.pyramid-layer'))
    if (!layers.length) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    gsap.set(layers, { opacity: 0, y: 30 })
    gsap.to(layers, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: { each: 0.1, from: 'end' },
    })
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-0.5">
      {LAYERS.map((layer) => (
        <div
          key={layer.label}
          className={`pyramid-layer ${layer.widthClass} rounded-lg px-6 py-4 transition-all`}
          style={{
            backgroundColor: layer.color,
            boxShadow: '0 2px 8px rgba(37,51,72,0.12)',
          }}
        >
          <div
            className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-75 text-center"
            style={{ color: layer.textColor }}
          >
            {layer.label}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {layer.items.map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: layer.textColor,
                  border: '1px solid rgba(255,255,255,0.2)',
                  minWidth: '100px',
                }}
              >
                <span className="text-xs font-semibold text-center">{item.text}</span>
                {item.sub && (
                  <span className="text-[10px] text-center leading-tight opacity-80" style={{ color: layer.textColor }}>
                    {item.sub}
                  </span>
                )}
                {item.href && (
                  <Link
                    href={item.href}
                    className="rounded px-2 py-0.5 text-[10px] font-semibold transition-opacity hover:opacity-80 mt-0.5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: layer.color }}
                  >
                    {item.hrefLabel ?? '进入场景'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
