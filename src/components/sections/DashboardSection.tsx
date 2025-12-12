import { Activity, Bot, Brain, Zap, Clock, Target, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { EvaluationChart, LayerMetricsChart } from '@/components/dashboard/EvaluationChart';
import { InsightsTower } from '@/components/dashboard/InsightsTower';

const agents = [
  { name: 'IncidentClassifier', type: 'Classification Agent', status: 'healthy' as const, accuracy: 94.2, responseTime: '1.2s', lastActive: '2 min ago', tasksCompleted: 1250 },
  { name: 'EscalationAgent', type: 'Escalation & Routing', status: 'warning' as const, accuracy: 89.5, responseTime: '0.9s', lastActive: '1 min ago', tasksCompleted: 890 },
  { name: 'ResolutionAgent', type: 'Auto-Resolution', status: 'healthy' as const, accuracy: 96.8, responseTime: '2.1s', lastActive: '5 min ago', tasksCompleted: 450 },
  { name: 'NotificationAgent', type: 'Alert & Notify', status: 'healthy' as const, accuracy: 99.2, responseTime: '0.3s', lastActive: '30 sec ago', tasksCompleted: 3200 },
  { name: 'AnalyticsAgent', type: 'Insights & Reporting', status: 'idle' as const, accuracy: 97.5, responseTime: '3.2s', lastActive: '15 min ago', tasksCompleted: 120 },
  { name: 'IntegrationAgent', type: 'MCP Connector', status: 'healthy' as const, accuracy: 98.9, responseTime: '0.8s', lastActive: '1 min ago', tasksCompleted: 2100 },
];

export function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="data-grid">
        <MetricCard 
          title="Active Agents" 
          value="47" 
          subtitle="Running workflows"
          trend={{ value: 12, direction: 'up' }}
          icon={<Bot className="w-5 h-5 text-primary" />}
          variant="primary"
        />
        <MetricCard 
          title="Avg Accuracy" 
          value="94.8%" 
          subtitle="Across all agents"
          trend={{ value: 2.3, direction: 'up' }}
          icon={<Target className="w-5 h-5 text-success" />}
          variant="success"
        />
        <MetricCard 
          title="Incidents Processed" 
          value="12,450" 
          subtitle="Last 24 hours"
          trend={{ value: 8, direction: 'up' }}
          icon={<Activity className="w-5 h-5 text-secondary" />}
        />
        <MetricCard 
          title="Avg Response Time" 
          value="1.4s" 
          subtitle="P95 latency"
          trend={{ value: 5, direction: 'down' }}
          icon={<Clock className="w-5 h-5 text-warning" />}
        />
        <MetricCard 
          title="Token Usage" 
          value="2.4M" 
          subtitle="Today's consumption"
          trend={{ value: 3, direction: 'neutral' }}
          icon={<Zap className="w-5 h-5 text-primary" />}
        />
        <MetricCard 
          title="Alerts" 
          value="3" 
          subtitle="Requires attention"
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <EvaluationChart />
        </div>
        <div>
          <LayerMetricsChart />
        </div>
      </div>

      {/* Agents and Insights */}
      <div className="grid grid-cols-3 gap-6">
        {/* Agent Cards */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Active Agents</h2>
            <span className="text-sm text-muted-foreground">6 agents running</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.name} {...agent} />
            ))}
          </div>
        </div>

        {/* Insights Tower */}
        <div>
          <InsightsTower />
        </div>
      </div>
    </div>
  );
}
