import { test, expect } from '@playwright/test'
import { Scene3Page } from '../pages/Scene3Page'

test.describe('Scene3 FilterBar', () => {
  test('switching time range highlights the selected button', async ({ page }) => {
    const scene3 = new Scene3Page(page)
    await scene3.goto()

    await scene3.selectTimeRange('3个月')
    const active = scene3.timeRangeButton('3个月')
    const idle = scene3.timeRangeButton('当月')

    await expect(active).not.toHaveCSS(
      'background-color',
      await idle.evaluate((el) => getComputedStyle(el).backgroundColor)
    )
  })

  test('switching product line updates the select value', async ({ page }) => {
    const scene3 = new Scene3Page(page)
    await scene3.goto()

    await scene3.selectProductLine('大型材')
    await expect(scene3.productLineSelect).toHaveValue('大型材')
  })
})
