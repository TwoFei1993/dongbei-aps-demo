import { Page } from '@playwright/test'

export class BasePage {
  constructor(readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }

  nav(key: string) {
    return this.page.locator(`[data-testid="nav-${key}"]`)
  }
}
