import { test, expect } from '@playwright/test'

test.describe('场景 03 · 多维指标驾驶舱', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scene3')
  })

  test('四域全景 KPI 与图表渲染完成', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '场景 03 · 多维指标驾驶舱' })).toBeVisible()
    await expect(page.getByText('本月合同件数')).toBeVisible()
    await expect(page.getByText('本月合同吨数')).toBeVisible()
    await expect(page.getByText('全线合同总件数')).toBeVisible()
    await expect(page.getByText('欠交量')).toBeVisible()

    const charts = page.locator('canvas')
    await expect(charts.first()).toBeVisible({ timeout: 10_000 })
    expect(await charts.count()).toBeGreaterThanOrEqual(2)
  })

  test('四象限图表标题完整', async ({ page }) => {
    await expect(page.getByText('需求域 · 结算合同完成率趋势')).toBeVisible()
    await expect(page.getByText('客户服务域 · OTIF 合同吨数履约')).toBeVisible()
    await expect(page.getByText('库存与供应域 · 成品库存周转热力图')).toBeVisible()
    await expect(page.getByText('生产执行域 · 各产线合同完成情况')).toBeVisible()
  })
})
