import type { LucideIcon } from 'lucide-react'
import {
  Gauge, CalendarClock, TrendingUp, Target, FileText, Layers, GitBranch,
  History, RefreshCw, Flame, Wrench, ClipboardList, Activity, Scale,
} from 'lucide-react'

export interface AgentDetail {
  overview: string
  workflow: string[]
}

export interface AgentCardData {
  icon: LucideIcon
  title: string
  desc: string
  tags: string[]
  detail?: AgentDetail
}

export interface AgentLayerData {
  key: 'decision' | 'execution' | 'reporting'
  label: string
  desc: string
  agents: AgentCardData[]
}

export const ORDER_REVIEW_AGENT_LAYERS: AgentLayerData[] = [
  {
    key: 'decision',
    label: '决策层',
    desc: '战略规划和多维度评估',
    agents: [
      {
        icon: Gauge, title: '产能评估 Agent', desc: '评估产线产能余量与瓶颈工序，测算可承接空间', tags: ['产能余量', '瓶颈识别'],
        detail: {
          overview: '基于当前生产计划与设备负荷数据，实时测算各产线的可用产能余量，识别潜在瓶颈工序，为订单可行性判断提供产能维度依据。',
          workflow: ['拉取产线设备日历与在制订单负荷数据', '按工序维度计算产能利用率与剩余空间', '识别负荷最高的瓶颈工序并标记预警', '输出产能余量报告供战略决策 Agent 调用'],
        },
      },
      {
        icon: CalendarClock, title: '交期评估 Agent', desc: '校验订单交期可行性，锁定 ATP 承诺窗口', tags: ['ATP窗口', '交期校验'],
        detail: {
          overview: '结合产能余量与在途订单排队情况，校验新订单要求交期是否可行，并计算可承诺交付（ATP）窗口。',
          workflow: ['读取订单要求交期与优先级', '结合产能评估结果测算最早可完工时间', '校验是否落在 ATP 承诺窗口内', '输出交期可行性结论与建议窗口'],
        },
      },
      {
        icon: TrendingUp, title: '利润评估 Agent', desc: '测算吨钢毛利与钢种切换成本，量化经济性', tags: ['毛利测算', '切换成本'],
        detail: {
          overview: '核算订单对应钢种的吨钢毛利，并测算与当前排产钢种切换所产生的额外成本，为接单决策提供经济性量化依据。',
          workflow: ['匹配订单钢种与最新成本/售价数据', '测算标准吨钢毛利', '评估钢种切换对现有排产的成本影响', '汇总输出经济性评分'],
        },
      },
      {
        icon: Target, title: '战略决策 Agent', desc: '综合三维评估输出接单/拒单/调整策略', tags: ['接单决策', '战略优先级'],
        detail: {
          overview: '汇总产能、交期、利润三个维度的评估结果，结合企业战略优先级，输出接单、拒单或条件调整的最终决策建议。',
          workflow: ['汇总产能/交期/利润三项评估结果', '按战略权重加权计算综合评分', '对照阈值规则生成接单/拒单/调整建议', '推送决策结果至执行层触发后续处理'],
        },
      },
    ],
  },
  {
    key: 'execution',
    label: '执行层',
    desc: '具体任务执行和工序协调',
    agents: [
      {
        icon: FileText, title: '合同解析 Agent', desc: '解析 ERP 合同订单，结构化归集候选批次', tags: ['ERP解析', '批次归集'],
        detail: {
          overview: '自动解析 ERP 系统下发的合同订单文本，提取钢种、规格、数量、交期等关键字段，结构化归集为候选评审批次。',
          workflow: ['从 ERP 接口拉取原始合同订单数据', '抽取钢种/规格/数量/交期等结构化字段', '按客户与交期归集候选批次', '推送结构化数据至 OBBT 求解 Agent'],
        },
      },
      {
        icon: Layers, title: 'OBBT 求解 Agent', desc: '分支定界迭代紧缩解空间，生成可行解池', tags: ['分支定界', '解池生成'],
        detail: {
          overview: '采用最优性边界紧缩（OBBT）算法对订单组合空间进行分支定界求解，迭代收紧变量边界，生成一组高质量可行解。',
          workflow: ['构建订单组合的约束与目标函数模型', '执行 OBBT 边界紧缩迭代', '分支定界搜索可行解空间', '汇集候选解形成可行解池'],
        },
      },
      {
        icon: GitBranch, title: '排程触发 Agent', desc: '生成最优方案并下发排程指令至场景 02', tags: ['方案生成', '指令下发'],
        detail: {
          overview: '从可行解池中筛选综合最优方案，生成正式排程指令，并下发至场景 02（全流程跨工序动态排程）触发执行。',
          workflow: ['对可行解池按综合评分排序', '选定最优方案并生成排程指令', '校验指令格式与下游接口兼容性', '下发指令至跨工序动态排程模块'],
        },
      },
    ],
  },
  {
    key: 'reporting',
    label: '汇报层',
    desc: '监控、追踪和优化反馈',
    agents: [
      {
        icon: History, title: '评审追踪 Agent', desc: '记录评审全流程留痕，沉淀决策依据用于审计', tags: ['流程留痕', '审计追溯'],
        detail: {
          overview: '记录每笔订单评审的完整过程与关键决策节点，形成可追溯的留痕记录，支持后续审计与复盘。',
          workflow: ['记录评审各阶段的输入输出数据', '标记关键决策节点与责任 Agent', '归档评审全流程日志', '提供审计查询与复盘接口'],
        },
      },
      {
        icon: RefreshCw, title: '反馈优化 Agent', desc: '回收执行结果，持续优化评审规则与权重', tags: ['规则迭代', '模型优化'],
        detail: {
          overview: '收集订单执行后的实际结果，与评审阶段的预测进行对比分析，持续优化评审规则与权重配置。',
          workflow: ['回收订单执行后的实际交期/成本/毛利数据', '对比评审阶段预测值与实际值偏差', '分析偏差原因并定位规则短板', '调整评审规则权重并推送更新'],
        },
      },
    ],
  },
]

