import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { time: '00:00', model: 95, agent: 88, tool: 92, workflow: 85, e2e: 82 },
  { time: '04:00', model: 93, agent: 90, tool: 89, workflow: 87, e2e: 84 },
  { time: '08:00', model: 97, agent: 92, tool: 94, workflow: 89, e2e: 88 },
  { time: '12:00', model: 94, agent: 85, tool: 91, workflow: 83, e2e: 80 },
  { time: '16:00', model: 96, agent: 91, tool: 93, workflow: 88, e2e: 86 },
  { time: '20:00', model: 98, agent: 94, tool: 95, workflow: 91, e2e: 89 },
  { time: '24:00', model: 97, agent: 93, tool: 94, workflow: 90, e2e: 87 },
];

const layerMetrics = [
  { layer: 'Model', score: 96, baseline: 90 },
  { layer: 'Agent', score: 91, baseline: 85 },
  { layer: 'Tools', score: 93, baseline: 88 },
  { layer: 'Workflow', score: 88, baseline: 82 },
  { layer: 'E2E', score: 85, baseline: 78 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-border">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-mono text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EvaluationChart() {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance by Layer</h3>
          <p className="text-sm text-muted-foreground">Real-time evaluation metrics</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: 'Model', color: 'bg-chart-1' },
            { label: 'Agent', color: 'bg-chart-2' },
            { label: 'Tools', color: 'bg-chart-3' },
            { label: 'Workflow', color: 'bg-chart-4' },
            { label: 'E2E', color: 'bg-chart-5' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorModel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              domain={[70, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="model" 
              stroke="hsl(var(--chart-1))" 
              fill="url(#colorModel)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="agent" 
              stroke="hsl(var(--chart-2))" 
              fill="url(#colorAgent)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="tool" 
              stroke="hsl(var(--chart-3))" 
              fill="transparent"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="workflow" 
              stroke="hsl(var(--chart-4))" 
              fill="transparent"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="e2e" 
              stroke="hsl(var(--chart-5))" 
              fill="transparent"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LayerMetricsChart() {
  return (
    <div className="glass-panel p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Layer Comparison</h3>
        <p className="text-sm text-muted-foreground">Current vs Baseline Performance</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={layerMetrics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              type="category" 
              dataKey="layer" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="baseline" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
