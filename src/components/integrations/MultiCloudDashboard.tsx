import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Server, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Globe,
  BarChart3,
  Layers,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const cloudProviders = [
  { 
    id: 'azure', 
    name: 'Microsoft Azure', 
    icon: '🔷', 
    color: 'hsl(207, 89%, 48%)',
    clusters: 4,
    agents: 156,
    status: 'healthy',
    spend: '$12,450',
    trend: '+5.2%'
  },
  { 
    id: 'aws', 
    name: 'Amazon Web Services', 
    icon: '🟠', 
    color: 'hsl(33, 100%, 50%)',
    clusters: 6,
    agents: 234,
    status: 'healthy',
    spend: '$18,320',
    trend: '+3.8%'
  },
  { 
    id: 'gcp', 
    name: 'Google Cloud Platform', 
    icon: '🔴', 
    color: 'hsl(4, 80%, 50%)',
    clusters: 3,
    agents: 89,
    status: 'warning',
    spend: '$7,890',
    trend: '-2.1%'
  }
];

const allClusters = [
  { id: 'aks-prod-east', provider: 'azure', name: 'AKS Prod East', region: 'East US', nodes: 12, agents: 45, cpu: 72, memory: 68, status: 'healthy', evalScore: 94.2 },
  { id: 'aks-prod-west', provider: 'azure', name: 'AKS Prod West', region: 'West US', nodes: 8, agents: 38, cpu: 65, memory: 71, status: 'healthy', evalScore: 92.8 },
  { id: 'aks-dev', provider: 'azure', name: 'AKS Development', region: 'Central US', nodes: 4, agents: 42, cpu: 45, memory: 52, status: 'healthy', evalScore: 88.5 },
  { id: 'aks-staging', provider: 'azure', name: 'AKS Staging', region: 'North Europe', nodes: 6, agents: 31, cpu: 58, memory: 61, status: 'healthy', evalScore: 91.3 },
  { id: 'eks-prod-east', provider: 'aws', name: 'EKS Prod East', region: 'us-east-1', nodes: 15, agents: 67, cpu: 78, memory: 74, status: 'healthy', evalScore: 95.1 },
  { id: 'eks-prod-west', provider: 'aws', name: 'EKS Prod West', region: 'us-west-2', nodes: 12, agents: 52, cpu: 69, memory: 66, status: 'healthy', evalScore: 93.7 },
  { id: 'eks-eu', provider: 'aws', name: 'EKS Europe', region: 'eu-west-1', nodes: 10, agents: 48, cpu: 71, memory: 69, status: 'healthy', evalScore: 92.4 },
  { id: 'eks-staging', provider: 'aws', name: 'EKS Staging', region: 'us-east-2', nodes: 6, agents: 34, cpu: 52, memory: 48, status: 'healthy', evalScore: 89.2 },
  { id: 'eks-dev', provider: 'aws', name: 'EKS Development', region: 'us-west-1', nodes: 4, agents: 18, cpu: 38, memory: 42, status: 'healthy', evalScore: 86.8 },
  { id: 'eks-apac', provider: 'aws', name: 'EKS Asia Pacific', region: 'ap-southeast-1', nodes: 8, agents: 15, cpu: 61, memory: 58, status: 'healthy', evalScore: 91.0 },
  { id: 'gke-prod', provider: 'gcp', name: 'GKE Production', region: 'us-central1', nodes: 10, agents: 42, cpu: 82, memory: 79, status: 'warning', evalScore: 90.5 },
  { id: 'gke-eu', provider: 'gcp', name: 'GKE Europe', region: 'europe-west1', nodes: 6, agents: 28, cpu: 68, memory: 65, status: 'healthy', evalScore: 93.2 },
  { id: 'gke-dev', provider: 'gcp', name: 'GKE Development', region: 'us-east1', nodes: 3, agents: 19, cpu: 41, memory: 38, status: 'healthy', evalScore: 87.9 },
];

const crossCloudMetrics = [
  { time: '00:00', azure: 92, aws: 94, gcp: 89 },
  { time: '04:00', azure: 93, aws: 93, gcp: 91 },
  { time: '08:00', azure: 95, aws: 96, gcp: 88 },
  { time: '12:00', azure: 94, aws: 95, gcp: 92 },
  { time: '16:00', azure: 96, aws: 97, gcp: 90 },
  { time: '20:00', azure: 95, aws: 96, gcp: 93 },
  { time: '24:00', azure: 94, aws: 95, gcp: 91 },
];

const comparisonMetrics = [
  { metric: 'Latency', azure: 85, aws: 88, gcp: 82, fullMark: 100 },
  { metric: 'Accuracy', azure: 94, aws: 96, gcp: 91, fullMark: 100 },
  { metric: 'Uptime', azure: 99, aws: 99, gcp: 97, fullMark: 100 },
  { metric: 'Cost Efficiency', azure: 78, aws: 72, gcp: 85, fullMark: 100 },
  { metric: 'Agent Perf', azure: 92, aws: 94, gcp: 89, fullMark: 100 },
  { metric: 'Eval Score', azure: 93, aws: 95, gcp: 90, fullMark: 100 },
];

const costBreakdown = [
  { name: 'Compute', azure: 5200, aws: 7800, gcp: 3200 },
  { name: 'Storage', azure: 1800, aws: 2400, gcp: 1100 },
  { name: 'Network', azure: 2100, aws: 3200, gcp: 1400 },
  { name: 'AI/ML', azure: 2850, aws: 4120, gcp: 1890 },
  { name: 'Other', azure: 500, aws: 800, gcp: 300 },
];

