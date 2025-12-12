import { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Bug,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  service: string;
  traceId?: string;
  metadata?: Record<string, string>;
}

const logs: LogEntry[] = [
  { id: '1', timestamp: '2024-01-15 14:32:45.123', level: 'info', message: 'Incident INC0012345 classified as Priority 2 - Network Issue', service: 'IncidentClassifier', traceId: 'trace-001' },
  { id: '2', timestamp: '2024-01-15 14:32:44.892', level: 'info', message: 'LLM inference completed in 650ms, tokens: 1250', service: 'GPT-4o', traceId: 'trace-001' },
  { id: '3', timestamp: '2024-01-15 14:32:44.120', level: 'debug', message: 'Retrieved 5 similar incidents from vector store', service: 'VectorDB', traceId: 'trace-001' },
  { id: '4', timestamp: '2024-01-15 14:32:42.456', level: 'error', message: 'ServiceNow API timeout after 30000ms - retrying (attempt 2/3)', service: 'IntegrationAgent', traceId: 'trace-003' },
  { id: '5', timestamp: '2024-01-15 14:32:41.234', level: 'warn', message: 'Token usage approaching 80% of budget for EscalationAgent', service: 'TokenMonitor' },
  { id: '6', timestamp: '2024-01-15 14:32:40.890', level: 'info', message: 'Auto-resolution workflow initiated for INC0012340', service: 'ResolutionAgent', traceId: 'trace-004' },
  { id: '7', timestamp: '2024-01-15 14:32:39.567', level: 'info', message: 'Slack notification sent to #ops-alerts channel', service: 'NotificationAgent', traceId: 'trace-005' },
  { id: '8', timestamp: '2024-01-15 14:32:38.234', level: 'debug', message: 'Agent context window: 4096 tokens, used: 2847', service: 'IncidentClassifier' },
  { id: '9', timestamp: '2024-01-15 14:32:37.123', level: 'error', message: 'Failed to parse ServiceNow response: Invalid JSON at position 1245', service: 'IntegrationAgent', traceId: 'trace-003' },
  { id: '10', timestamp: '2024-01-15 14:32:36.890', level: 'info', message: 'HITL approval received for P1 escalation', service: 'EscalationAgent', traceId: 'trace-003' },
];

const levelConfig = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', badge: 'info' as const },
  warn: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', badge: 'warning' as const },
  error: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', badge: 'critical' as const },
  debug: { icon: Bug, color: 'text-muted-foreground', bg: 'bg-muted', badge: 'muted' as const },
};

export function LogStream() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['info', 'warn', 'error', 'debug']);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => selectedLevels.includes(log.level));

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="glass-panel">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-foreground">Log Stream</h3>
          <div className="flex items-center gap-2">
            {Object.entries(levelConfig).map(([level, config]) => {
              const Icon = config.icon;
              const isActive = selectedLevels.includes(level);
              return (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all",
                    isActive ? config.bg : "bg-muted/30 opacity-50"
                  )}
                >
                  <Icon className={cn("w-3 h-3", isActive ? config.color : "text-muted-foreground")} />
                  <span className={isActive ? config.color : "text-muted-foreground"}>
                    {level.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              className="h-8 w-48 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Logs */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin font-mono text-sm">
        {filteredLogs.map((log) => {
          const config = levelConfig[log.level];
          const Icon = config.icon;
          const isExpanded = expandedLog === log.id;

          return (
            <div
              key={log.id}
              className={cn(
                "border-b border-border transition-colors hover:bg-muted/20",
                isExpanded && "bg-muted/30"
              )}
            >
              <div 
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
              >
                <div className={cn("p-1 rounded", config.bg)}>
                  <Icon className={cn("w-3 h-3", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    <Badge variant={config.badge} className="text-[10px]">{log.level}</Badge>
                    <span className="text-xs text-primary">{log.service}</span>
                    {log.traceId && (
                      <span className="text-xs text-muted-foreground font-mono">{log.traceId}</span>
                    )}
                  </div>
                  <p className="text-foreground break-words">{log.message}</p>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </div>

              {isExpanded && (
                <div className="px-12 pb-3 space-y-2">
                  <div className="grid grid-cols-2 gap-4 p-3 rounded bg-muted/30 text-xs">
                    <div>
                      <span className="text-muted-foreground">Service: </span>
                      <span className="text-foreground">{log.service}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trace ID: </span>
                      <span className="text-primary">{log.traceId || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timestamp: </span>
                      <span className="text-foreground">{log.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Level: </span>
                      <span className={config.color}>{log.level.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filteredLogs.length} of {logs.length} logs</span>
        <Button variant="ghost" size="sm" className="text-xs">
          Load More
        </Button>
      </div>
    </div>
  );
}
