import { test, expect } from '@playwright/test'

test.describe('场景 01 · 智能订单评审', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scene1')
  })

  test('三栏输入/算法/输出结构完整', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '场景 01 · 智能订单评审系统' })).toBeVisible()
    await expect(page.getByText('输入 · 订单池（真实数据 300 条）')).toBeVisible()
    await expect(page.getByText('算法 · OBBT 订单组合优化模型')).toBeVisible()
    await expect(page.getByText('输出 · 三情景方案对比')).toBeVisible()
  })

  test('订单池表格渲染出真实数据行', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('三情景方案雷达图渲染完成', async ({ page }) => {
    const radar = page.locator('canvas').first()
    await expect(radar).toBeVisible({ timeout: 10_000 })
  })

  test('底部结果表按当前情景排序展示', async ({ page }) => {
    await expect(page.getByText('订单组合优化结果（按当前情景排序）')).toBeVisible()
  })
})
