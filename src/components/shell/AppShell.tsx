import { TopBar } from './TopBar'
import { SideNav } from './SideNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <SideNav />
      <main
        className="ml-[220px] mt-12 min-h-[calc(100vh-48px)] p-6"
        style={{ backgroundColor: 'var(--color-content-bg)' }}
      >
        {children}
      </main>
    </>
  )
}
