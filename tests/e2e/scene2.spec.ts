import { test, expect } from '@playwright/test'

test.describe('场景 02A · 全流程跨工序动态排程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scene2')
  })

  test('工序流程与跨工序甘特图渲染完成', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '场景 02A · 全流程跨工序动态排程' })).toBeVisible()
    await expect(page.getByText('工序流程', { exact: true })).toBeVisible()
    await expect(page.getByText('跨工序甘特图（72h 排程窗口）')).toBeVisible()
  })

  test('展示三张能力卡', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '工序协同', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '资源优化', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '交付保障', exact: true })).toBeVisible()
  })
})
