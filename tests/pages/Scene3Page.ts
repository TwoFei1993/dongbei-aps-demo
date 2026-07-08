import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class Scene3Page extends BasePage {
  readonly timeRangeButton = (label: string) =>
    this.page.locator(`[data-testid="filter-time-${label}"]`)
  readonly productLineSelect = this.page.locator('[data-testid="filter-product-line"]')

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/scene3/')
  }

  async selectTimeRange(label: string) {
    await this.timeRangeButton(label).click()
  }

  async selectProductLine(value: string) {
    await this.productLineSelect.selectOption(value)
  }
}
