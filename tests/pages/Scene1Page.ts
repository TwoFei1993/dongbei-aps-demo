import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class Scene1Page extends BasePage {
  readonly categoryButton = (category: string) =>
    this.page.locator(`[data-testid="order-category-${category}"]`)
  readonly scenarioButton = (key: 'capacity' | 'profit' | 'strategic') =>
    this.page.locator(`[data-testid="scenario-${key}"]`)

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/scene1/')
  }

  async selectCategory(category: string) {
    await this.categoryButton(category).click()
  }

  async selectScenario(key: 'capacity' | 'profit' | 'strategic') {
    await this.scenarioButton(key).click()
  }
}
