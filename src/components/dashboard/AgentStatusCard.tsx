import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap } from 'lucide-react';

interface AgentStatusCardProps {
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'critical' | 'idle';
  accuracy: number;
  responseTime: string;
  lastActive: string;
  tasksCompleted: number;
}

export function AgentStatusCard({
  name,
  type,
  status,
  accuracy,
  responseTime,
  lastActive,
  tasksCompleted
}: AgentStatusCardProps) {
  const statusConfig = {
    healthy: { label: 'Healthy', variant: 'success' as const, dotClass: 'status-healthy' },
    warning: { label: 'Warning', variant: 'warning' as const, dotClass: 'status-warning' },
    critical: { label: 'Critical', variant: 'critical' as const, dotClass: 'status-critical' },
    idle: { label: 'Idle', variant: 'muted' as const, dotClass: 'bg-muted-foreground' },
  };

  const config = statusConfig[status];

  return (
    <div className="glass-panel p-4 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("status-dot", config.dotClass)} />
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-mono text-foreground">{accuracy}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <div>
            <p className="text-sm font-mono text-foreground">{responseTime}</p>
            <p className="text-[10px] text-muted-foreground">Avg Response</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-success" />
          <div>
            <p className="text-sm font-mono text-foreground">{tasksCompleted}</p>
            <p className="text-[10px] text-muted-foreground">Tasks Done</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{lastActive}</p>
          <p className="text-[10px] text-muted-foreground">Last Active</p>
        </div>
      </div>
    </div>
  );
}
