import { test, expect } from '@playwright/test'

test.describe('总览页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('展示目标指标 KPI 卡片', async ({ page }) => {
    await expect(page.getByText('目标指标')).toBeVisible()
    await expect(page.getByText('交付准时率提升')).toBeVisible()
    await expect(page.getByText('排程效率提升')).toBeVisible()
    await expect(page.getByText('综合成本降低')).toBeVisible()
    await expect(page.getByText('OEE 综合效率提升')).toBeVisible()
  })

  test('展示四层架构体系与业务流程导航', async ({ page }) => {
    await expect(page.getByText('四层架构体系', { exact: true })).toBeVisible()
    await expect(page.getByText('业务流程导航', { exact: true })).toBeVisible()
  })
})
