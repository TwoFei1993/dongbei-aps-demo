# 东北特钢 APS 智能排产系统 · 纯前端 Demo 设计文档

**日期：** 2026-06-30  
**状态：** 已确认，进入实施  

---

## 1. 项目目标

用一个单页应用（SPA）串联三大场景，对外讲清楚"订单评审 → 跨工序排程 → 全局监控"的完整闭环故事线，突出交付、成本、产能三维全局协同这一核心主线。面向麦肯锡客户高管汇报 + 完整业务流程演示双目标。

---

## 2. 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 15.4 + React 19 | App Router，`output: 'export'` 静态导出 |
| 样式 | Tailwind CSS v4 + shadcn/ui | 钢铁灰商务风 |
| 图表 | ECharts 5 | 雷达/甘特/热力/桑基/仪表盘 |
| 状态 | Zustand | 场景切换 + 筛选器全局联动 |
| 图标 | lucide-react | 线性图标 |
| 类型 | TypeScript（全量强类型） | 所有数据结构用 interface 定义 |
| 部署 | Vercel | 静态托管，推送 main 分支自动部署 |
| 包管理 | pnpm | 锁定版本 |

**约束：**
- 所有组件文件 ≤ 300 行
- 每层目录 ≤ 8 个文件
- 禁用 CommonJS，全量 ESM
- 不使用 `any`，不使用未结构化 dict

---

## 3. 视觉规范：钢铁灰

| Token | 值 | 用途 |
|---|---|---|
| `--color-topbar` | `#253348` | 顶栏背景 |
| `--color-sidebar-bg` | `#ffffff` | 侧边栏背景 |
| `--color-sidebar-border` | `#dde3ee` | 侧边栏右边线 |
| `--color-content-bg` | `#f2f4f8` | 内容区背景 |
| `--color-card-bg` | `#ffffff` | 卡片白底 |
| `--color-card-border` | `#dde3ee` | 卡片边框 |
| `--color-primary` | `#4a7cdc` | 主题蓝（激活/图表主色） |
| `--color-positive` | `#10b981` | 正向指标绿 |
| `--color-warning` | `#f59e0b` | 预警橙 |
| `--color-text-title` | `#253348` | 大标题 |
| `--color-text-body` | `#4b5a78` | 正文 |
| `--color-text-muted` | `#8896aa` | 辅助文字 |

---

## 4. 路由结构

```
/                    → APS 架构总览（首页）
/scene1              → 场景1：智能订单评审
/scene2              → 场景2A：四工序协同甘特
/scene2/furnace      → 场景2B：加热炉/均热协同
/scene3              → 场景3：多维指标驾驶舱
```

全局壳：顶栏 + 左侧导航贯穿所有路由。

---

## 5. 文件结构

```
aps-demo/
├── next.config.ts              # output: 'export'
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全局壳（AppShell）
│   │   ├── page.tsx            # 架构总览
│   │   ├── scene1/page.tsx
│   │   ├── scene2/
│   │   │   ├── page.tsx
│   │   │   └── furnace/page.tsx
│   │   └── scene3/page.tsx
│   ├── components/
│   │   ├── shell/              # AppShell, TopBar, SideNav, KpiCapsule（≤4文件）
│   │   ├── overview/           # PyramidArch, BusinessFlow（≤2文件）
│   │   ├── scene1/             # OrderTable, AlgoFlow, ScenarioRadar, ResultTable（≤4文件）
│   │   ├── scene2/             # CrossGantt, ProcessLanes, FurnaceModel, ImproveCards（≤4文件）
│   │   ├── scene3/
│   │   │   ├── demand/         # DemandAccuracy, OrderRhythm（≤3文件）
│   │   │   ├── service/        # OtifChart, ServiceScorecard（≤3文件）
│   │   │   ├── inventory/      # InventoryHeatmap, StockDetail（≤3文件）
│   │   │   └── production/     # PlanExecution, DeviationAlert（≤3文件）
│   │   └── shared/             # KpiCard, ChartWrapper, DrillDrawer, FilterBar（≤4文件）
│   ├── data/
│   │   ├── global/             # global-kpi.json（≤2文件）
│   │   ├── scene1/             # orders-sample.json, order-groups.json, scenarios-radar.json（≤3文件）
│   │   ├── scene2/             # gantt-schedule.json, furnace-model.json（≤2文件）
│   │   └── scene3/             # kpi-demand.json, kpi-service.json, kpi-inventory.json, kpi-production.json（≤4文件）
│   ├── lib/
│   │   ├── store.ts            # Zustand store（场景切换 + 筛选器状态）
│   │   └── data-loader.ts      # JSON 静态导入工具函数
│   └── types/
│       └── index.ts            # 所有数据结构 interface
└── scripts/
    ├── process-data.py         # 数据预处理（uv 运行）
    ├── start.sh
    └── build.sh
```

