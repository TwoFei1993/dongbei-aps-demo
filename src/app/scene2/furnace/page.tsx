import { ImproveCards } from '@/components/scene2/ImproveCards'
import { FurnaceModel } from '@/components/scene2/FurnaceModel'

export default function FurnacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-title)' }}
        >
          场景 02B · 加热炉出炉节拍预测与模铸均热协同
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          三层协同模型 · 预测精度 ±5min · 基于第二轧钢厂过程分析数据
        </p>
      </div>

      <ImproveCards />

      <div
        className="rounded-xl p-4 space-y-4"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--color-text-title)' }}
        >
          三模型协同步进器
        </h3>
        <FurnaceModel />
      </div>
    </div>
  )
}
