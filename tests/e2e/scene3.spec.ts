import { test, expect } from '@playwright/test'
import { Scene3Page } from '../pages/Scene3Page'

const CHART_TESTIDS = [
  'demand-accuracy-chart',
  'otif-chart',
  'inventory-heatmap-chart',
  'plan-execution-chart',
]

test('scene3 dashboard renders all four domain charts', async ({ page }) => {
  const scene3 = new Scene3Page(page)
  await scene3.goto()

  for (const testid of CHART_TESTIDS) {
    const chart = page.locator(`[data-testid="${testid}"]`)
    await expect(chart).toBeVisible()
    await expect(chart.locator('canvas').first()).toBeVisible()
  }
})
