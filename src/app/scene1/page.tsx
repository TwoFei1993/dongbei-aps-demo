import { OrderTable } from '@/components/scene1/OrderTable'
import { AlgoFlow } from '@/components/scene1/AlgoFlow'
import { ScenarioRadar } from '@/components/scene1/ScenarioRadar'
import { ResultTable } from '@/components/scene1/ResultTable'

export default function Scene1Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-title)' }}>
          场景 01 · 智能订单评审系统
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          多约束订单组合优化 · OBBT 算法 · 三情景方案决策
        </p>
      </div>

      <div className="flex gap-3 text-[10px] font-medium uppercase tracking-wider">
        {['多条件约束', '订单组合优化', '交期承诺测算', '多情景决策'].map((tag) => (
          <span key={tag} className="rounded-full px-3 py-1"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* 三栏布局 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 space-y-3"
             style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            输入 · 订单池（真实数据 300 条）
          </h3>
          <OrderTable />
        </div>

        <div className="rounded-xl p-4 space-y-3"
             style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            算法 · OBBT 订单组合优化模型
          </h3>
          <AlgoFlow />
        </div>

        <div className="rounded-xl p-4 space-y-3"
             style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
            输出 · 三情景方案对比
          </h3>
          <ScenarioRadar />
        </div>
      </div>

      {/* 底部结果表 */}
      <div className="rounded-xl p-4"
           style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-title)' }}>
          订单组合优化结果（按当前情景排序）
        </h3>
        <ResultTable />
      </div>
    </div>
  )
}