const agentDistribution = [
  { name: 'Azure', value: 156, color: 'hsl(207, 89%, 48%)' },
  { name: 'AWS', value: 234, color: 'hsl(33, 100%, 50%)' },
  { name: 'GCP', value: 89, color: 'hsl(4, 80%, 50%)' },
];

export function MultiCloudDashboard() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  const filteredClusters = selectedProvider 
    ? allClusters.filter(c => c.provider === selectedProvider)
    : allClusters;

  const totalAgents = cloudProviders.reduce((acc, p) => acc + p.agents, 0);
  const totalClusters = cloudProviders.reduce((acc, p) => acc + p.clusters, 0);
  const healthyClusters = allClusters.filter(c => c.status === 'healthy').length;
  const avgEvalScore = (allClusters.reduce((acc, c) => acc + c.evalScore, 0) / allClusters.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Cloud Provider Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cloudProviders.map((provider) => (
          <Card 
            key={provider.id} 
            className={`glass-panel cursor-pointer transition-all ${selectedProvider === provider.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">{provider.clusters} clusters</p>
                  </div>
                </div>
                <Badge variant={provider.status === 'healthy' ? 'success' : 'warning'}>
                  {provider.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                  <p className="text-xl font-mono font-semibold">{provider.agents}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xl font-mono font-semibold">{provider.spend}</p>
                    <span className={`text-xs ${provider.trend.startsWith('+') ? 'text-warning' : 'text-success'}`}>
                      {provider.trend}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Clusters</span>
            </div>
            <p className="text-2xl font-mono font-semibold">{totalClusters}</p>
            <p className="text-xs text-success">{healthyClusters} healthy</p>
          </CardContent>
        </Card>
        
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Total Agents</span>
            </div>
            <p className="text-2xl font-mono font-semibold">{totalAgents}</p>
            <p className="text-xs text-muted-foreground">across all clouds</p>
          </CardContent>
        </Card>
        
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Avg Eval Score</span>
            </div>
            <p className="text-2xl font-mono font-semibold">{avgEvalScore}%</p>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.1% vs last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Total Spend</span>
            </div>
            <p className="text-2xl font-mono font-semibold">$38.6K</p>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Cross-Cloud Agent Performance (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={crossCloudMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="azure" name="Azure" stroke="hsl(207, 89%, 48%)" fill="hsl(207, 89%, 48%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="aws" name="AWS" stroke="hsl(33, 100%, 50%)" fill="hsl(33, 100%, 50%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="gcp" name="GCP" stroke="hsl(4, 80%, 50%)" fill="hsl(4, 80%, 50%)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" />
                Multi-Dimensional Cloud Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonMetrics}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Radar name="Azure" dataKey="azure" stroke="hsl(207, 89%, 48%)" fill="hsl(207, 89%, 48%)" fillOpacity={0.3} />
                    <Radar name="AWS" dataKey="aws" stroke="hsl(33, 100%, 50%)" fill="hsl(33, 100%, 50%)" fillOpacity={0.3} />
                    <Radar name="GCP" dataKey="gcp" stroke="hsl(4, 80%, 50%)" fill="hsl(4, 80%, 50%)" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-warning" />
                Cost Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Bar dataKey="azure" name="Azure" fill="hsl(207, 89%, 48%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="aws" name="AWS" fill="hsl(33, 100%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gcp" name="GCP" fill="hsl(4, 80%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Agent Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {agentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Regional Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { region: 'North America', clusters: 8, percentage: 62 },
                    { region: 'Europe', clusters: 3, percentage: 23 },
                    { region: 'Asia Pacific', clusters: 2, percentage: 15 },
                  ].map((region) => (
                    <div key={region.region} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{region.region}</span>
                        <span className="text-muted-foreground">{region.clusters} clusters</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* All Clusters Table */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              All Clusters {selectedProvider && `(${selectedProvider.toUpperCase()})`}
            </span>
            <Badge variant="outline">{filteredClusters.length} clusters</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Cluster</th>
                  <th className="text-left py-3 px-2 font-medium">Provider</th>
                  <th className="text-left py-3 px-2 font-medium">Region</th>
                  <th className="text-center py-3 px-2 font-medium">Nodes</th>
                  <th className="text-center py-3 px-2 font-medium">Agents</th>
                  <th className="text-center py-3 px-2 font-medium">CPU</th>
                  <th className="text-center py-3 px-2 font-medium">Memory</th>
                  <th className="text-center py-3 px-2 font-medium">Eval Score</th>
                  <th className="text-center py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClusters.map((cluster) => (
                  <tr key={cluster.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-2 font-medium">{cluster.name}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="text-xs">
                        {cluster.provider.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{cluster.region}</td>
                    <td className="py-3 px-2 text-center font-mono">{cluster.nodes}</td>
                    <td className="py-3 px-2 text-center font-mono">{cluster.agents}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={cluster.cpu} className="w-16 h-1.5" />
                        <span className="text-xs font-mono w-8">{cluster.cpu}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={cluster.memory} className="w-16 h-1.5" />
                        <span className="text-xs font-mono w-8">{cluster.memory}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-mono font-medium ${cluster.evalScore >= 90 ? 'text-success' : cluster.evalScore >= 80 ? 'text-warning' : 'text-destructive'}`}>
                        {cluster.evalScore}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {cluster.status === 'healthy' ? (
                        <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
