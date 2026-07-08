import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class Scene2Page extends BasePage {
  readonly ganttChart = this.page.locator('[data-testid="cross-gantt-chart"]')

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/scene2/')
  }
}
