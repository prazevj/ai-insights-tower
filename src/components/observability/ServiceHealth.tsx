import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Zap,
  Server,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const latencyData = [
  { time: '14:00', p50: 120, p95: 450, p99: 890 },
  { time: '14:05', p50: 135, p95: 480, p99: 920 },
  { time: '14:10', p50: 115, p95: 420, p99: 850 },
  { time: '14:15', p50: 142, p95: 510, p99: 980 },
  { time: '14:20', p50: 128, p95: 465, p99: 900 },
  { time: '14:25', p50: 118, p95: 430, p99: 860 },
  { time: '14:30', p50: 125, p95: 455, p99: 880 },
];

const errorRateData = [
  { time: '14:00', rate: 0.5 },
  { time: '14:05', rate: 0.8 },
  { time: '14:10', rate: 0.3 },
  { time: '14:15', rate: 2.1 },
  { time: '14:20', rate: 1.5 },
  { time: '14:25', rate: 0.6 },
  { time: '14:30', rate: 0.4 },
];

const throughputData = [
  { time: '14:00', requests: 1250 },
  { time: '14:05', requests: 1420 },
  { time: '14:10', requests: 1380 },
  { time: '14:15', requests: 1650 },
  { time: '14:20', requests: 1520 },
  { time: '14:25', requests: 1480 },
  { time: '14:30', requests: 1390 },
];

interface MetricProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  status?: 'success' | 'warning' | 'critical';
}

function QuickMetric({ title, value, subtitle, icon, trend, status }: MetricProps) {
  const statusColors = {
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    critical: 'border-destructive/30 bg-destructive/5',
  };

  return (
    <div className={cn(
      "glass-panel p-4 card-hover",
      status && statusColors[status]
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-muted/50">{icon}</div>
        {trend && (
          <Badge variant={trend.direction === 'up' ? 'success' : 'critical'} className="text-[10px]">
            <TrendingUp className={cn("w-3 h-3 mr-1", trend.direction === 'down' && "rotate-180")} />
            {trend.value}%
          </Badge>
        )}
      </div>
      <p className="text-2xl font-mono font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function ServiceHealth() {
  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <QuickMetric
          title="Requests"
          value="1,390/min"
          subtitle="Current throughput"
          icon={<Activity className="w-5 h-5 text-primary" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <QuickMetric
          title="Latency P95"
          value="455ms"
          subtitle="Response time"
          icon={<Clock className="w-5 h-5 text-secondary" />}
          trend={{ value: 3, direction: 'down' }}
          status="success"
        />
        <QuickMetric
          title="Error Rate"
          value="0.4%"
          subtitle="Last 5 minutes"
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          status="success"
        />
        <QuickMetric
          title="Success Rate"
          value="99.6%"
          subtitle="Requests successful"
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          status="success"
        />
        <QuickMetric
          title="Active Spans"
          value="847"
          subtitle="Currently processing"
          icon={<Zap className="w-5 h-5 text-chart-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Latency Distribution */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Latency Distribution</h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                <span className="text-muted-foreground">P50</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-chart-4" />
                <span className="text-muted-foreground">P95</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-chart-5" />
                <span className="text-muted-foreground">P99</span>
              </div>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="p50" stroke="hsl(var(--chart-3))" fill="url(#colorP50)" strokeWidth={2} />
                <Area type="monotone" dataKey="p95" stroke="hsl(var(--chart-4))" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="p99" stroke="hsl(var(--chart-5))" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Rate */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Error Rate</h3>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Error Rate']}
                />
                <Bar 
                  dataKey="rate" 
                  fill="hsl(var(--destructive))" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throughput */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Throughput</h3>
            <span className="text-xs text-muted-foreground">req/min</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="url(#colorThroughput)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Dependencies */}
      <div className="glass-panel p-4">
        <h3 className="font-medium text-foreground mb-4">Service Dependencies</h3>
        <div className="flex items-center justify-center gap-8 py-8">
          {/* Service Map Visualization */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-2">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Gateway</p>
              <p className="text-xs text-muted-foreground">12ms avg</p>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-primary to-secondary" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm font-medium text-foreground">Agents</p>
              <p className="text-xs text-muted-foreground">85ms avg</p>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-secondary to-purple-500" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-foreground">LLM</p>
              <p className="text-xs text-muted-foreground">650ms avg</p>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-purple-500 to-chart-3" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-chart-3/20 border-2 border-chart-3 flex items-center justify-center mx-auto mb-2">
                <Database className="w-6 h-6 text-chart-3" />
              </div>
              <p className="text-sm font-medium text-foreground">Tools/APIs</p>
              <p className="text-xs text-muted-foreground">280ms avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
