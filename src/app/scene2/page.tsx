import { CrossGantt } from '@/components/scene2/CrossGantt'
import { ProcessLanes } from '@/components/scene2/ProcessLanes'

const CAPABILITY_CARDS = [
  {
    title: '工序协同',
    desc: '连铸出坯节拍与加热炉装炉排序实时匹配，消除等待浪费',
  },
  {
    title: '资源优化',
    desc: '轧辊换辊窗口自动预留，加热炉分组 ΔT≤50° 最小化升温过渡',
  },
  {
    title: '交付保障',
    desc: '精整工序从交期倒排，动态识别瓶颈并触发上游重排',
  },
]

export default function Scene2Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-title)' }}
        >
          场景 02A · 全流程跨工序动态排程
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          四工序协同甘特图 · 168 炉次 · 72 小时排程窗口 · 点击色块高亮同批次
        </p>
      </div>

      {/* 工序流程卡 */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: 'var(--color-text-title)' }}
        >
          工序流程
        </h3>
        <ProcessLanes />
      </div>

      {/* 跨工序甘特图 */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: 'var(--color-text-title)' }}
        >
          跨工序甘特图（72h 排程窗口）
        </h3>
        <CrossGantt />
      </div>

      {/* 底部能力卡 */}
      <div className="grid grid-cols-3 gap-4">
        {CAPABILITY_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl p-4 space-y-2"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            <h4
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-title)' }}
            >
              {card.title}
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
