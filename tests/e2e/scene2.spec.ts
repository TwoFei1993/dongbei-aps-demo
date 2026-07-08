import { test, expect } from '@playwright/test'
import { Scene2Page } from '../pages/Scene2Page'
import { FurnacePage } from '../pages/FurnacePage'

test('cross-process gantt chart renders', async ({ page }) => {
  const scene2 = new Scene2Page(page)
  await scene2.goto()

  await expect(scene2.ganttChart).toBeVisible()
  await expect(scene2.ganttChart.locator('canvas')).toBeVisible()
})

test.describe('Furnace model stepper', () => {
  test('switching model updates the active step button', async ({ page }) => {
    const furnace = new FurnacePage(page)
    await furnace.goto()

    await furnace.selectModel(2)
    const activeColor = await furnace
      .modelButton(2)
      .evaluate((el) => getComputedStyle(el).backgroundColor)
    const idleColor = await furnace
      .modelButton(1)
      .evaluate((el) => getComputedStyle(el).backgroundColor)

    expect(activeColor).not.toBe(idleColor)
  })
})