**架构约束**：每组件文件 ≤ 300 行；每目录 ≤ 8 文件（scene3 用二级子目录拆分）。

---

## 6. 数据策略

### 6.1 聚合层（真实计算结果）

| 数据 | 原始文件 | 字段 |
|---|---|---|
| 月度结算完成率 | `2026年结算合同完成率.xlsx` | 件数/吨数完成率，1~5月 |
| 确认合同汇总 | `2026年销售合同执行汇总.xlsx` | 按产线件数/吨数/欠交量 |
| 生产主要指标 | `生产管理处--2026年5月份主要指标表.xlsx` | 轧钢量、材成率、收入 |
| 库存分类汇总 | `2026年5月底成品库存清单.xlsx` | 按钢类/产线库存量 |
| 在制品状态 | `东北特殊钢股份2026年5月份在制品汇总.xlsx` | 工序库存快照 |

### 6.2 明细层（抽样真实记录）

| 数据 | 原始文件 | 抽样策略 |
|---|---|---|
| 订单池（场景1） | `5月排产合同.xlsx` | 按钢类分层抽样，共300条 |
| 甘特作业计划（场景2） | `6月21~23日 东区/西区作业计划` | 全量（约180条） |
| 库存明细下钻 | `成品库存清单.xlsx Sheet:库存` | 按库存周期抽样，共200条 |

### 6.3 设计文档中的示例数据（Mock 常量）

以下数据在真实文件中无完全对应字段，以 `const` 常量形式内嵌在对应组件文件中（不写入 `data/` JSON）：
- 三情景雷达图的5维评分（在 `ScenarioRadar.tsx` 内定义）
- 加热炉三模型的预测曲线（在 `FurnaceModel.tsx` 内定义，参数化自第二轧钢厂分析数据）
- 订单组合优化结果标注（在 `ResultTable.tsx` 内定义，钢种/规格取自真实抽样）

所有组件的 `interface` 定义统一在 `src/types/index.ts`，mock 常量满足同一 interface，可随时替换为真实 JSON。

### 6.4 ECharts 甘特实现方案

- 使用 ECharts 5 `custom series`（官方推荐路径），无需第三方扩展
- 数据量约 180 条，按工序分4组渲染（连铸/加热炉/轧机/精整各约45条），不需要虚拟滚动
- 联动高亮：维护 `batchId` 字段，点击时调用 `chart.dispatchAction({ type: 'highlight' })` 过滤同批次色块
- 首屏性能：JSON 静态导入（非 fetch），ECharts 按需引入（tree-shaking），预计 JS bundle ≤ 400KB

---

## 7. 页面详细设计

### 7.1 架构总览（`/`）

四层金字塔结构：
1. **业务目标**：交付↑8~10% / 效率（耗时↓50~70%、自动化70~80%）/ 成本（吨钢↓15~20%、OEE↑6~8%）
2. **业务流程**：高级计划模块 + 高级排程模块（点击跳转对应场景）
3. **体系支撑**：业绩管控 / 数字信息化（ERP-APS-MES-L2 四级）/ 组织能力
4. 顶部全局 KPI 胶囊条（真实目标值）

