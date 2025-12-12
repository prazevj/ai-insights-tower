import { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  Layers,
  Zap,
  Database,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Trace {
  id: string;
  name: string;
  service: string;
  status: 'success' | 'error' | 'warning';
  duration: number;
  timestamp: string;
  spans: number;
  agent: string;
}

interface Span {
  id: string;
  name: string;
  service: string;
  duration: number;
  startOffset: number;
  status: 'success' | 'error' | 'warning';
  type: 'agent' | 'tool' | 'model' | 'external';
}

const traces: Trace[] = [
  { id: 'trace-001', name: 'Incident Classification Flow', service: 'IncidentClassifier', status: 'success', duration: 1245, timestamp: '2 min ago', spans: 8, agent: 'IncidentClassifier' },
  { id: 'trace-002', name: 'ServiceNow Ticket Creation', service: 'IntegrationAgent', status: 'success', duration: 892, timestamp: '5 min ago', spans: 5, agent: 'IntegrationAgent' },
  { id: 'trace-003', name: 'P1 Escalation Workflow', service: 'EscalationAgent', status: 'error', duration: 3421, timestamp: '8 min ago', spans: 12, agent: 'EscalationAgent' },
  { id: 'trace-004', name: 'Auto-Resolution Attempt', service: 'ResolutionAgent', status: 'success', duration: 2105, timestamp: '12 min ago', spans: 9, agent: 'ResolutionAgent' },
  { id: 'trace-005', name: 'Notification Dispatch', service: 'NotificationAgent', status: 'warning', duration: 456, timestamp: '15 min ago', spans: 4, agent: 'NotificationAgent' },
];

const selectedTraceSpans: Span[] = [
  { id: 'span-1', name: 'Request Received', service: 'Gateway', duration: 12, startOffset: 0, status: 'success', type: 'external' },
  { id: 'span-2', name: 'Agent Initialization', service: 'IncidentClassifier', duration: 45, startOffset: 12, status: 'success', type: 'agent' },
  { id: 'span-3', name: 'Context Retrieval', service: 'VectorDB', duration: 120, startOffset: 57, status: 'success', type: 'tool' },
  { id: 'span-4', name: 'LLM Inference', service: 'GPT-4o', duration: 650, startOffset: 177, status: 'success', type: 'model' },
  { id: 'span-5', name: 'Classification Logic', service: 'IncidentClassifier', duration: 85, startOffset: 827, status: 'success', type: 'agent' },
  { id: 'span-6', name: 'ServiceNow API Call', service: 'ServiceNow', duration: 280, startOffset: 912, status: 'success', type: 'external' },
  { id: 'span-7', name: 'Response Formatting', service: 'IncidentClassifier', duration: 35, startOffset: 1192, status: 'success', type: 'agent' },
  { id: 'span-8', name: 'Response Sent', service: 'Gateway', duration: 18, startOffset: 1227, status: 'success', type: 'external' },
];

const statusConfig = {
  success: { color: 'text-success', bg: 'bg-success', badge: 'success' as const },
  error: { color: 'text-destructive', bg: 'bg-destructive', badge: 'critical' as const },
  warning: { color: 'text-warning', bg: 'bg-warning', badge: 'warning' as const },
};

const typeColors = {
  agent: 'bg-secondary',
  tool: 'bg-primary',
  model: 'bg-purple-500',
  external: 'bg-chart-3',
};

export function TraceViewer() {
  const [selectedTrace, setSelectedTrace] = useState<string>('trace-001');
  const totalDuration = Math.max(...selectedTraceSpans.map(s => s.startOffset + s.duration));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search traces..."
              className="h-9 w-80 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="muted">Last 1 hour</Badge>
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trace List */}
        <div className="glass-panel">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-foreground">Recent Traces</h3>
            <p className="text-xs text-muted-foreground">{traces.length} traces</p>
          </div>
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
            {traces.map((trace) => {
              const config = statusConfig[trace.status];
              return (
                <div
                  key={trace.id}
                  onClick={() => setSelectedTrace(trace.id)}
                  className={cn(
                    "p-3 cursor-pointer transition-all hover:bg-muted/30",
                    selectedTrace === trace.id && "bg-muted/50 border-l-2 border-l-primary"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{trace.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={config.badge} className="text-[10px]">
                      {trace.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{trace.service}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{trace.duration}ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{trace.spans} spans</span>
                    </div>
                    <span>{trace.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trace Detail - Waterfall */}
        <div className="col-span-2 glass-panel">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Trace Waterfall</h3>
              <p className="text-xs text-muted-foreground font-mono">{selectedTrace}</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: 'Agent', color: 'bg-secondary' },
                { label: 'Tool', color: 'bg-primary' },
                { label: 'Model', color: 'bg-purple-500' },
                { label: 'External', color: 'bg-chart-3' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-2">
            {/* Timeline Header */}
            <div className="flex items-center mb-4">
              <div className="w-48" />
              <div className="flex-1 flex justify-between text-xs text-muted-foreground font-mono">
                <span>0ms</span>
                <span>{Math.round(totalDuration / 4)}ms</span>
                <span>{Math.round(totalDuration / 2)}ms</span>
                <span>{Math.round(totalDuration * 3 / 4)}ms</span>
                <span>{totalDuration}ms</span>
              </div>
            </div>

            {/* Spans */}
            {selectedTraceSpans.map((span, index) => {
              const config = statusConfig[span.status];
              const leftOffset = (span.startOffset / totalDuration) * 100;
              const width = (span.duration / totalDuration) * 100;

              return (
                <div key={span.id} className="flex items-center gap-2 group">
                  <div className="w-48 flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", typeColors[span.type])} />
                    <span className="text-sm text-foreground truncate">{span.name}</span>
                  </div>
                  <div className="flex-1 h-6 bg-muted/30 rounded relative">
                    <div
                      className={cn(
                        "absolute h-full rounded transition-all group-hover:opacity-80",
                        typeColors[span.type]
                      )}
                      style={{
                        left: `${leftOffset}%`,
                        width: `${Math.max(width, 1)}%`,
                      }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono text-foreground whitespace-nowrap"
                      style={{ left: `${leftOffset + width + 1}%` }}
                    >
                      {span.duration}ms
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Span Details */}
          <div className="p-4 border-t border-border bg-muted/20">
            <h4 className="text-sm font-medium text-foreground mb-3">Span Details</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="font-mono text-foreground">IncidentClassifier</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Duration</p>
                <p className="font-mono text-foreground">{totalDuration}ms</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spans</p>
                <p className="font-mono text-foreground">{selectedTraceSpans.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="success">Success</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
