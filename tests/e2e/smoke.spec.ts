import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', heading: 'APS 系统架构总览' },
  { path: '/scene1/', heading: '智能订单评审系统' },
  { path: '/scene2/', heading: '全流程跨工序动态排程' },
  { path: '/scene2/furnace/', heading: '加热炉出炉节拍预测与模铸均热协同' },
  { path: '/scene3/', heading: '多维指标驾驶舱' },
]

for (const { path, heading } of PAGES) {
  test(`${path} loads and shows its heading`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  })
}
