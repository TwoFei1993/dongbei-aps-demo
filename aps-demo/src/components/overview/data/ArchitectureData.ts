import type { AgentLayerData } from './OverviewAgentData'
import { ORDER_REVIEW_AGENT_LAYERS, CROSS_PROCESS_AGENT_LAYERS } from './OverviewAgentData'

export interface SubFlowNode {
  title: string
  points: string[]
}

export interface ArchitectureLayerData {
  id: string
  index: number
  title: string
  subtitle: string
  color: string
  expandable: boolean
  href?: string
  subFlows?: SubFlowNode[]
  stageFlow?: string[]
  agentLayers?: AgentLayerData[]
}

export const ARCHITECTURE_LAYERS: ArchitectureLayerData[] = [
  {
    id: 'order-review',
    index: 1,
    title: '智能订单评审系统',
    subtitle: '需求预测与资源计划 · 接单前可行性评估',
    color: '#4a7cdc',
    expandable: true,
    href: '/scene1',
    subFlows: [
      {
        title: '需求预测 → 订单评审预测模型',
        points: ['销售预测模型、市场需求分析', '订单可行性评估（产能、时间、成本）', '自动生成评审决策反馈'],
      },
      {
        title: '资源计划 → 资源配置优化',
        points: ['资源可用性核查、库存评估', '交期能力评估、配置分配方案'],
      },
    ],
    agentLayers: ORDER_REVIEW_AGENT_LAYERS,
  },
  {
    id: 'order-integration',
    index: 2,
    title: '订单一体化管理',
    subtitle: '订单接收 · 结构化处理与优先级排序',
    color: '#f59e0b',
    expandable: false,
    subFlows: [
      {
        title: '订单接收 → 智能评审与排序',
        points: ['订单结构化处理', '主生产计划模型（MPS）', '优先级排序算法'],
      },
    ],
  },
  {
    id: 'cross-process',
    index: 3,
    title: '全流程跨工序动态排程',
    subtitle: '计划协同 · 生产调度 · 执行优化',
    color: '#0ea5e9',
    expandable: true,
    href: '/scene2',
    subFlows: [
      {
        title: '计划协同',
        points: ['铁钢界面协议、钢铁一体计划模型', '跨工序时间窗口约束'],
      },
      {
        title: '生产调度（核心动态排程层）',
        points: [
          '多工序智能排程：炼钢调度、热轧排程、热处理排程、冷轧排程、线材深加工',
          '动态瓶颈识别与平衡',
          '工序间缓冲库存管理',
          '实时上浮与下压调整',
        ],
      },
      {
        title: '执行优化',
        points: ['钢包调选、行车调度、厂内物流化', '发运优化、智能调度优化模型'],
      },
    ],
    agentLayers: CROSS_PROCESS_AGENT_LAYERS,
  },
  {
    id: 'value-chain-loop',
    index: 4,
    title: '产业链闭环',
    subtitle: '全链条追溯与反馈 · 质量数据互通 · 成本核算传递',
    color: '#10b981',
    expandable: false,
    stageFlow: ['原料场', '炼铁', '炼钢', '热轧', '热处理', '冷轧', '深加工'],
  },
]
