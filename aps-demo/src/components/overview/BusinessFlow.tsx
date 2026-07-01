'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SubStep {
  label: string
  sub: string
  icon: string
}

interface FlowNode {
  scene: string
  label: string
  sublabel: string
  href: string
  color: string
  steps: SubStep[]
}

const NODES: FlowNode[] = [
  {
    scene: '场景 01',
    label: '智能订单评审',
    sublabel: '可行性分析 · OBBT 算法',
    href: '/scene1',
    color: '#4a7cdc',
    steps: [
      { label: '合同解析', sub: 'ERP 订单导入', icon: '📋' },
      { label: 'OBBT 评审', sub: '产能 / 交期 / 利润', icon: '⚙️' },
      { label: '可行性判定', sub: '接单 / 拒单 / 调整', icon: '✅' },
      { label: '排程触发', sub: '下发排程指令', icon: '🚀' },
    ],
  },
  {
    scene: '场景 02',
    label: '跨工序智能排程',
    sublabel: '四工序协同 · 加热炉优化',
    href: '/scene2',
    color: '#0ea5e9',
    steps: [
      { label: '炼钢工序', sub: '炉次计划 · 钢水协调', icon: '🏭' },
      { label: '连铸工序', sub: 'MoQ · 混浇优化', icon: '🔩' },
      { label: '加热炉', sub: '三模型步进 · 热装率', icon: '🔥' },
      { label: '轧制工序', sub: '换辊计划 · 规格排序', icon: '⚡' },
    ],
  },
  {
    scene: '场景 03',
    label: '多维指标驾驶舱',
    sublabel: '执行监控 · 偏差预警',
    href: '/scene3',
    color: '#10b981',
    steps: [
      { label: '需求域', sub: '接单节奏 · 预测准确率', icon: '📈' },
      { label: '生产执行域', sub: '合同完成 · 排产损失', icon: '🏗️' },
      { label: '库存供应域', sub: '热力图 · 缺口预测', icon: '📦' },
      { label: '客户服务域', sub: 'OTIF · 准时交付', icon: '🎯' },
    ],
  },
]

function CurvedArrow({ color }: { color: string }) {
  return (
    <div className="arrow-connector flex-shrink-0 flex items-start justify-center pt-10" style={{ width: 52 }}>
      <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
        <defs>
          <marker id={`arr-${color.slice(1)}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#4a7cdc" opacity="0.65" />
          </marker>
        </defs>
        <path
          d="M 4 24 C 12 24, 12 8, 26 8 S 40 24, 48 24"
          stroke="#4a7cdc"
          strokeWidth="1.6"
          strokeDasharray="4 3"
          strokeOpacity="0.55"
          fill="none"
          markerEnd={`url(#arr-${color.slice(1)})`}
        />
        <path
          d="M 4 24 C 12 24, 12 40, 26 40 S 40 24, 48 24"
          stroke="#4a7cdc"
          strokeWidth="1.6"
          strokeDasharray="4 3"
          strokeOpacity="0.18"
          fill="none"
        />
      </svg>
    </div>
  )
}

export function BusinessFlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const container = containerRef.current
    const topbar = container.querySelectorAll('.bf-topbar')
    const cards = container.querySelectorAll('.bf-card')
    const arrows = container.querySelectorAll('.arrow-connector')
    const steps = container.querySelectorAll('.bf-step')
    gsap.set([topbar, cards, arrows, steps], { opacity: 0 })
    gsap.set(Array.from(topbar), { y: -10 })
    gsap.set(Array.from(cards), { y: 28 })
    gsap.set(Array.from(steps), { x: -14 })
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tl.to(topbar, { opacity: 1, y: 0, duration: 0.4 })
    tl.to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: { each: 0.15, from: 'start' } }, '-=0.1')
    tl.to(arrows, { opacity: 1, duration: 0.4, stagger: 0.15 }, '-=0.4')
    tl.to(steps, { opacity: 1, x: 0, duration: 0.35, stagger: { each: 0.06, from: 'start' } }, '-=0.3')
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      {/* 顶部流向标签 */}
      <div className="bf-topbar flex items-center justify-between mb-4 px-1">
        {['计划层 → 接单评审', '排程层 → 工序协同', '监控层 → 闭环反馈'].map((label, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 节点行 */}
      <div className="flex items-start">
        {NODES.map((node, idx) => (
          <div key={node.href} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col flex-1 min-w-0">
              {/* 主卡片 */}
              <Link
                href={node.href}
                className="bf-card group block rounded-xl px-4 py-4 text-center transition-all hover:scale-[1.02] mb-3"
                style={{
                  backgroundColor: node.color,
                  boxShadow: `0 4px 16px ${node.color}38`,
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                  {node.scene}
                </div>
                <div className="text-base font-bold text-white leading-tight">{node.label}</div>
                <div className="text-xs text-white/70 mt-1">{node.sublabel}</div>
                <div className="mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-semibold bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                  进入场景 →
                </div>
              </Link>

              {/* 子步骤 */}
              <div className="flex flex-col gap-2">
                {node.steps.map((step) => (
                  <div
                    key={step.label}
                    className="bf-step flex items-start gap-2 rounded-lg px-3 py-2.5"
                    style={{
                      backgroundColor: 'var(--color-content-bg)',
                      border: '1px solid var(--color-card-border)',
                    }}
                  >
                    <div className="flex flex-col items-center shrink-0 pt-1" style={{ width: 14 }}>
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: node.color, opacity: 0.85 }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-text-title)' }}>
                        {step.icon} {step.label}
                      </div>
                      <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        {step.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {idx < NODES.length - 1 && <CurvedArrow color={node.color} />}
          </div>
        ))}
      </div>
    </div>
  )
}
