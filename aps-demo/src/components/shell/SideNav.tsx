'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, GitBranch, Thermometer, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',               label: 'APS 架构总览', num: '总览',     icon: LayoutDashboard },
  { href: '/scene1',         label: '智能订单评审', num: '场景 01',  icon: ClipboardList },
  { href: '/scene2',         label: '四工序协同',   num: '场景 02A', icon: GitBranch },
  { href: '/scene2/furnace', label: '加热炉协同',   num: '场景 02B', icon: Thermometer },
  { href: '/scene3',         label: '多维驾驶舱',   num: '场景 03',  icon: BarChart3 },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed left-0 top-12 bottom-0 z-40 flex w-[220px] flex-col border-r pt-3"
      style={{
        backgroundColor: 'var(--color-sidebar-bg)',
        borderColor: 'var(--color-sidebar-border)',
      }}
    >
      {NAV_ITEMS.map((item, idx) => {
        const active =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href))
        const Icon = item.icon
        return (
          <div key={item.href}>
            {idx === 1 && (
              <div
                className="mx-3 my-1.5 h-px"
                style={{ backgroundColor: 'var(--color-sidebar-border)' }}
              />
            )}
            <Link
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{
                color: active ? 'var(--color-text-title)' : 'var(--color-text-muted)',
                backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                borderRight: active
                  ? '3px solid var(--color-primary)'
                  : '3px solid transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon
                size={16}
                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              />
              <div>
                <div className="text-[10px] opacity-50">{item.num}</div>
                <div>{item.label}</div>
              </div>
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
