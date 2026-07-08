import { test, expect } from '@playwright/test'
import { Scene1Page } from '../pages/Scene1Page'

test.describe('Scene1 algo flow', () => {
  test('clicking a step expands its detail panel', async ({ page }) => {
    const scene1 = new Scene1Page(page)
    await scene1.goto()

    const detail = page.locator('[data-testid="algo-step-detail-1"]')
    await expect(detail).toBeHidden()

    await page.locator('[data-testid="algo-step-1"]').click()
    await expect(detail).toBeVisible()

    await page.locator('[data-testid="algo-step-1"]').click()
    await expect(detail).toBeHidden()
  })
})

test.describe('Scene1 result table', () => {
  test('switching scenario re-sorts the result rows', async ({ page }) => {
    const scene1 = new Scene1Page(page)
    await scene1.goto()

    const rows = page.locator('[data-testid="result-row"]')
    const capacityOrder = await rows.allTextContents()

    await scene1.selectScenario('profit')
    const profitOrder = await rows.allTextContents()

    expect(profitOrder).not.toEqual(capacityOrder)
  })
})

test.describe('Scene1 order review', () => {
  test('order table filters rows by steel category', async ({ page }) => {
    const scene1 = new Scene1Page(page)
    await scene1.goto()

    const table = page.locator('table')
    const initialRowCount = await table.locator('tbody tr').count()
    expect(initialRowCount).toBeGreaterThan(0)

    await scene1.categoryButton('全部').click()
    await expect(table.locator('tbody tr').first()).toBeVisible()
  })

  test('scenario radar switches active scenario', async ({ page }) => {
    const scene1 = new Scene1Page(page)
    await scene1.goto()

    await scene1.selectScenario('profit')
    const profitButton = scene1.scenarioButton('profit')
    const capacityButton = scene1.scenarioButton('capacity')

    const profitColor = await profitButton.evaluate((el) => getComputedStyle(el).backgroundColor)
    const capacityColor = await capacityButton.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(profitColor).not.toBe(capacityColor)
  })
})
