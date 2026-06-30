import Link from 'next/link'

interface PyramidLayer {
  label: string
  color: string
  textColor: string
  items: Array<{ text: string; href?: string; hrefLabel?: string }>
  widthClass: string
}

const LAYERS: PyramidLayer[] = [
  {
    label: '业务目标层',
    color: '#253348',
    textColor: '#ffffff',
    widthClass: 'w-[55%]',
    items: [
      { text: '交付↑8~10%' },
      { text: '效率↓50~70%' },
      { text: '成本↓15~20%' },
      { text: 'OEE↑6~8%' },
    ],
  },
  {
    label: '业务流程层',
    color: '#4a7cdc',
    textColor: '#ffffff',
    widthClass: 'w-[70%]',
    items: [
      { text: '高级计划模块', href: '/scene1', hrefLabel: '进入场景1' },
      { text: '高级排程模块', href: '/scene2', hrefLabel: '进入场景2/3' },
    ],
  },
  {
    label: '体系支撑层',
    color: '#7ba7e8',
    textColor: '#ffffff',
    widthClass: 'w-[85%]',
    items: [
      { text: '业绩管控' },
      { text: '数字信息化 (ERP-APS-MES-L2)' },
      { text: '组织能力' },
    ],
  },
  {
    label: '数据基础层',
    color: '#dde3ee',
    textColor: '#253348',
    widthClass: 'w-full',
    items: [
      { text: 'ERP' },
      { text: 'MES' },
      { text: 'L2自动化' },
      { text: '生产数据' },
    ],
  },
]

export function PyramidArch() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {LAYERS.map((layer) => (
        <div
          key={layer.label}
          className={`${layer.widthClass} rounded-lg px-6 py-4 transition-all`}
          style={{
            backgroundColor: layer.color,
            boxShadow: '0 2px 8px rgba(37,51,72,0.12)',
          }}
        >
          <div
            className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-75"
            style={{ color: layer.textColor }}
          >
            {layer.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: layer.textColor,
                  border: `1px solid rgba(255,255,255,0.2)`,
                }}
              >
                <span>{item.text}</span>
                {item.href && (
                  <Link
                    href={item.href}
                    className="rounded px-2 py-0.5 text-[11px] font-semibold transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: layer.color,
                    }}
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
