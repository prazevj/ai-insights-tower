import { BarChart3, Layers, Bot, Wrench, GitBranch, Target, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

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

interface LayerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: { label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }[];
  color: string;
}

function LayerCard({ icon, title, description, metrics, color }: LayerCardProps) {
  return (
    <div className={cn("glass-panel p-5 card-hover border-l-4", color)}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-muted/50">{icon}</div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
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
  );
}

export function EvaluationSection() {
  return (
    <div className="space-y-6">
      {/* Layer Cards */}
      <div className="grid grid-cols-1 gap-4">
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
        />
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
        />
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
        />
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
        />
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
        />
      </div>

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
                <Area type="monotone" dataKey="e2e" stroke="hsl(var(--primary))" fill="url(#colorE2E)" strokeWidth={2} />
                <Area type="monotone" dataKey="model" stroke="hsl(var(--chart-1))" fill="transparent" strokeWidth={1.5} />
                <Area type="monotone" dataKey="agent" stroke="hsl(var(--chart-2))" fill="transparent" strokeWidth={1.5} />
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
    </div>
  );
}
