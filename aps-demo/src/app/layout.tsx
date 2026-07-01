import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/AppShell'
import './globals.css'

export const metadata: Metadata = {
  title: '东北特钢 APS 智能排产系统',
  description: '东北特钢 APS 智能排产 Demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
