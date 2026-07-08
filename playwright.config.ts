import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3999',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Dedicated port + own dev server: this machine runs several worktrees of
    // this repo in parallel, each with its own `next dev` on a different port,
    // so 3000 may already be serving an unrelated app. Never reuse a server we
    // didn't start ourselves.
    command: 'bash scripts/start-test.sh',
    url: 'http://localhost:3999',
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