export const CROSS_PROCESS_AGENT_LAYERS: AgentLayerData[] = [
  {
    key: 'decision',
    label: '决策层',
    desc: '战略规划和多维度评估',
    agents: [
      {
        icon: Target, title: '排程目标 Agent', desc: '设定交付/成本/均衡优化目标权重与排程窗口', tags: ['优化目标', '情景切换'],
        detail: {
          overview: '根据当前生产经营策略，设定交付、成本、产能均衡等多目标的优化权重，并划定排程时间窗口。',
          workflow: ['读取当期经营策略与优先级设定', '分配交付/成本/均衡目标权重', '确定本轮排程的时间窗口范围', '输出排程目标配置供全局协同 Agent 使用'],
        },
      },
      {
        icon: Layers, title: '全局协同 Agent', desc: '识别跨工序资源冲突，输出全局最优排程策略', tags: ['资源冲突', '全局最优'],
        detail: {
          overview: '统筹炼钢、连铸、轧钢等多工序的资源占用情况，识别跨工序冲突点，输出兼顾全局效率的排程策略。',
          workflow: ['汇总各工序资源占用与产能数据', '识别跨工序时间窗口与资源冲突', '运行全局优化模型求解排程策略', '下发策略至各执行层 Agent 协同落地'],
        },
      },
    ],
  },
  {
    key: 'execution',
    label: '执行层',
    desc: '具体任务执行和工序协调',
    agents: [
      {
        icon: Flame, title: '连铸组浇 Agent', desc: 'MOQ 约束下浇次编排与钢种切换排序', tags: ['浇次编排', 'MOQ约束'],
        detail: {
          overview: '在最小开浇量（MOQ）约束下，对连铸浇次进行编排，并优化钢种切换顺序以降低换浇损耗。',
          workflow: ['汇总待浇注炉次的钢种与数量', '校验 MOQ 约束下的可组浇组合', '按切换成本最小化原则排序浇次', '输出连铸浇次编排计划'],
        },
      },
      {
        icon: Flame, title: '加热炉协同 Agent', desc: '温度分组装炉，匹配加热节拍与出炉时间', tags: ['装炉分组', '节拍匹配'],
        detail: {
          overview: '按坯料目标温度分组装炉，协调加热炉节拍与轧线出炉时间的匹配，减少等待与热损耗。',
          workflow: ['按目标轧制温度对坯料分组', '匹配加热炉可用装炉时段', '协调出炉节拍与轧线上线时间', '输出装炉排序与节拍匹配方案'],
        },
      },
      {
        icon: Wrench, title: '轧线组辊 Agent', desc: '辊期约束下规格分组匹配，优化换辊计划', tags: ['辊型匹配', '换辊计划'],
        detail: {
          overview: '在辊期寿命约束下，对轧制规格进行分组匹配，优化换辊排产计划以减少换辊频次和停机损失。',
          workflow: ['读取当前辊期寿命与剩余可轧量', '按规格相似度对待轧订单分组', '在辊期约束下排定换辊时机', '输出组辊排产与换辊计划'],
        },
      },
      {
        icon: ClipboardList, title: '精整排产 Agent', desc: '交期倒排调度，平衡精整设备资源', tags: ['交期倒排', '资源平衡'],
        detail: {
          overview: '依据订单交期倒排精整工序调度顺序，平衡各精整设备资源负荷，确保交付节点达成。',
          workflow: ['按订单交期倒排精整作业顺序', '核算各精整设备当前负荷', '平衡设备资源分配调度任务', '输出精整工序排产计划'],
        },
      },
    ],
  },
  {
    key: 'reporting',
    label: '汇报层',
    desc: '监控、追踪和优化反馈',
    agents: [
      {
        icon: Activity, title: '排程监控 Agent', desc: '实时追踪排程执行偏差，触发异常预警', tags: ['执行偏差', '异常预警'],
        detail: {
          overview: '实时追踪各工序排程执行进度与计划偏差，一旦超出阈值即触发异常预警，通知相关执行 Agent 介入。',
          workflow: ['实时采集各工序执行进度数据', '对比计划排程与实际执行偏差', '超阈值触发异常预警', '推送预警信息至相关执行 Agent'],
        },
      },
      {
        icon: Scale, title: '优化反馈 Agent', desc: '沉淀执行数据，反哺排程模型持续优化', tags: ['数据沉淀', '模型优化'],
        detail: {
          overview: '沉淀历次排程执行的过程与结果数据，反哺排程优化模型的参数与规则，实现持续迭代提升。',
          workflow: ['汇总历次排程执行数据与偏差记录', '分析模型预测与实际结果的差异', '提炼可优化的参数与规则', '更新排程优化模型并验证效果'],
        },
      },
    ],
  },
]
