import { useState } from 'react';
import { Play, History, GitBranch, Zap, Clock, Target, MessageSquare, ChevronRight, Plus, Copy, Trash2, ArrowUpDown, TrendingUp, TrendingDown, Eye, Edit3, Save, X, BarChart3, Beaker, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface PromptVersion {
  id: string;
  version: string;
  agent: string;
  status: 'active' | 'testing' | 'archived';
  accuracy: number;
  tokenUsage: number;
  responseTime: string;
  lastModified: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  evaluations: number;
  cost: number;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  latency: string;
  tokens: number;
}

interface ComparisonResult {
  metric: string;
  version1: number;
  version2: number;
  diff: number;
}

const promptVersions: PromptVersion[] = [
  { 
    id: '1', 
    version: 'v2.4.1', 
    agent: 'IncidentClassifier', 
    status: 'active', 
    accuracy: 94.2, 
    tokenUsage: 1250, 
    responseTime: '1.2s', 
    lastModified: '2 hours ago',
    systemPrompt: 'You are an IT incident classification agent. Analyze incoming tickets and categorize them based on severity (P1-P4), type (Network, Authentication, Performance, Integration, Data), and affected services. Provide structured JSON output.',
    temperature: 0.3,
    maxTokens: 2000,
    evaluations: 1250,
    cost: 15.62
  },
  { 
    id: '2', 
    version: 'v2.4.0', 
    agent: 'IncidentClassifier', 
    status: 'archived', 
    accuracy: 91.8, 
    tokenUsage: 1420, 
    responseTime: '1.5s', 
    lastModified: '1 day ago',
    systemPrompt: 'You are an IT incident classification agent. Analyze tickets and categorize them by severity and type.',
    temperature: 0.5,
    maxTokens: 2000,
    evaluations: 980,
    cost: 13.85
  },
  { 
    id: '3', 
    version: 'v1.8.3', 
    agent: 'EscalationAgent', 
    status: 'active', 
    accuracy: 89.5, 
    tokenUsage: 980, 
    responseTime: '0.9s', 
    lastModified: '3 hours ago',
    systemPrompt: 'You are an escalation decision agent. Based on incident severity, SLA timers, and resource availability, determine if an incident should be escalated to the next tier.',
    temperature: 0.2,
    maxTokens: 1500,
    evaluations: 650,
    cost: 6.37
  },
  { 
    id: '4', 
    version: 'v1.9.0-beta', 
    agent: 'EscalationAgent', 
    status: 'testing', 
    accuracy: 92.1, 
    tokenUsage: 1100, 
    responseTime: '1.0s', 
    lastModified: '30 min ago',
    systemPrompt: 'You are an advanced escalation decision agent with improved context awareness. Analyze incident patterns, historical data, and team availability to make intelligent escalation decisions.',
    temperature: 0.25,
    maxTokens: 1800,
    evaluations: 180,
    cost: 1.98
  },
  { 
    id: '5', 
    version: 'v3.1.0', 
    agent: 'ResolutionAgent', 
    status: 'active', 
    accuracy: 96.8, 
    tokenUsage: 2100, 
    responseTime: '2.1s', 
    lastModified: '5 hours ago',
    systemPrompt: 'You are an incident resolution agent. Analyze the incident context, retrieve relevant knowledge articles, and provide step-by-step resolution guidance.',
    temperature: 0.4,
    maxTokens: 3000,
    evaluations: 420,
    cost: 8.82
  },
  { 
    id: '6', 
    version: 'v1.2.0', 
    agent: 'KnowledgeAgent', 
    status: 'active', 
    accuracy: 93.4, 
    tokenUsage: 1650, 
    responseTime: '1.8s', 
    lastModified: '1 day ago',
    systemPrompt: 'You are a knowledge retrieval agent. Search the knowledge base for relevant articles, runbooks, and past resolutions based on the incident description.',
    temperature: 0.3,
    maxTokens: 2500,
    evaluations: 890,
    cost: 14.69
  },
];

const testCases: TestCase[] = [
  { id: '1', input: 'User cannot login to VPN', expectedOutput: 'P3, Authentication, VPN Service', actualOutput: 'P3, Authentication, VPN Service', passed: true, latency: '1.1s', tokens: 1180 },
  { id: '2', input: 'Production database is down', expectedOutput: 'P1, Data Issues, Database', actualOutput: 'P1, Data Issues, Database', passed: true, latency: '0.9s', tokens: 1050 },
  { id: '3', input: 'Slow page load times', expectedOutput: 'P3, Performance, Web Server', actualOutput: 'P2, Performance, Web Server', passed: false, latency: '1.3s', tokens: 1320 },
  { id: '4', input: 'Email service intermittent', expectedOutput: 'P2, Integration, Email', actualOutput: 'P2, Integration, Email', passed: true, latency: '1.0s', tokens: 1150 },
  { id: '5', input: 'Network latency spike', expectedOutput: 'P2, Network, Core Router', actualOutput: 'P2, Network, Core Router', passed: true, latency: '1.2s', tokens: 1280 },
];

const performanceTrend = [
  { date: 'Dec 8', accuracy: 89.2, latency: 1450, tokens: 1380 },
  { date: 'Dec 9', accuracy: 90.5, latency: 1380, tokens: 1350 },
  { date: 'Dec 10', accuracy: 91.8, latency: 1320, tokens: 1320 },
  { date: 'Dec 11', accuracy: 92.4, latency: 1280, tokens: 1290 },
  { date: 'Dec 12', accuracy: 93.1, latency: 1250, tokens: 1260 },
  { date: 'Dec 13', accuracy: 94.2, latency: 1200, tokens: 1250 },
];

const multiAgentResults = [
  { workflow: 'Incident Triage', accuracy: 92.4, agents: ['Classifier', 'Escalation'], avgTime: '3.2s' },
  { workflow: 'Auto-Resolution', accuracy: 85.2, agents: ['Classifier', 'Knowledge', 'Resolution'], avgTime: '8.5s' },
  { workflow: 'P1 Handling', accuracy: 88.1, agents: ['Classifier', 'Escalation', 'Resolution', 'Notification'], avgTime: '12.4s' },
];

const aggregatedMetrics = {
  activePrompts: 12,
  avgAccuracy: 93.4,
  totalTokens: '2.4M',
  avgResponseTime: '1.4s',
  totalEvaluations: 4370,
  totalCost: 61.33
};

export function PromptStudio() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptVersion | null>(promptVersions[0]);
  const [selectedTab, setSelectedTab] = useState('versions');
  const [isEditing, setIsEditing] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePrompts, setComparePrompts] = useState<string[]>([]);

  const handleCompareToggle = (promptId: string) => {
    if (comparePrompts.includes(promptId)) {
      setComparePrompts(comparePrompts.filter(id => id !== promptId));
    } else if (comparePrompts.length < 2) {
      setComparePrompts([...comparePrompts, promptId]);
    }
  };

  const getComparisonData = (): ComparisonResult[] => {
    if (comparePrompts.length !== 2) return [];
    const p1 = promptVersions.find(p => p.id === comparePrompts[0]);
    const p2 = promptVersions.find(p => p.id === comparePrompts[1]);
    if (!p1 || !p2) return [];
    
    return [
      { metric: 'Accuracy', version1: p1.accuracy, version2: p2.accuracy, diff: p1.accuracy - p2.accuracy },
      { metric: 'Token Usage', version1: p1.tokenUsage, version2: p2.tokenUsage, diff: p2.tokenUsage - p1.tokenUsage },
      { metric: 'Evaluations', version1: p1.evaluations, version2: p2.evaluations, diff: p1.evaluations - p2.evaluations },
      { metric: 'Cost ($)', version1: p1.cost, version2: p2.cost, diff: p2.cost - p1.cost },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Aggregated Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.activePrompts}</p>
              <p className="text-xs text-muted-foreground">Active Prompts</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.avgAccuracy}%</p>
              <p className="text-xs text-muted-foreground">Avg Accuracy</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.totalTokens}</p>
              <p className="text-xs text-muted-foreground">Token Usage (24h)</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.avgResponseTime}</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Beaker className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.totalEvaluations.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Evaluations</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <BarChart3 className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">${aggregatedMetrics.totalCost}</p>
              <p className="text-xs text-muted-foreground">Total Cost (24h)</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="versions">Prompt Versions</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="multiagent">Multi-Agent Eval</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button 
              variant={compareMode ? "glow" : "outline"} 
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setComparePrompts([]);
              }}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Compare {compareMode && comparePrompts.length > 0 && `(${comparePrompts.length}/2)`}
            </Button>
            <Button variant="glow" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </div>

        <TabsContent value="versions" className="mt-6">
          <div className="grid grid-cols-5 gap-6">
            {/* Prompt List */}
            <div className="col-span-2 glass-panel">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Prompt Versions</h3>
                  <p className="text-sm text-muted-foreground">Manage and track prompt iterations</p>
                </div>
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>

              <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-thin">
                {promptVersions.map((prompt) => (
                  <div 
                    key={prompt.id}
                    onClick={() => !compareMode && setSelectedPrompt(prompt)}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:bg-muted/30",
                      selectedPrompt?.id === prompt.id && !compareMode && "bg-muted/50",
                      compareMode && comparePrompts.includes(prompt.id) && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {compareMode && (
                          <input 
                            type="checkbox" 
                            checked={comparePrompts.includes(prompt.id)}
                            onChange={() => handleCompareToggle(prompt.id)}
                            className="w-4 h-4 rounded border-border"
                          />
                        )}
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-foreground">{prompt.version}</span>
                        <Badge 
                          variant={
                            prompt.status === 'active' ? 'success' : 
                            prompt.status === 'testing' ? 'warning' : 'muted'
                          }
                        >
                          {prompt.status}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{prompt.agent}</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Accuracy: </span>
                        <span className="font-mono text-success">{prompt.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tokens: </span>
                        <span className="font-mono text-foreground">{prompt.tokenUsage}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Speed: </span>
                        <span className="font-mono text-foreground">{prompt.responseTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Evals: </span>
                        <span className="font-mono text-foreground">{prompt.evaluations}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Details / Comparison */}
            <div className="col-span-3 glass-panel">
              {compareMode && comparePrompts.length === 2 ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Version Comparison</h3>
                    <Button variant="ghost" size="sm" onClick={() => setComparePrompts([])}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="text-sm font-medium text-muted-foreground">Metric</div>
                      <div className="text-sm font-medium text-foreground text-center">
                        {promptVersions.find(p => p.id === comparePrompts[0])?.version}
                      </div>
                      <div className="text-sm font-medium text-foreground text-center">
                        {promptVersions.find(p => p.id === comparePrompts[1])?.version}
                      </div>
                    </div>
                    {getComparisonData().map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 p-3 rounded-lg hover:bg-muted/20">
                        <div className="text-sm text-foreground">{row.metric}</div>
                        <div className="text-sm font-mono text-center text-foreground">{row.version1}</div>
                        <div className="text-sm font-mono text-center flex items-center justify-center gap-2">
                          <span className="text-foreground">{row.version2}</span>
                          <Badge variant={row.diff > 0 ? 'success' : row.diff < 0 ? 'critical' : 'muted'} className="text-[10px]">
                            {row.diff > 0 ? '+' : ''}{row.diff.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">System Prompt Diff</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs font-mono text-muted-foreground mb-2">{promptVersions.find(p => p.id === comparePrompts[0])?.version}</p>
                        <p className="text-xs text-foreground">{promptVersions.find(p => p.id === comparePrompts[0])?.systemPrompt}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs font-mono text-muted-foreground mb-2">{promptVersions.find(p => p.id === comparePrompts[1])?.version}</p>
                        <p className="text-xs text-foreground">{promptVersions.find(p => p.id === comparePrompts[1])?.systemPrompt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedPrompt ? (
                <div>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{selectedPrompt.agent}</h3>
                        <Badge variant="muted" className="font-mono">{selectedPrompt.version}</Badge>
                        <Badge 
                          variant={
                            selectedPrompt.status === 'active' ? 'success' : 
                            selectedPrompt.status === 'testing' ? 'warning' : 'muted'
                          }
                        >
                          {selectedPrompt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Last modified: {selectedPrompt.lastModified}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">System Prompt</label>
                      <textarea 
                        className="w-full h-32 p-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        readOnly={!isEditing}
                        defaultValue={selectedPrompt.systemPrompt}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Temperature</label>
                        <input 
                          type="number" 
                          className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          readOnly={!isEditing}
                          defaultValue={selectedPrompt.temperature}
                          step={0.1}
                          min={0}
                          max={1}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Max Tokens</label>
                        <input 
                          type="number" 
                          className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          readOnly={!isEditing}
                          defaultValue={selectedPrompt.maxTokens}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Model</label>
                        <select 
                          className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          disabled={!isEditing}
                        >
                          <option>GPT-4o</option>
                          <option>Claude 3.5 Sonnet</option>
                          <option>Gemini Pro</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-success">{selectedPrompt.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-foreground">{selectedPrompt.tokenUsage}</p>
                        <p className="text-xs text-muted-foreground">Avg Tokens</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-foreground">{selectedPrompt.responseTime}</p>
                        <p className="text-xs text-muted-foreground">Avg Latency</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-foreground">${selectedPrompt.cost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Total Cost</p>
                      </div>
                    </div>

                    {selectedPrompt.status === 'active' && (
                      <Button variant="outline" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Run Regression Test
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a prompt version to view details</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="playground" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Playground Editor */}
            <div className="glass-panel">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Prompt Playground</h3>
                  <p className="text-sm text-muted-foreground">Test prompts against datasets</p>
                </div>
                <Button variant="glow" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run Evaluation
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">System Prompt</label>
                  <textarea 
                    className="w-full h-32 p-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Enter your system prompt here..."
                    defaultValue="You are an IT incident classification agent. Analyze incoming tickets and categorize them based on severity, type, and affected services..."
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Test Dataset</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>ServiceNow Incidents (1000 samples)</option>
                    <option>Historical P1 Incidents (500 samples)</option>
                    <option>Network Issues Dataset (750 samples)</option>
                    <option>Custom Dataset...</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Model</label>
                    <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>GPT-4o</option>
                      <option>Claude 3.5 Sonnet</option>
                      <option>Gemini Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Evaluation Type</label>
                    <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Multi-Agent Workflow</option>
                      <option>Single Agent</option>
                      <option>A/B Comparison</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Last Evaluation Results</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-lg font-mono font-semibold text-success">94.2%</p>
                      <p className="text-[10px] text-muted-foreground">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-lg font-mono font-semibold text-foreground">1.2s</p>
                      <p className="text-[10px] text-muted-foreground">Latency</p>
                    </div>
                    <div>
                      <p className="text-lg font-mono font-semibold text-foreground">1,250</p>
                      <p className="text-[10px] text-muted-foreground">Tokens/req</p>
                    </div>
                    <div>
                      <p className="text-lg font-mono font-semibold text-foreground">$0.02</p>
                      <p className="text-[10px] text-muted-foreground">Cost/req</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="glass-panel">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Test Cases</h3>
                  <p className="text-sm text-muted-foreground">{testCases.filter(t => t.passed).length}/{testCases.length} passed</p>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test
                </Button>
              </div>

              <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
                {testCases.map((test) => (
                  <div key={test.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={test.passed ? 'success' : 'critical'}>
                          {test.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{test.latency} | {test.tokens} tokens</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">INPUT</p>
                        <p className="text-sm text-foreground">{test.input}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground">EXPECTED</p>
                          <p className="text-xs font-mono text-foreground">{test.expectedOutput}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">ACTUAL</p>
                          <p className={cn("text-xs font-mono", test.passed ? "text-success" : "text-destructive")}>
                            {test.actualOutput}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="multiagent" className="mt-6">
          <div className="space-y-6">
            <div className="glass-panel">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Multi-Agent Workflow Evaluation</h3>
                  <p className="text-sm text-muted-foreground">End-to-end testing for agent orchestration</p>
                </div>
                <Button variant="glow" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run Workflow Test
                </Button>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {multiAgentResults.map((workflow, i) => (
                    <div key={i} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{workflow.workflow}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {workflow.agents.map((agent, j) => (
                              <Badge key={j} variant="outline" className="text-[10px]">{agent}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono font-semibold text-success">{workflow.accuracy}%</p>
                          <p className="text-xs text-muted-foreground">Avg: {workflow.avgTime}</p>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-full" 
                          style={{ width: `${workflow.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Workflow Configuration</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Workflow</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                    <option>Incident Triage Flow</option>
                    <option>P1 Escalation Flow</option>
                    <option>Auto-Resolution Flow</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Dataset</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                    <option>Production Incidents (500)</option>
                    <option>Historical P1s (200)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Parallel Runs</label>
                  <input 
                    type="number" 
                    className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground"
                    defaultValue={5}
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Timeout (s)</label>
                  <input 
                    type="number" 
                    className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground"
                    defaultValue={30}
                    min={5}
                    max={120}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Accuracy Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis domain={[85, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Token Usage & Latency</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="tokens" name="Tokens" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="latency" name="Latency (ms)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
