import { Activity, Bot, Brain, Zap, Clock, Target, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { EvaluationChart, LayerMetricsChart } from '@/components/dashboard/EvaluationChart';
import { InsightsTower } from '@/components/dashboard/InsightsTower';

const agents = [
  { name: 'IncidentClassifier', type: 'Classification Agent', status: 'healthy' as const, accuracy: 87.3, responseTime: '2.4s', lastActive: '2 min ago', tasksCompleted: 156 },
  { name: 'EscalationAgent', type: 'Escalation & Routing', status: 'warning' as const, accuracy: 82.1, responseTime: '1.8s', lastActive: '1 min ago', tasksCompleted: 89 },
  { name: 'ResolutionAgent', type: 'Auto-Resolution', status: 'healthy' as const, accuracy: 79.5, responseTime: '4.2s', lastActive: '5 min ago', tasksCompleted: 43 },
  { name: 'NotificationAgent', type: 'Alert & Notify', status: 'healthy' as const, accuracy: 94.8, responseTime: '0.6s', lastActive: '30 sec ago', tasksCompleted: 312 },
  { name: 'AnalyticsAgent', type: 'Insights & Reporting', status: 'idle' as const, accuracy: 91.2, responseTime: '5.8s', lastActive: '15 min ago', tasksCompleted: 28 },
  { name: 'IntegrationAgent', type: 'MCP Connector', status: 'healthy' as const, accuracy: 96.4, responseTime: '1.2s', lastActive: '1 min ago', tasksCompleted: 245 },
];

export function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="data-grid">
        <MetricCard 
          title="Active Agents" 
          value="6" 
          subtitle="Running workflows"
          trend={{ value: 2, direction: 'up' }}
          icon={<Bot className="w-5 h-5 text-primary" />}
          variant="primary"
        />
        <MetricCard 
          title="Avg Accuracy" 
          value="88.5%" 
          subtitle="Across all agents"
          trend={{ value: 1.2, direction: 'up' }}
          icon={<Target className="w-5 h-5 text-success" />}
          variant="success"
        />
        <MetricCard 
          title="Incidents Processed" 
          value="873" 
          subtitle="Last 24 hours"
          trend={{ value: 5, direction: 'up' }}
          icon={<Activity className="w-5 h-5 text-secondary" />}
        />
        <MetricCard 
          title="Avg Response Time" 
          value="2.7s" 
          subtitle="P95 latency"
          trend={{ value: 8, direction: 'down' }}
          icon={<Clock className="w-5 h-5 text-warning" />}
        />
        <MetricCard 
          title="Token Usage" 
          value="142K" 
          subtitle="Today's consumption"
          trend={{ value: 12, direction: 'up' }}
          icon={<Zap className="w-5 h-5 text-primary" />}
        />
        <MetricCard 
          title="Alerts" 
          value="7" 
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
