import type { Locator, Page } from '@playwright/test'

export const SCENES = [
  { href: '/', label: 'APS 架构总览', heading: 'APS 系统架构总览' },
  { href: '/scene1', label: '智能订单评审', heading: '场景 01 · 智能订单评审系统' },
  { href: '/scene2', label: '四工序协同', heading: '场景 02A · 全流程跨工序动态排程' },
  { href: '/scene2/furnace', label: '加热炉协同', heading: '场景 02B · 加热炉出炉节拍预测与模铸均热协同' },
  { href: '/scene3', label: '多维驾驶舱', heading: '场景 03 · 多维指标驾驶舱' },
] as const

export class SideNavPage {
  constructor(private readonly page: Page) {}

  private get nav(): Locator {
    // Home page repeats scene labels in its own business-flow cards, so
    // scope to the sidebar's <nav> landmark to avoid strict-mode ambiguity.
    return this.page.getByRole('navigation')
  }

  navLink(label: string): Locator {
    return this.nav.getByRole('link', { name: label })
  }

  async clickNav(label: string) {
    await this.navLink(label).click()
  }
}
