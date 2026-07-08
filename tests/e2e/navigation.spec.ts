import { test, expect } from '@playwright/test'
import { SCENES, SideNavPage } from './pages/SideNavPage'

test.describe('侧边导航', () => {
  for (const scene of SCENES) {
    test(`可以导航到「${scene.label}」`, async ({ page }) => {
      await page.goto('/')
      const nav = new SideNavPage(page)

      await nav.clickNav(scene.label)
      // App uses Next.js trailingSlash, so match with an optional trailing slash.
      const pattern = scene.href === '/' ? /\/$/ : new RegExp(`${scene.href}/?$`)
      await page.waitForURL(pattern)
      await expect(page.locator('h1')).toContainText(scene.heading)
    })
  }
})
