import { test, expect } from '@playwright/test'

const ROUTES = [
  { key: 'overview', path: '/', heading: 'APS 系统架构总览' },
  { key: 'scene1', path: '/scene1/', heading: '智能订单评审系统' },
  { key: 'scene2', path: '/scene2/', heading: '全流程跨工序动态排程' },
  { key: 'scene2-furnace', path: '/scene2/furnace/', heading: '加热炉出炉节拍预测与模铸均热协同' },
  { key: 'scene3', path: '/scene3/', heading: '多维指标驾驶舱' },
]

test('side nav links navigate to every scene', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  for (const route of ROUTES) {
    const urlPattern = new RegExp(route.path.replace(/\//g, '\\/') + '$')
    await Promise.all([
      page.waitForURL(urlPattern),
      page.locator(`[data-testid="nav-${route.key}"]`).click(),
    ])
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible()
  }
})
