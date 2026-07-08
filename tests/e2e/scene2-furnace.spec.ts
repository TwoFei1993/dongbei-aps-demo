import { test, expect } from '@playwright/test'

test.describe('场景 02B · 加热炉出炉节拍协同', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scene2/furnace')
  })

  test('三层协同模型步进器渲染完成', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: '场景 02B · 加热炉出炉节拍预测与模铸均热协同' })
    ).toBeVisible()
    await expect(page.getByText('三模型协同步进器')).toBeVisible()
  })
})
