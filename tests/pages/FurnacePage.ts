import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class FurnacePage extends BasePage {
  readonly modelButton = (id: number) =>
    this.page.locator(`[data-testid="furnace-model-${id}"]`)

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('/scene2/furnace/')
  }

  async selectModel(id: number) {
    await this.modelButton(id).click()
  }
}
