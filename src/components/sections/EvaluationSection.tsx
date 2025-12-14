import { useState } from 'react';
import { BarChart3, Layers, Bot, Wrench, GitBranch, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Play, Download, Filter, Eye, Activity, Zap, History, ArrowRight, ExternalLink, RefreshCw, Timer, Hash, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const layerData = [
  { layer: 'Model', current: 96, previous: 92, baseline: 85 },
  { layer: 'Agent', current: 91, previous: 88, baseline: 80 },
  { layer: 'Tools', current: 93, previous: 90, baseline: 82 },
  { layer: 'Workflow', current: 88, previous: 84, baseline: 75 },
  { layer: 'E2E', current: 85, previous: 80, baseline: 70 },
];

const radarData = [
  { metric: 'Accuracy', value: 94 },
  { metric: 'Latency', value: 88 },
  { metric: 'Token Efficiency', value: 82 },
  { metric: 'Reliability', value: 96 },
  { metric: 'Consistency', value: 90 },
  { metric: 'Coverage', value: 85 },
];

const timelineData = [
  { time: 'Week 1', model: 88, agent: 82, tools: 85, workflow: 78, e2e: 72 },
  { time: 'Week 2', model: 90, agent: 85, tools: 87, workflow: 80, e2e: 75 },
  { time: 'Week 3', model: 93, agent: 88, tools: 90, workflow: 83, e2e: 79 },
  { time: 'Week 4', model: 96, agent: 91, tools: 93, workflow: 88, e2e: 85 },
];

// Detailed metrics for each layer
const modelMetrics = {
  hallucinationTests: [
    { name: 'Factual Accuracy', passed: 982, failed: 18, rate: 98.2 },
    { name: 'Citation Verification', passed: 945, failed: 55, rate: 94.5 },
    { name: 'Contradiction Detection', passed: 967, failed: 33, rate: 96.7 },
    { name: 'Source Attribution', passed: 891, failed: 109, rate: 89.1 },
  ],
  latencyDistribution: [
    { range: '0-200ms', count: 120, percentage: 12 },
    { range: '200-500ms', count: 380, percentage: 38 },
    { range: '500-1s', count: 320, percentage: 32 },
    { range: '1-2s', count: 150, percentage: 15 },
    { range: '>2s', count: 30, percentage: 3 },
  ],
  tokenEfficiency: [
    { model: 'GPT-4o', avgTokens: 1250, cost: 0.0125, efficiency: 94 },
    { model: 'Claude 3.5', avgTokens: 1180, cost: 0.0108, efficiency: 96 },
    { model: 'Gemini Pro', avgTokens: 1320, cost: 0.0099, efficiency: 92 },
  ],
};

const agentMetrics = {
  decisionTree: [
    { step: 'Intent Recognition', success: 97.2, avgTime: '120ms' },
    { step: 'Context Retrieval', success: 95.8, avgTime: '85ms' },
    { step: 'Action Planning', success: 93.1, avgTime: '210ms' },
    { step: 'Execution', success: 98.5, avgTime: '450ms' },
    { step: 'Validation', success: 99.1, avgTime: '65ms' },
  ],
  taskCompletionByType: [
    { type: 'Incident Classification', completion: 96, avgSteps: 2.1 },
    { type: 'Escalation Decision', completion: 89, avgSteps: 3.4 },
    { type: 'Resolution Suggestion', completion: 84, avgSteps: 4.2 },
    { type: 'Status Update', completion: 99, avgSteps: 1.5 },
    { type: 'Knowledge Retrieval', completion: 92, avgSteps: 2.8 },
  ],
  contextHandling: {
    shortContext: { accuracy: 98, samples: 5200 },
    mediumContext: { accuracy: 94, samples: 3100 },
    longContext: { accuracy: 87, samples: 1200 },
  },
};

const toolsMetrics = {
  apiCalls: [
    { api: 'ServiceNow API', calls: 12450, success: 99.2, avgLatency: '320ms' },
    { api: 'Jira API', calls: 8320, success: 98.8, avgLatency: '280ms' },
    { api: 'PagerDuty API', calls: 3240, success: 99.5, avgLatency: '150ms' },
    { api: 'Slack API', calls: 45200, success: 99.9, avgLatency: '95ms' },
    { api: 'Azure DevOps', calls: 6780, success: 98.1, avgLatency: '410ms' },
  ],
  toolSelectionAccuracy: [
    { tool: 'createTicket', selected: 1250, correct: 1188, accuracy: 95.0 },
    { tool: 'updatePriority', selected: 890, correct: 845, accuracy: 94.9 },
    { tool: 'assignAgent', selected: 650, correct: 598, accuracy: 92.0 },
    { tool: 'sendNotification', selected: 2100, correct: 2058, accuracy: 98.0 },
    { tool: 'fetchKnowledge', selected: 1800, correct: 1692, accuracy: 94.0 },
  ],
};

const workflowMetrics = {
  flows: [
    { name: 'Incident Triage Flow', completions: 2450, success: 92.4, avgDuration: '4.2s', agents: 3 },
    { name: 'P1 Escalation Flow', completions: 180, success: 88.3, avgDuration: '8.5s', agents: 4 },
    { name: 'Auto-Resolution Flow', completions: 1890, success: 85.2, avgDuration: '12.1s', agents: 5 },
    { name: 'Knowledge Update Flow', completions: 560, success: 94.8, avgDuration: '3.8s', agents: 2 },
  ],
  handoffQuality: [
    { from: 'ClassifierAgent', to: 'EscalationAgent', success: 96.2, dataLoss: 0.8 },
    { from: 'EscalationAgent', to: 'ResolutionAgent', success: 94.5, dataLoss: 1.2 },
    { from: 'ResolutionAgent', to: 'ValidatorAgent', success: 98.1, dataLoss: 0.3 },
  ],
};

const e2eMetrics = {
  resolutionByCategory: [
    { category: 'Network Issues', rate: 87, mttr: '8min', volume: 450 },
    { category: 'Authentication', rate: 92, mttr: '5min', volume: 680 },
    { category: 'Performance', rate: 78, mttr: '15min', volume: 320 },
    { category: 'Integration', rate: 81, mttr: '12min', volume: 210 },
    { category: 'Data Issues', rate: 75, mttr: '18min', volume: 180 },
  ],
  satisfaction: {
    rating: 4.6,
    breakdown: [
      { stars: 5, count: 580 },
      { stars: 4, count: 280 },
      { stars: 3, count: 85 },
      { stars: 2, count: 35 },
      { stars: 1, count: 20 },
    ],
  },
  businessKPIs: [
    { kpi: 'MTTR Reduction', value: '-42%', trend: 'up' },
    { kpi: 'First Contact Resolution', value: '78%', trend: 'up' },
    { kpi: 'Ticket Backlog', value: '-65%', trend: 'up' },
    { kpi: 'Agent Utilization', value: '92%', trend: 'neutral' },
  ],
};

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Detailed execution data
const executionHistory = [
  {
    id: 'EXEC-001',
    workflowId: 'WF-TRIAGE-001',
    workflowName: 'Incident Triage Flow',
    agentId: 'AGT-CLASSIFIER-01',
    agentName: 'ClassifierAgent',
    timestamp: '2024-12-15 14:32:15',
    status: 'completed',
    duration: '4.2s',
    inputTokens: 1250,
    outputTokens: 380,
    cost: 0.0125,
    score: 94.5,
    steps: [
      { name: 'Intent Recognition', duration: '120ms', status: 'success', score: 97 },
      { name: 'Context Retrieval', duration: '85ms', status: 'success', score: 95 },
      { name: 'Classification', duration: '210ms', status: 'success', score: 96 },
      { name: 'Priority Assignment', duration: '65ms', status: 'success', score: 92 },
    ],
    toolCalls: [
      { tool: 'fetchKnowledge', duration: '180ms', success: true },
      { tool: 'classifyIntent', duration: '95ms', success: true },
    ],
  },
  {
    id: 'EXEC-002',
    workflowId: 'WF-ESCALATE-001',
    workflowName: 'P1 Escalation Flow',
    agentId: 'AGT-ESCALATION-01',
    agentName: 'EscalationAgent',
    timestamp: '2024-12-15 14:28:42',
    status: 'completed',
    duration: '8.5s',
    inputTokens: 2100,
    outputTokens: 520,
    cost: 0.0215,
    score: 88.2,
    steps: [
      { name: 'Severity Analysis', duration: '280ms', status: 'success', score: 92 },
      { name: 'Impact Assessment', duration: '450ms', status: 'success', score: 88 },
      { name: 'Escalation Decision', duration: '180ms', status: 'success', score: 85 },
      { name: 'Notification Dispatch', duration: '120ms', status: 'success', score: 91 },
    ],
    toolCalls: [
      { tool: 'fetchIncidentHistory', duration: '320ms', success: true },
      { tool: 'checkSLAStatus', duration: '85ms', success: true },
      { tool: 'sendNotification', duration: '95ms', success: true },
    ],
  },
  {
    id: 'EXEC-003',
    workflowId: 'WF-RESOLVE-001',
    workflowName: 'Auto-Resolution Flow',
    agentId: 'AGT-RESOLVER-01',
    agentName: 'ResolutionAgent',
    timestamp: '2024-12-15 14:25:18',
    status: 'failed',
    duration: '12.1s',
    inputTokens: 3200,
    outputTokens: 890,
    cost: 0.0342,
    score: 45.2,
    steps: [
      { name: 'Solution Lookup', duration: '520ms', status: 'success', score: 88 },
      { name: 'Action Planning', duration: '680ms', status: 'success', score: 82 },
      { name: 'Execution', duration: '8.2s', status: 'failed', score: 32 },
      { name: 'Validation', duration: '—', status: 'skipped', score: 0 },
    ],
    toolCalls: [
      { tool: 'fetchKnowledge', duration: '280ms', success: true },
      { tool: 'executeRunbook', duration: '7.8s', success: false },
    ],
    error: 'Runbook execution timed out: Connection to target system failed after 3 retries',
  },
  {
    id: 'EXEC-004',
    workflowId: 'WF-TRIAGE-001',
    workflowName: 'Incident Triage Flow',
    agentId: 'AGT-CLASSIFIER-01',
    agentName: 'ClassifierAgent',
    timestamp: '2024-12-15 14:20:05',
    status: 'completed',
    duration: '3.8s',
    inputTokens: 980,
    outputTokens: 290,
    cost: 0.0098,
    score: 96.8,
    steps: [
      { name: 'Intent Recognition', duration: '95ms', status: 'success', score: 99 },
      { name: 'Context Retrieval', duration: '78ms', status: 'success', score: 97 },
      { name: 'Classification', duration: '185ms', status: 'success', score: 95 },
      { name: 'Priority Assignment', duration: '52ms', status: 'success', score: 96 },
    ],
    toolCalls: [
      { tool: 'fetchKnowledge', duration: '145ms', success: true },
      { tool: 'classifyIntent', duration: '88ms', success: true },
    ],
  },
  {
    id: 'EXEC-005',
    workflowId: 'WF-KNOWLEDGE-001',
    workflowName: 'Knowledge Update Flow',
    agentId: 'AGT-KNOWLEDGE-01',
    agentName: 'KnowledgeAgent',
    timestamp: '2024-12-15 14:15:30',
    status: 'completed',
    duration: '3.2s',
    inputTokens: 1450,
    outputTokens: 680,
    cost: 0.0158,
    score: 92.1,
    steps: [
      { name: 'Content Extraction', duration: '380ms', status: 'success', score: 94 },
      { name: 'Deduplication', duration: '220ms', status: 'success', score: 91 },
      { name: 'Indexing', duration: '185ms', status: 'success', score: 93 },
      { name: 'Validation', duration: '95ms', status: 'success', score: 90 },
    ],
    toolCalls: [
      { tool: 'extractContent', duration: '280ms', success: true },
      { tool: 'updateIndex', duration: '150ms', success: true },
    ],
  },
];

// Workflow-specific metrics
const workflowExecutionMetrics = [
  {
    id: 'WF-TRIAGE-001',
    name: 'Incident Triage Flow',
    description: 'Classifies and prioritizes incoming incidents',
    totalExecutions: 2450,
    successRate: 92.4,
    avgDuration: '4.2s',
    avgScore: 94.2,
    avgTokens: 1150,
    avgCost: 0.0112,
    agents: ['ClassifierAgent', 'PrioritizerAgent'],
    lastExecution: '2024-12-15 14:32:15',
    trend: [85, 88, 90, 92, 94, 92],
    stepBreakdown: [
      { step: 'Intent Recognition', avgDuration: '115ms', successRate: 97.2 },
      { step: 'Context Retrieval', avgDuration: '82ms', successRate: 95.8 },
      { step: 'Classification', avgDuration: '195ms', successRate: 94.5 },
      { step: 'Priority Assignment', avgDuration: '58ms', successRate: 96.1 },
    ],
  },
  {
    id: 'WF-ESCALATE-001',
    name: 'P1 Escalation Flow',
    description: 'Handles critical incident escalation and notifications',
    totalExecutions: 180,
    successRate: 88.3,
    avgDuration: '8.5s',
    avgScore: 87.5,
    avgTokens: 2250,
    avgCost: 0.0228,
    agents: ['EscalationAgent', 'NotificationAgent'],
    lastExecution: '2024-12-15 14:28:42',
    trend: [82, 84, 86, 88, 87, 88],
    stepBreakdown: [
      { step: 'Severity Analysis', avgDuration: '265ms', successRate: 91.8 },
      { step: 'Impact Assessment', avgDuration: '420ms', successRate: 88.2 },
      { step: 'Escalation Decision', avgDuration: '175ms', successRate: 85.5 },
      { step: 'Notification Dispatch', avgDuration: '115ms', successRate: 94.2 },
    ],
  },
  {
    id: 'WF-RESOLVE-001',
    name: 'Auto-Resolution Flow',
    description: 'Automatically resolves known issues using runbooks',
    totalExecutions: 1890,
    successRate: 85.2,
    avgDuration: '12.1s',
    avgScore: 82.8,
    avgTokens: 3100,
    avgCost: 0.0315,
    agents: ['ResolutionAgent', 'ExecutorAgent', 'ValidatorAgent'],
    lastExecution: '2024-12-15 14:25:18',
    trend: [78, 80, 82, 84, 85, 85],
    stepBreakdown: [
      { step: 'Solution Lookup', avgDuration: '480ms', successRate: 92.1 },
      { step: 'Action Planning', avgDuration: '620ms', successRate: 88.5 },
      { step: 'Execution', avgDuration: '8.5s', successRate: 82.3 },
      { step: 'Validation', avgDuration: '380ms', successRate: 95.8 },
    ],
  },
  {
    id: 'WF-KNOWLEDGE-001',
    name: 'Knowledge Update Flow',
    description: 'Updates and maintains the knowledge base',
    totalExecutions: 560,
    successRate: 94.8,
    avgDuration: '3.8s',
    avgScore: 91.5,
    avgTokens: 1580,
    avgCost: 0.0162,
    agents: ['KnowledgeAgent', 'IndexerAgent'],
    lastExecution: '2024-12-15 14:15:30',
    trend: [88, 90, 92, 93, 94, 95],
    stepBreakdown: [
      { step: 'Content Extraction', avgDuration: '350ms', successRate: 95.2 },
      { step: 'Deduplication', avgDuration: '210ms', successRate: 93.8 },
      { step: 'Indexing', avgDuration: '175ms', successRate: 96.1 },
      { step: 'Validation', avgDuration: '88ms', successRate: 94.5 },
    ],
  },
];

// Agent-specific metrics
const agentExecutionMetrics = [
  {
    id: 'AGT-CLASSIFIER-01',
    name: 'ClassifierAgent',
    type: 'Classification',
    model: 'GPT-4o',
    totalExecutions: 4850,
    successRate: 96.2,
    avgLatency: '420ms',
    avgScore: 95.8,
    avgTokens: { input: 1180, output: 320 },
    avgCost: 0.0108,
    workflows: ['Incident Triage Flow', 'P1 Escalation Flow'],
    capabilities: ['Intent Recognition', 'Category Classification', 'Priority Assignment'],
    lastExecution: '2024-12-15 14:32:15',
    performanceTrend: [92, 94, 95, 96, 96, 96],
    recentExecutions: [
      { id: 'EXEC-001', timestamp: '14:32:15', duration: '4.2s', score: 94.5, status: 'success' },
      { id: 'EXEC-004', timestamp: '14:20:05', duration: '3.8s', score: 96.8, status: 'success' },
      { id: 'EXEC-008', timestamp: '13:58:22', duration: '4.5s', score: 93.2, status: 'success' },
    ],
    errorBreakdown: [
      { type: 'Misclassification', count: 45, percentage: 38 },
      { type: 'Timeout', count: 28, percentage: 24 },
      { type: 'Context Overflow', count: 22, percentage: 19 },
      { type: 'Other', count: 23, percentage: 19 },
    ],
  },
  {
    id: 'AGT-ESCALATION-01',
    name: 'EscalationAgent',
    type: 'Decision Making',
    model: 'Claude 3.5 Sonnet',
    totalExecutions: 1250,
    successRate: 91.5,
    avgLatency: '680ms',
    avgScore: 88.2,
    avgTokens: { input: 2200, output: 480 },
    avgCost: 0.0195,
    workflows: ['P1 Escalation Flow', 'Incident Triage Flow'],
    capabilities: ['Severity Analysis', 'Impact Assessment', 'Escalation Decision'],
    lastExecution: '2024-12-15 14:28:42',
    performanceTrend: [86, 88, 89, 90, 91, 92],
    recentExecutions: [
      { id: 'EXEC-002', timestamp: '14:28:42', duration: '8.5s', score: 88.2, status: 'success' },
      { id: 'EXEC-007', timestamp: '14:05:18', duration: '7.8s', score: 91.5, status: 'success' },
      { id: 'EXEC-012', timestamp: '13:42:55', duration: '9.2s', score: 85.8, status: 'success' },
    ],
    errorBreakdown: [
      { type: 'Wrong Escalation Level', count: 52, percentage: 42 },
      { type: 'Missed SLA', count: 35, percentage: 28 },
      { type: 'Notification Failure', count: 22, percentage: 18 },
      { type: 'Other', count: 15, percentage: 12 },
    ],
  },
  {
    id: 'AGT-RESOLVER-01',
    name: 'ResolutionAgent',
    type: 'Action Execution',
    model: 'GPT-4o',
    totalExecutions: 2890,
    successRate: 85.8,
    avgLatency: '1.2s',
    avgScore: 82.5,
    avgTokens: { input: 3100, output: 850 },
    avgCost: 0.0285,
    workflows: ['Auto-Resolution Flow'],
    capabilities: ['Solution Lookup', 'Runbook Execution', 'Validation'],
    lastExecution: '2024-12-15 14:25:18',
    performanceTrend: [80, 82, 83, 84, 85, 86],
    recentExecutions: [
      { id: 'EXEC-003', timestamp: '14:25:18', duration: '12.1s', score: 45.2, status: 'failed' },
      { id: 'EXEC-009', timestamp: '13:52:08', duration: '11.5s', score: 88.5, status: 'success' },
      { id: 'EXEC-015', timestamp: '13:28:45', duration: '10.8s', score: 91.2, status: 'success' },
    ],
    errorBreakdown: [
      { type: 'Runbook Timeout', count: 182, percentage: 45 },
      { type: 'Invalid Solution', count: 98, percentage: 24 },
      { type: 'Execution Error', count: 78, percentage: 19 },
      { type: 'Other', count: 48, percentage: 12 },
    ],
  },
  {
    id: 'AGT-KNOWLEDGE-01',
    name: 'KnowledgeAgent',
    type: 'Knowledge Management',
    model: 'Claude 3.5 Sonnet',
    totalExecutions: 1680,
    successRate: 94.2,
    avgLatency: '520ms',
    avgScore: 92.1,
    avgTokens: { input: 1450, output: 620 },
    avgCost: 0.0152,
    workflows: ['Knowledge Update Flow', 'Incident Triage Flow'],
    capabilities: ['Content Extraction', 'Deduplication', 'Indexing'],
    lastExecution: '2024-12-15 14:15:30',
    performanceTrend: [88, 90, 91, 92, 93, 94],
    recentExecutions: [
      { id: 'EXEC-005', timestamp: '14:15:30', duration: '3.2s', score: 92.1, status: 'success' },
      { id: 'EXEC-011', timestamp: '13:48:12', duration: '3.5s', score: 94.5, status: 'success' },
      { id: 'EXEC-018', timestamp: '13:15:28', duration: '3.1s', score: 93.8, status: 'success' },
    ],
    errorBreakdown: [
      { type: 'Duplicate Detection Miss', count: 42, percentage: 38 },
      { type: 'Index Corruption', count: 28, percentage: 25 },
      { type: 'Validation Failure', count: 25, percentage: 23 },
      { type: 'Other', count: 15, percentage: 14 },
    ],
  },
];

interface LayerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: { label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }[];
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function LayerCard({ icon, title, description, metrics, color, isExpanded, onToggle, children }: LayerCardProps) {
  return (
    <div className={cn("glass-panel card-hover border-l-4 transition-all", color)}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/50">{icon}</div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, i) => (
            <div key={i}>
              <p className="text-xl font-mono font-semibold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
      {isExpanded && children && (
        <div className="border-t border-border p-5 bg-muted/20 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function EvaluationSection() {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('layers');

  const toggleLayer = (layer: string) => {
    setExpandedLayer(expandedLayer === layer ? null : layer);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="glow" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run Full Evaluation
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="layers">Layer Analysis</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Metrics</TabsTrigger>
          <TabsTrigger value="agents">Agent Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="mt-6 space-y-4">
          {/* Layer Cards with Expandable Details */}
          <LayerCard
            icon={<Layers className="w-5 h-5 text-chart-1" />}
            title="Model Layer"
            description="LLM performance, hallucination detection, output quality"
            metrics={[
              { label: 'Accuracy', value: '96.2%' },
              { label: 'Hallucination Rate', value: '0.8%' },
              { label: 'Latency P95', value: '850ms' },
            ]}
            color="border-l-chart-1"
            isExpanded={expandedLayer === 'model'}
            onToggle={() => toggleLayer('model')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Hallucination Detection Tests</h4>
                <div className="space-y-2">
                  {modelMetrics.hallucinationTests.map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        {test.rate >= 95 ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : test.rate >= 90 ? (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm text-foreground">{test.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-success">{test.passed} passed</span>
                        <span className="text-destructive">{test.failed} failed</span>
                        <Badge variant={test.rate >= 95 ? 'success' : test.rate >= 90 ? 'warning' : 'critical'}>
                          {test.rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Latency Distribution</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={modelMetrics.latencyDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="range" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Model Comparison</h4>
                  <div className="space-y-3">
                    {modelMetrics.tokenEfficiency.map((model, i) => (
                      <div key={i} className="p-3 rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{model.model}</span>
                          <Badge variant="success">{model.efficiency}% efficiency</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Avg: {model.avgTokens} tokens</span>
                          <span>Cost: ${model.cost}/req</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LayerCard>

          <LayerCard
            icon={<Bot className="w-5 h-5 text-chart-2" />}
            title="Agent Layer"
            description="Decision quality, task completion, context handling"
            metrics={[
              { label: 'Task Success', value: '91.5%' },
              { label: 'Avg Steps', value: '3.2' },
              { label: 'Context Accuracy', value: '94%' },
            ]}
            color="border-l-chart-2"
            isExpanded={expandedLayer === 'agent'}
            onToggle={() => toggleLayer('agent')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Decision Pipeline Performance</h4>
                <div className="space-y-2">
                  {agentMetrics.decisionTree.map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-card">
                      <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center text-sm font-mono text-chart-2">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{step.step}</span>
                          <span className="text-xs text-muted-foreground">{step.avgTime}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-chart-2 rounded-full" 
                            style={{ width: `${step.success}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-mono text-success">{step.success}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Task Completion by Type</h4>
                  <div className="space-y-2">
                    {agentMetrics.taskCompletionByType.map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-card transition-colors">
                        <span className="text-sm text-foreground">{task.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{task.avgSteps} steps</span>
                          <Badge variant={task.completion >= 95 ? 'success' : task.completion >= 85 ? 'warning' : 'muted'}>
                            {task.completion}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Context Window Performance</h4>
                  <div className="space-y-3">
                    {Object.entries(agentMetrics.contextHandling).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm capitalize text-foreground">{key.replace('Context', ' Context')}</span>
                          <span className="text-sm font-mono text-success">{value.accuracy}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{value.samples.toLocaleString()} samples</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LayerCard>

          <LayerCard
            icon={<Wrench className="w-5 h-5 text-chart-3" />}
            title="Tools Layer"
            description="API success rates, tool selection accuracy, execution time"
            metrics={[
              { label: 'API Success', value: '99.2%' },
              { label: 'Selection Accuracy', value: '93%' },
              { label: 'Avg Exec Time', value: '420ms' },
            ]}
            color="border-l-chart-3"
            isExpanded={expandedLayer === 'tools'}
            onToggle={() => toggleLayer('tools')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">API Performance</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">API</th>
                        <th className="text-right p-2 text-xs font-medium text-muted-foreground">Calls</th>
                        <th className="text-right p-2 text-xs font-medium text-muted-foreground">Success Rate</th>
                        <th className="text-right p-2 text-xs font-medium text-muted-foreground">Avg Latency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolsMetrics.apiCalls.map((api, i) => (
                        <tr key={i} className="border-b border-border hover:bg-muted/20">
                          <td className="p-2 text-sm text-foreground">{api.api}</td>
                          <td className="p-2 text-sm text-right font-mono text-foreground">{api.calls.toLocaleString()}</td>
                          <td className="p-2 text-right">
                            <Badge variant={api.success >= 99 ? 'success' : 'warning'}>{api.success}%</Badge>
                          </td>
                          <td className="p-2 text-sm text-right font-mono text-muted-foreground">{api.avgLatency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Tool Selection Accuracy</h4>
                <div className="grid grid-cols-5 gap-2">
                  {toolsMetrics.toolSelectionAccuracy.map((tool, i) => (
                    <div key={i} className="p-3 rounded-lg bg-card text-center">
                      <p className="text-xs text-muted-foreground mb-1 font-mono">{tool.tool}</p>
                      <p className="text-lg font-mono font-semibold text-foreground">{tool.accuracy}%</p>
                      <p className="text-[10px] text-muted-foreground">{tool.correct}/{tool.selected}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LayerCard>

          <LayerCard
            icon={<GitBranch className="w-5 h-5 text-chart-4" />}
            title="Workflow Layer"
            description="Multi-agent coordination, handoff quality, flow completion"
            metrics={[
              { label: 'Flow Completion', value: '88.3%' },
              { label: 'Handoff Success', value: '95%' },
              { label: 'Avg Duration', value: '4.2s' },
            ]}
            color="border-l-chart-4"
            isExpanded={expandedLayer === 'workflow'}
            onToggle={() => toggleLayer('workflow')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Workflow Performance</h4>
                <div className="space-y-2">
                  {workflowMetrics.flows.map((flow, i) => (
                    <div key={i} className="p-3 rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{flow.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="muted">{flow.agents} agents</Badge>
                          <Badge variant={flow.success >= 90 ? 'success' : flow.success >= 85 ? 'warning' : 'critical'}>
                            {flow.success}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{flow.completions.toLocaleString()} completions</span>
                        <span>Avg: {flow.avgDuration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Agent Handoff Quality</h4>
                <div className="space-y-2">
                  {workflowMetrics.handoffQuality.map((handoff, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-card">
                      <span className="text-sm font-mono text-chart-2">{handoff.from}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-chart-4 rounded-full" style={{ width: `${handoff.success}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{handoff.dataLoss}% loss</span>
                      </div>
                      <span className="text-sm font-mono text-chart-3">{handoff.to}</span>
                      <Badge variant="success">{handoff.success}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LayerCard>

          <LayerCard
            icon={<Target className="w-5 h-5 text-chart-5" />}
            title="End-to-End Layer"
            description="Overall resolution rate, user satisfaction, business KPIs"
            metrics={[
              { label: 'Resolution Rate', value: '85.1%' },
              { label: 'User Satisfaction', value: '4.6/5' },
              { label: 'MTTR', value: '12min' },
            ]}
            color="border-l-chart-5"
            isExpanded={expandedLayer === 'e2e'}
            onToggle={() => toggleLayer('e2e')}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Resolution by Category</h4>
                  <div className="space-y-2">
                    {e2eMetrics.resolutionByCategory.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-card transition-colors">
                        <span className="text-sm text-foreground">{cat.category}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">{cat.volume} tickets</span>
                          <span className="text-muted-foreground">MTTR: {cat.mttr}</span>
                          <Badge variant={cat.rate >= 85 ? 'success' : cat.rate >= 75 ? 'warning' : 'critical'}>
                            {cat.rate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Business KPIs</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {e2eMetrics.businessKPIs.map((kpi, i) => (
                      <div key={i} className="p-3 rounded-lg bg-card text-center">
                        <p className="text-xl font-mono font-semibold text-success">{kpi.value}</p>
                        <p className="text-xs text-muted-foreground">{kpi.kpi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">User Satisfaction</h4>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-mono font-bold text-foreground">{e2eMetrics.satisfaction.rating}</p>
                    <p className="text-sm text-muted-foreground">out of 5</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {e2eMetrics.satisfaction.breakdown.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">{item.stars}★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-warning rounded-full" 
                            style={{ width: `${(item.count / 1000) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LayerCard>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="mt-6 space-y-6">
          <div className="glass-panel">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Execution History</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {executionHistory.map((execution) => (
                <div key={execution.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        execution.status === 'completed' ? 'bg-success/20' : 'bg-destructive/20'
                      )}>
                        {execution.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-primary">{execution.id}</span>
                          <Badge variant={execution.status === 'completed' ? 'success' : 'critical'}>
                            {execution.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {execution.workflowName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            {execution.agentName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {execution.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-mono font-semibold text-foreground">{execution.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Execution Details */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Duration</span>
                      </div>
                      <p className="font-mono text-sm text-foreground">{execution.duration}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Tokens</span>
                      </div>
                      <p className="font-mono text-sm text-foreground">{execution.inputTokens} / {execution.outputTokens}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Cost</span>
                      </div>
                      <p className="font-mono text-sm text-foreground">${execution.cost.toFixed(4)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Tool Calls</span>
                      </div>
                      <p className="font-mono text-sm text-foreground">{execution.toolCalls.length}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Execution Steps</p>
                    <div className="flex items-center gap-2">
                      {execution.steps.map((step, i) => (
                        <div key={i} className="flex items-center">
                          <div className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium",
                            step.status === 'success' ? 'bg-success/20 text-success' :
                            step.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                            'bg-muted text-muted-foreground'
                          )}>
                            <div className="flex items-center gap-2">
                              <span>{step.name}</span>
                              <span className="font-mono opacity-70">{step.duration}</span>
                            </div>
                          </div>
                          {i < execution.steps.length - 1 && (
                            <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tool Calls */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-muted-foreground">Tools:</p>
                    {execution.toolCalls.map((tool, i) => (
                      <Badge key={i} variant={tool.success ? 'muted' : 'critical'} className="font-mono text-xs">
                        {tool.tool} ({tool.duration})
                      </Badge>
                    ))}
                  </div>

                  {/* Error Message */}
                  {execution.error && (
                    <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                        <p className="text-sm text-destructive">{execution.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Workflow Metrics Tab */}
        <TabsContent value="workflows" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {workflowExecutionMetrics.map((workflow) => (
              <div key={workflow.id} className="glass-panel">
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <GitBranch className="w-4 h-4 text-chart-4" />
                        <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                    <Badge variant={workflow.successRate >= 90 ? 'success' : workflow.successRate >= 85 ? 'warning' : 'critical'}>
                      {workflow.successRate}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{workflow.id}</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-mono font-semibold text-foreground">{workflow.totalExecutions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Executions</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-mono font-semibold text-foreground">{workflow.avgDuration}</p>
                      <p className="text-xs text-muted-foreground">Avg Duration</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <p className="text-lg font-mono font-semibold text-success">{workflow.avgScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>

                  {/* Mini trend chart */}
                  <div className="h-16 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={workflow.trend.map((v, i) => ({ idx: i, value: v }))}>
                        <defs>
                          <linearGradient id={`gradient-${workflow.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-4))" fill={`url(#gradient-${workflow.id})`} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Step Breakdown */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-muted-foreground">Step Performance</p>
                    {workflow.stepBreakdown.map((step, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{step.step}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-mono">{step.avgDuration}</span>
                          <Badge variant={step.successRate >= 95 ? 'success' : 'warning'} className="text-xs">
                            {step.successRate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agents */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Agents Involved</p>
                    <div className="flex flex-wrap gap-1">
                      {workflow.agents.map((agent, i) => (
                        <Badge key={i} variant="muted" className="text-xs">
                          <Bot className="w-3 h-3 mr-1" />
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last: {workflow.lastExecution}</span>
                    <span>Avg Cost: ${workflow.avgCost.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Agent Metrics Tab */}
        <TabsContent value="agents" className="mt-6 space-y-6">
          {agentExecutionMetrics.map((agent) => (
            <div key={agent.id} className="glass-panel">
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{agent.name}</h3>
                        <Badge variant="muted">{agent.type}</Badge>
                        <Badge variant="muted" className="font-mono">{agent.model}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{agent.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-mono font-semibold text-success">{agent.avgScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-6 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-foreground">{agent.totalExecutions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Executions</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-success">{agent.successRate}%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-foreground">{agent.avgLatency}</p>
                    <p className="text-xs text-muted-foreground">Avg Latency</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-foreground">{agent.avgTokens.input}</p>
                    <p className="text-xs text-muted-foreground">Avg Input Tokens</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-foreground">{agent.avgTokens.output}</p>
                    <p className="text-xs text-muted-foreground">Avg Output Tokens</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-center">
                    <p className="text-xl font-mono font-semibold text-foreground">${agent.avgCost.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">Avg Cost</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Recent Executions */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Recent Executions</h4>
                    <div className="space-y-2">
                      {agent.recentExecutions.map((exec, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-card">
                          <div className="flex items-center gap-2">
                            {exec.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                            <span className="text-xs font-mono text-primary">{exec.id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">{exec.timestamp}</span>
                            <Badge variant={exec.status === 'success' ? 'success' : 'critical'} className="text-xs">
                              {exec.score}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Breakdown */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Error Breakdown</h4>
                    <div className="space-y-2">
                      {agent.errorBreakdown.map((error, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-foreground">{error.type}</span>
                              <span className="text-xs text-muted-foreground">{error.count}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-destructive/60 rounded-full" 
                                style={{ width: `${error.percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{error.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities & Workflows */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Capabilities</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.capabilities.map((cap, i) => (
                        <Badge key={i} variant="muted" className="text-xs">{cap}</Badge>
                      ))}
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Used in Workflows</h4>
                    <div className="space-y-1">
                      {agent.workflows.map((wf, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GitBranch className="w-3 h-3" />
                          {wf}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quality Dimensions</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar 
                      name="Current" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Performance Timeline</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorE2E" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="e2e" name="E2E" stroke="hsl(var(--primary))" fill="url(#colorE2E)" strokeWidth={2} />
                    <Area type="monotone" dataKey="model" name="Model" stroke="hsl(var(--chart-1))" fill="transparent" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="agent" name="Agent" stroke="hsl(var(--chart-2))" fill="transparent" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="tools" name="Tools" stroke="hsl(var(--chart-3))" fill="transparent" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="workflow" name="Workflow" stroke="hsl(var(--chart-4))" fill="transparent" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass-panel">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Layer Performance Comparison</h3>
              <Button variant="outline" size="sm">Export Report</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Layer</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Current</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Previous</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Baseline</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {layerData.map((row) => (
                    <tr key={row.layer} className="border-b border-border hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">{row.layer}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-success">{row.current}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-muted-foreground">{row.previous}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-muted-foreground">{row.baseline}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="success" className="gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +{row.current - row.previous}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
