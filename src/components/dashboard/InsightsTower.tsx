import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'optimization' | 'warning' | 'success';
  title: string;
  description: string;
  impact: string;
  agent: string;
  timestamp: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'optimization',
    title: 'Prompt optimization detected',
    description: 'IncidentClassifier agent could improve accuracy by 12% with suggested prompt refinements',
    impact: '+12% accuracy',
    agent: 'IncidentClassifier',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Token usage spike detected',
    description: 'EscalationAgent showing 45% higher token consumption than baseline',
    impact: '-45% cost efficiency',
    agent: 'EscalationAgent',
    timestamp: '15 min ago'
  },
  {
    id: '3',
    type: 'success',
    title: 'Self-improvement applied',
    description: 'ResolutionAgent successfully applied auto-tuning, response time improved',
    impact: '+23% faster',
    agent: 'ResolutionAgent',
    timestamp: '1 hour ago'
  },
];

const typeConfig = {
  optimization: { 
    icon: Sparkles, 
    color: 'text-primary', 
    bg: 'bg-primary/10',
    border: 'border-primary/30'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-warning', 
    bg: 'bg-warning/10',
    border: 'border-warning/30'
  },
  success: { 
    icon: CheckCircle, 
    color: 'text-success', 
    bg: 'bg-success/10',
    border: 'border-success/30'
  },
};

export function InsightsTower() {
  return (
    <div className="glass-panel overflow-hidden">
      {/* Header with gradient */}
      <div className="p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-float">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gradient-insights">AI InsightsTower</h3>
              <p className="text-sm text-muted-foreground">Meta-agent self-improvement system</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="insights" className="animate-pulse-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-mono font-semibold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">Auto-optimizations</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-mono font-semibold text-success">+18%</p>
            <p className="text-xs text-muted-foreground">Avg Improvement</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-mono font-semibold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Pending Actions</p>
          </div>
        </div>
      </div>

      {/* Insights list */}
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={insight.id}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/30",
                config.border,
                config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{insight.title}</h4>
                    <Badge variant="muted" className="shrink-0">{insight.impact}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-mono">{insight.agent}</span>
                    <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action bar */}
      <div className="p-4 border-t border-border bg-muted/30">
        <Button variant="insights" className="w-full">
          <Sparkles className="w-4 h-4" />
          Apply All Recommended Optimizations
        </Button>
      </div>
    </div>
  );
}
