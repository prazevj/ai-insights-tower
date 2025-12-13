import { useState } from 'react';
import { Cloud, Server, Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink, Settings, Download, Link2, Cpu, HardDrive, Network, Container, Shield, Database, Key, Eye, ChevronDown, ChevronUp, Zap, Clock, BarChart3, GitBranch, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AKSCluster {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  kubernetesVersion: string;
  nodeCount: number;
  status: 'running' | 'updating' | 'error';
  agents: number;
  workflows: number;
}

interface AgentDeployment {
  id: string;
  name: string;
  namespace: string;
  replicas: { current: number; desired: number };
  status: 'healthy' | 'degraded' | 'unhealthy';
  cpu: number;
  memory: number;
  restarts: number;
  lastEvaluation: string;
  evaluationScore: number;
}

interface AzureService {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: React.ReactNode;
  description: string;
  metrics?: { label: string; value: string }[];
}

const clusters: AKSCluster[] = [
  { 
    id: '1', 
    name: 'agentops-prod-eastus', 
    resourceGroup: 'rg-agentops-prod',
    location: 'East US',
    kubernetesVersion: '1.28.3',
    nodeCount: 12,
    status: 'running',
    agents: 8,
    workflows: 15
  },
  { 
    id: '2', 
    name: 'agentops-staging-westus', 
    resourceGroup: 'rg-agentops-staging',
    location: 'West US 2',
    kubernetesVersion: '1.28.3',
    nodeCount: 4,
    status: 'running',
    agents: 4,
    workflows: 8
  },
  { 
    id: '3', 
    name: 'agentops-dev-centralus', 
    resourceGroup: 'rg-agentops-dev',
    location: 'Central US',
    kubernetesVersion: '1.27.7',
    nodeCount: 2,
    status: 'updating',
    agents: 2,
    workflows: 3
  },
];

const agentDeployments: AgentDeployment[] = [
  { id: '1', name: 'incident-classifier', namespace: 'agents', replicas: { current: 3, desired: 3 }, status: 'healthy', cpu: 45, memory: 62, restarts: 0, lastEvaluation: '10 min ago', evaluationScore: 94.2 },
  { id: '2', name: 'escalation-agent', namespace: 'agents', replicas: { current: 2, desired: 2 }, status: 'healthy', cpu: 32, memory: 48, restarts: 0, lastEvaluation: '15 min ago', evaluationScore: 89.5 },
  { id: '3', name: 'resolution-agent', namespace: 'agents', replicas: { current: 4, desired: 4 }, status: 'healthy', cpu: 58, memory: 71, restarts: 2, lastEvaluation: '5 min ago', evaluationScore: 96.8 },
  { id: '4', name: 'knowledge-agent', namespace: 'agents', replicas: { current: 2, desired: 3 }, status: 'degraded', cpu: 78, memory: 85, restarts: 5, lastEvaluation: '2 min ago', evaluationScore: 87.3 },
  { id: '5', name: 'notification-agent', namespace: 'agents', replicas: { current: 2, desired: 2 }, status: 'healthy', cpu: 15, memory: 28, restarts: 0, lastEvaluation: '20 min ago', evaluationScore: 98.1 },
];

const azureServices: AzureService[] = [
  { 
    id: '1', 
    name: 'Azure Monitor', 
    type: 'Monitoring',
    status: 'connected', 
    icon: <Activity className="w-5 h-5" />,
    description: 'Collect metrics, logs, and traces from AKS clusters',
    metrics: [
      { label: 'Metrics/min', value: '15,240' },
      { label: 'Log Events/min', value: '8,450' },
    ]
  },
  { 
    id: '2', 
    name: 'Azure Log Analytics', 
    type: 'Logging',
    status: 'connected', 
    icon: <Database className="w-5 h-5" />,
    description: 'Centralized log storage and query workspace',
    metrics: [
      { label: 'Data Ingested', value: '2.4 GB/day' },
      { label: 'Retention', value: '90 days' },
    ]
  },
  { 
    id: '3', 
    name: 'Azure Application Insights', 
    type: 'APM',
    status: 'connected', 
    icon: <Eye className="w-5 h-5" />,
    description: 'Distributed tracing and performance monitoring',
    metrics: [
      { label: 'Traces/min', value: '3,200' },
      { label: 'Avg Latency', value: '145ms' },
    ]
  },
  { 
    id: '4', 
    name: 'Azure Key Vault', 
    type: 'Security',
    status: 'connected', 
    icon: <Key className="w-5 h-5" />,
    description: 'Secure secrets and API key management',
    metrics: [
      { label: 'Secrets', value: '24' },
      { label: 'Access/day', value: '12,500' },
    ]
  },
  { 
    id: '5', 
    name: 'Azure Container Registry', 
    type: 'Registry',
    status: 'connected', 
    icon: <Container className="w-5 h-5" />,
    description: 'Private container image registry',
    metrics: [
      { label: 'Images', value: '48' },
      { label: 'Pulls/day', value: '2,100' },
    ]
  },
  { 
    id: '6', 
    name: 'Azure OpenAI', 
    type: 'AI/ML',
    status: 'connected', 
    icon: <Zap className="w-5 h-5" />,
    description: 'GPT-4 and embedding model deployments',
    metrics: [
      { label: 'Requests/min', value: '450' },
      { label: 'Tokens/day', value: '2.4M' },
    ]
  },
];

const metricsData = [
  { time: '00:00', requests: 120, latency: 145, errors: 2 },
  { time: '04:00', requests: 80, latency: 132, errors: 1 },
  { time: '08:00', requests: 450, latency: 168, errors: 5 },
  { time: '12:00', requests: 620, latency: 185, errors: 8 },
  { time: '16:00', requests: 580, latency: 172, errors: 4 },
  { time: '20:00', requests: 320, latency: 152, errors: 3 },
  { time: 'Now', requests: 280, latency: 148, errors: 2 },
];

const evaluationSync = [
  { date: 'Dec 8', synced: 1245, pending: 23 },
  { date: 'Dec 9', synced: 1380, pending: 15 },
  { date: 'Dec 10', synced: 1520, pending: 8 },
  { date: 'Dec 11', synced: 1650, pending: 12 },
  { date: 'Dec 12', synced: 1780, pending: 5 },
  { date: 'Dec 13', synced: 1920, pending: 3 },
];

export function AzureIntegration() {
  const [selectedCluster, setSelectedCluster] = useState<AKSCluster>(clusters[0]);
  const [selectedTab, setSelectedTab] = useState('clusters');
  const [expandedDeployment, setExpandedDeployment] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'healthy':
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'updating':
      case 'degraded':
        return <RefreshCw className="w-4 h-4 text-warning animate-spin" />;
      case 'error':
      case 'unhealthy':
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0078D4]/10">
              <Cloud className="w-5 h-5 text-[#0078D4]" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{clusters.length}</p>
              <p className="text-xs text-muted-foreground">AKS Clusters</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Container className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{agentDeployments.length}</p>
              <p className="text-xs text-muted-foreground">Agent Deployments</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <GitBranch className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">26</p>
              <p className="text-xs text-muted-foreground">Active Workflows</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">99.7%</p>
              <p className="text-xs text-muted-foreground">Availability</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <BarChart3 className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">4,370</p>
              <p className="text-xs text-muted-foreground">Evals Synced</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="clusters">AKS Clusters</TabsTrigger>
            <TabsTrigger value="agents">Agent Deployments</TabsTrigger>
            <TabsTrigger value="observability">Observability Pipeline</TabsTrigger>
            <TabsTrigger value="evaluation">Remote Evaluation</TabsTrigger>
            <TabsTrigger value="services">Azure Services</TabsTrigger>
          </TabsList>
          <Button variant="glow" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
        </div>

        <TabsContent value="clusters" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {clusters.map((cluster) => (
                <div 
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={cn(
                    "glass-panel p-4 cursor-pointer transition-all border-l-4",
                    selectedCluster.id === cluster.id ? "border-l-[#0078D4] bg-[#0078D4]/5" : "border-l-transparent hover:border-l-muted"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0078D4]/10">
                        <Server className="w-5 h-5 text-[#0078D4]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{cluster.name}</h4>
                        <p className="text-sm text-muted-foreground">{cluster.resourceGroup} • {cluster.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cluster.status)}
                      <Badge variant={cluster.status === 'running' ? 'success' : 'warning'}>
                        {cluster.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">K8s Version</p>
                      <p className="font-mono text-foreground">{cluster.kubernetesVersion}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nodes</p>
                      <p className="font-mono text-foreground">{cluster.nodeCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Agents</p>
                      <p className="font-mono text-foreground">{cluster.agents}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Workflows</p>
                      <p className="font-mono text-foreground">{cluster.workflows}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Connection Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Subscription</p>
                    <p className="font-mono text-foreground truncate">a1b2c3d4-e5f6-7890-abcd-ef1234567890</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">API Server</p>
                    <p className="font-mono text-xs text-foreground truncate">https://{selectedCluster.name}-dns.hcp.eastus.azmk8s.io</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Authentication</p>
                    <Badge variant="success">Azure AD</Badge>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Azure Portal
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Kubeconfig
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Collector
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          <div className="glass-panel">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Agent Deployments on AKS</h3>
                <p className="text-sm text-muted-foreground">Kubernetes deployments running AI agents</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run All Evaluations
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border">
              {agentDeployments.map((deployment) => (
                <div key={deployment.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        deployment.status === 'healthy' ? "bg-success/10" :
                        deployment.status === 'degraded' ? "bg-warning/10" : "bg-destructive/10"
                      )}>
                        <Container className={cn(
                          "w-5 h-5",
                          deployment.status === 'healthy' ? "text-success" :
                          deployment.status === 'degraded' ? "text-warning" : "text-destructive"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{deployment.name}</h4>
                          <Badge variant="muted" className="text-[10px]">{deployment.namespace}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Replicas: {deployment.replicas.current}/{deployment.replicas.desired}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-mono text-success">{deployment.evaluationScore}%</p>
                        <p className="text-xs text-muted-foreground">Last: {deployment.lastEvaluation}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setExpandedDeployment(expandedDeployment === deployment.id ? null : deployment.id)}
                      >
                        {expandedDeployment === deployment.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="text-foreground">{deployment.cpu}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", deployment.cpu > 70 ? "bg-warning" : "bg-success")}
                            style={{ width: `${deployment.cpu}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Memory</span>
                          <span className="text-foreground">{deployment.memory}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", deployment.memory > 80 ? "bg-warning" : "bg-success")}
                            style={{ width: `${deployment.memory}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Restarts</p>
                        <p className={cn("text-sm font-mono", deployment.restarts > 3 ? "text-warning" : "text-foreground")}>
                          {deployment.restarts}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={deployment.status === 'healthy' ? 'success' : deployment.status === 'degraded' ? 'warning' : 'critical'}>
                        {deployment.status}
                      </Badge>
                    </div>
                  </div>

                  {expandedDeployment === deployment.id && (
                    <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Image</p>
                          <p className="text-xs font-mono text-foreground truncate">agentops.azurecr.io/{deployment.name}:v2.4.1</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Service Account</p>
                          <p className="text-xs font-mono text-foreground">{deployment.name}-sa</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Config</p>
                          <p className="text-xs font-mono text-foreground">{deployment.name}-config</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          Run Evaluation
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="w-3 h-3 mr-1" />
                          View Traces
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observability" className="mt-6">
          <div className="space-y-6">
            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Observability Data Pipeline</h3>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[#0078D4]/10">
                    <Server className="w-6 h-6 text-[#0078D4]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">AKS Clusters</p>
                    <p className="text-sm text-muted-foreground">OpenTelemetry Collector</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-0.5 bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-16 h-0.5 bg-primary" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[#0078D4]/10">
                    <Activity className="w-6 h-6 text-[#0078D4]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Azure Monitor</p>
                    <p className="text-sm text-muted-foreground">Log Analytics Workspace</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-0.5 bg-success" />
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div className="w-16 h-0.5 bg-success" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">AgentOps Platform</p>
                    <p className="text-sm text-muted-foreground">This Dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel p-5">
                <h4 className="text-sm font-medium text-foreground mb-4">Request Volume & Latency</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metricsData}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="requests" name="Requests" stroke="hsl(var(--primary))" fill="url(#colorRequests)" strokeWidth={2} />
                      <Line type="monotone" dataKey="latency" name="Latency (ms)" stroke="hsl(var(--warning))" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-5">
                <h4 className="text-sm font-medium text-foreground mb-4">Data Ingestion Stats</h4>
                <div className="space-y-4">
                  {[
                    { type: 'Metrics', rate: '15,240/min', volume: '850 MB/day', status: 'healthy' },
                    { type: 'Traces', rate: '3,200/min', volume: '1.2 GB/day', status: 'healthy' },
                    { type: 'Logs', rate: '8,450/min', volume: '2.4 GB/day', status: 'healthy' },
                    { type: 'Evaluations', rate: '45/min', volume: '125 MB/day', status: 'healthy' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-foreground">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">{item.rate}</span>
                        <span className="font-mono text-foreground">{item.volume}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          <div className="space-y-6">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Remote Evaluation Pipeline</h3>
                  <p className="text-sm text-muted-foreground">Run evaluations on agents deployed in Azure</p>
                </div>
                <Button variant="glow" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Trigger Evaluation
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-mono font-semibold text-foreground">1,920</p>
                  <p className="text-xs text-muted-foreground">Evaluations Today</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-mono font-semibold text-success">92.4%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-mono font-semibold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Pending Sync</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-mono font-semibold text-foreground">45s</p>
                  <p className="text-xs text-muted-foreground">Avg Eval Time</p>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evaluationSync}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="synced" name="Synced" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.2} strokeWidth={2} />
                    <Area type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5">
              <h4 className="text-sm font-medium text-foreground mb-4">Evaluation Configuration</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Schedule</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                    <option>Every 15 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Every hour</option>
                    <option>Manual only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Dataset</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                    <option>Production Sample (100)</option>
                    <option>Full Dataset (1000)</option>
                    <option>Golden Set (50)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Target Cluster</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                    <option>All Clusters</option>
                    <option>Production Only</option>
                    <option>Staging Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Parallelism</label>
                  <input 
                    type="number" 
                    className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground"
                    defaultValue={5}
                    min={1}
                    max={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            {azureServices.map((service) => (
              <div 
                key={service.id}
                className={cn(
                  "glass-panel p-4 border-l-4",
                  service.status === 'connected' ? "border-l-success" : 
                  service.status === 'disconnected' ? "border-l-muted" : "border-l-destructive"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0078D4]/10 text-[#0078D4]">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{service.name}</h4>
                      <p className="text-xs text-muted-foreground">{service.type}</p>
                    </div>
                  </div>
                  <Badge variant={service.status === 'connected' ? 'success' : service.status === 'disconnected' ? 'muted' : 'critical'}>
                    {service.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                {service.metrics && (
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    {service.metrics.map((metric, i) => (
                      <div key={i}>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="text-sm font-mono text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
