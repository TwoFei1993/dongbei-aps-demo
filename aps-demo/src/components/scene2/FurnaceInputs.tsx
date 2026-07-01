const INPUT_CARDS = [
  {
    id: '01',
    title: '钢种信息',
    items: ['规格/数量等', '品种加热工艺标准库', '加热时间差异矩阵'],
  },
  {
    id: '02',
    title: '坯料属性',
    items: ['钢种/断面', '当前温度（热送65° / 冷装20°）', '在库位置 / 热送状态'],
  },
  {
    id: '03',
    title: '加热工艺参数',
    items: ['目标加热温度', '均热温度 ±15°', '保温时间', '允许偏差范围'],
  },
  {
    id: '04',
    title: '加热炉 / 轧机状态',
    items: [
      '当前炉温：1240°C',
      '在炉坯料：8块',
      '剩余加热时间：32min',
      '轧机节拍：48t/h',
    ],
  },
  {
    id: '05',
    title: '连铸 / 模铸出坯计划',
    items: [
      '各浇次预计出坯时间',
      '热送温度 ≥850°',
      '到达加热炉时间窗',
    ],
  },
  {
    id: '06',
    title: '能耗数据',
    items: ['煤气单耗：15kgce/t', '热坯 vs 冷坯差异', '电耗：3kWh/t'],
  },
]

export function FurnaceInputs() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {INPUT_CARDS.map((card) => (
        <div
          key={card.id}
          className="rounded-lg p-3"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className="text-[10px] font-bold leading-none"
              style={{ color: 'var(--color-primary)' }}
            >
              {card.id}
            </span>
            <span
              className="text-[11px] font-semibold leading-tight"
              style={{ color: 'var(--color-text-title)' }}
            >
              {card.title}
            </span>
          </div>
          <ul className="space-y-0.5">
            {card.items.map((item) => (
              <li
                key={item}
                className="text-[10px] leading-snug"
                style={{ color: 'var(--color-text-muted)' }}
              >
                · {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