### 7.2 场景1：智能订单评审（`/scene1`）

三栏布局：
- **左栏（输入）**：订单池表格（抽样真实300条，可筛选钢种/产线）
- **中栏（算法）**：OBBT 流程图动效（订单池→紧缩→解池→验证→最优解），可点击节点
- **右栏（输出）**：三情景切换器 + 订单组合结果表

底部：五维雷达图对比三情景（吨钢毛利/产能利用率/战略客户交期/整体交付/库存水平）

交互：切换情景 → 雷达图联动 + 右栏结果刷新

数据源：真实钢种（GCr15、42CrMo、38CrMoAl 等来自5月排产合同）

### 7.3 场景2A：四工序协同甘特（`/scene2`）

- 横向四工序泳道：连铸 / 加热炉 / 轧机 / 精整
- Y轴：各工序具体设备（连铸2#、3#，加热炉1#、2#，大棒轧机，精整线）
- X轴：72小时时间窗口
- 数据：真实6月21~23日东区+西区作业计划（约180条炉次）
- 交互：点击炉批 → 高亮上下游关联块 + 浮窗显示约束命中

底部：三块 APS 能力卡（工序协同/资源优化/交付保障）

### 7.4 场景2B：加热炉/均热协同（`/scene2/furnace`）

三模型步进器：
1. **加热时间预测**：预测 vs 实际曲线（依据第二轧钢厂过程分析数据），精度目标 ±5min
2. **装炉排序优化**：ΔT≤50° 分组色带可视化
3. **模铸均热优化**：节拍匹配甘特

指标改善卡（真实目标值）：
- 轧线等炉停机 −50%
- OEE +6%
- 能耗 −8%
- 热装热送率 +15%

### 7.5 场景3：多维指标驾驶舱（`/scene3`）

2×2 四象限：
- **需求域**：需求预测准确率（柱+折线）/ 接单节奏 / 环比异常分析
- **客户服务域**：OTIF 履约水平（堆叠柱+目标线）/ 延迟明细 / 客户计分卡
- **库存与供应域**：库存周转热力图（品类×月份）/ 分类明细 / 过剩与缺口预测
- **生产执行域**：计划执行率（双轴柱状）/ 供给偏差预警 Top5

数据：全部来自真实聚合值（结算完成率、生产指标表、库存清单）

交互：
- 顶部筛选器（时间范围/产线/钢类）全局联动
- 点击卡片 → 右侧抽屉明细下钻
- 时间轴滑块（历史实绩 ↔ 预测区间）

---

## 8. 全局 KPI 胶囊条（真实目标值）

来源：`生产管理处--2026年5月份主要指标表.xlsx`

| 胶囊 | 显示 | 数据基础 |
|---|---|---|
| 交付准时率 | ↑8~10% | 年度目标 |
| 排产计划耗时 | ↓50~70% | APS 目标 |
| 吨钢成本 | ↓15~20% | 年度目标 |
| 大棒线 OEE | ↑6~8% | 第二轧钢厂分析数据 |

---

## 9. 实施优先级

| 顺序 | 内容 | 说明 |
|---|---|---|
| 1 | 项目脚手架 + 数据预处理脚本 | Next.js 初始化，Python 脚本提取真实数据 |
| 2 | 全局壳（顶栏+侧边栏+路由） | 所有页面共用 |
| 3 | 架构总览页 | 首屏，金字塔结构 |
| 4 | 场景3 驾驶舱 | 高管冲击力优先 |
| 5 | 场景1 订单评审 | 故事线起点 |
| 6 | 场景2 甘特 + 加热炉 | 算法深度 |
| 7 | 视觉打磨 + Vercel 部署 | 交付 |
