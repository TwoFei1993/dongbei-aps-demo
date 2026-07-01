# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server — ports 3000-4001 are typically occupied; use 4002
pnpm dev --port 4002

# Static export build
pnpm build             # outputs to out/

# Lint
pnpm lint
```

**Important:** After any significant code change, delete `.next/` before restarting the dev server, or you will get `__webpack_modules__[moduleId] is not a function` / `ENOENT: pages/_document.js` errors from stale chunk references:

```bash
rm -rf .next && pnpm dev --port 4002
```

**Verification:** Always use Playwright to screenshot-verify pages after changes — never claim success without running it:

```js
// Quick verify all 5 routes
const { chromium } = require('playwright');
const browser = await chromium.launch();
// use waitUntil: 'load' (not 'networkidle' — that times out due to ECharts canvas polling)
await page.goto('http://localhost:4002/scene1', { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(1500); // allow React hydration + ECharts render
await page.screenshot({ path: 'docs/ss-scene1.png' });
```

Screenshots saved to `docs/ss-*.png`.

## Architecture

Next.js 15.4 App Router with `output: 'export'` — fully static, no server runtime. Five routes:

| Route | Scene |
|---|---|
| `/` | APS 架构总览（金字塔 + 业务流程）|
| `/scene1` | 智能订单评审（OBBT 算法流程 + 雷达图）|
| `/scene2` | 跨工序甘特图（动态排程窗口）|
| `/scene2/furnace` | 加热炉三模型步进器 |
| `/scene3` | 多维指标驾驶舱（2×2 四象限）|

## Key patterns

**Data loading:** All JSON lives in `src/data/`. Load via typed `require()` wrappers in `src/lib/data-loader.ts`. All interfaces are in `src/types/index.ts` — no `any`, no untyped dicts. The JSON files were hand-curated from `Client Data/` Excel files; they are not auto-generated.

**Charts:** ECharts 5 via `ChartWrapper` (`src/components/shared/ChartWrapper.tsx`), which wraps `echarts-for-react` with `dynamic(..., {ssr: false})`. Pass `option` (typed `Record<string, unknown>`), `height`, and optionally `onEvents` for click handlers. ECharts option objects must use hex color literals — CSS variables are not resolved inside ECharts.

**Click events on ECharts:** Use the `onEvents` prop on `ChartWrapper`, not DOM `onClick`. Canvas renderer doesn't fire events on SVG tags.

**Global state:** Zustand store in `src/lib/store.ts` — `timeRange`, `productLine`, `steelCategory`, `scenario`, plus three param objects: `scene1Params` (Scene1Params), `scene2Params` (Scene2Params), `furnaceParams` (FurnaceParams). Import via `useAppStore`.

**Parameter modals → results flow:** Each param modal (OptimizationModal, ScheduleParamsModal, FurnaceParamsModal) accepts an optional `onApply?: () => void` callback. Page components use this to trigger a 3.5s `OptimizingOverlay` (`src/components/shared/OptimizingOverlay.tsx`) over result cards. The underlying data components read directly from the store and recalculate on every render — the overlay is purely cosmetic.

**`'use client'` boundary:** Only components using `useState`, `useEffect`, ECharts, or `useAppStore` are client components. Page files under `app/scene1/` and `app/scene2/` are `'use client'` because they manage modal state. `app/page.tsx` and `app/scene3/page.tsx` are server components.

**Styling:** Tailwind CSS v4 with `@theme {}` block in `globals.css`. All component colors via CSS variables (`var(--color-primary)`, `var(--color-card-bg)`, etc.). Never hardcode hex values in JSX/TSX — only in ECharts `option` objects and `STAGE_COLORS`-style constants.

**Hydration:** `<body suppressHydrationWarning>` in `layout.tsx` — browser extensions (Grammarly etc.) inject attributes that cause hydration mismatches without it.

## Constraints

- Component files ≤ 300 lines; each directory ≤ 8 files
- `shadcn` is a devDependency (CLI only); actual UI uses Tailwind + CSS variables
- `--color-primary` in `:root` overrides shadcn's oklch default to `#4a7cdc`
- `CrossGantt` xAxis max is driven by `scene2Params.horizon` (48/72/96h) from the store — do not hardcode `72 * 3600 * 1000`
