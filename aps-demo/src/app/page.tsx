import { AgentArchitectureOverview } from '@/components/overview/AgentArchitectureOverview'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-title)' }}>
          APS 系统架构总览
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          东北特钢智能高级计划与排程系统 — Agent 分层架构
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
          业务架构总览 · 四层业务流程
        </h2>
        <AgentArchitectureOverview />
      </div>
    </div>
  )
}
