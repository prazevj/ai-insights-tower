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
  ArrowRight,
  DollarSign,
  Hash,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Trace {
  id: string;
  name: string;
  service: string;
  status: 'success' | 'error' | 'warning';
  duration: number;
  timestamp: string;
  spans: number;
  agent: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  model: string;
}

interface Span {
  id: string;
  name: string;
  service: string;
  duration: number;
  startOffset: number;
  status: 'success' | 'error' | 'warning';
  type: 'agent' | 'tool' | 'model' | 'external';
  tokens?: number;
  cost?: number;
  input?: string;
  output?: string;
  metadata?: Record<string, string | number>;
}

const traces: Trace[] = [
  { id: 'trace-001', name: 'Incident Classification Flow', service: 'IncidentClassifier', status: 'success', duration: 2847, timestamp: '2 min ago', spans: 8, agent: 'IncidentClassifier', totalTokens: 1847, promptTokens: 1523, completionTokens: 324, cost: 0.0092, model: 'gpt-4o' },
  { id: 'trace-002', name: 'ServiceNow Ticket Creation', service: 'IntegrationAgent', status: 'success', duration: 1456, timestamp: '5 min ago', spans: 5, agent: 'IntegrationAgent', totalTokens: 892, promptTokens: 745, completionTokens: 147, cost: 0.0018, model: 'gpt-4o-mini' },
  { id: 'trace-003', name: 'P1 Escalation Workflow', service: 'EscalationAgent', status: 'error', duration: 8234, timestamp: '8 min ago', spans: 12, agent: 'EscalationAgent', totalTokens: 3421, promptTokens: 2856, completionTokens: 565, cost: 0.0171, model: 'gpt-4o' },
  { id: 'trace-004', name: 'Auto-Resolution Attempt', service: 'ResolutionAgent', status: 'success', duration: 4562, timestamp: '12 min ago', spans: 9, agent: 'ResolutionAgent', totalTokens: 2134, promptTokens: 1812, completionTokens: 322, cost: 0.0107, model: 'gpt-4o' },
  { id: 'trace-005', name: 'Notification Dispatch', service: 'NotificationAgent', status: 'warning', duration: 892, timestamp: '15 min ago', spans: 4, agent: 'NotificationAgent', totalTokens: 456, promptTokens: 389, completionTokens: 67, cost: 0.0009, model: 'gpt-4o-mini' },
];

const selectedTraceSpans: Span[] = [
  { id: 'span-1', name: 'Request Received', service: 'Gateway', duration: 23, startOffset: 0, status: 'success', type: 'external', input: 'POST /api/classify { "incident": "Database connection timeout..." }', output: 'Request routed to IncidentClassifier', metadata: { 'http.method': 'POST', 'http.status': 200 } },
  { id: 'span-2', name: 'Agent Initialization', service: 'IncidentClassifier', duration: 156, startOffset: 23, status: 'success', type: 'agent', input: 'Load agent configuration and context', output: 'Agent ready with 8 tools available', metadata: { 'agent.version': 'v1.2.0', 'tools.count': 8 } },
  { id: 'span-3', name: 'Context Retrieval', service: 'VectorDB', duration: 342, startOffset: 179, status: 'success', type: 'tool', tokens: 0, cost: 0, input: 'Query: "database connection timeout error patterns"', output: '3 similar incidents retrieved with scores > 0.72', metadata: { 'vectors.searched': 8420, 'results.count': 3 } },
  { id: 'span-4', name: 'LLM Inference', service: 'GPT-4o', duration: 1847, startOffset: 521, status: 'success', type: 'model', tokens: 1847, cost: 0.0092, input: 'System: You are an incident classifier...\nUser: Classify this incident...', output: '{"category": "Database", "priority": "P2", "confidence": 0.87}', metadata: { 'prompt_tokens': 1523, 'completion_tokens': 324, 'model': 'gpt-4o-2024-08-06' } },
  { id: 'span-5', name: 'Classification Logic', service: 'IncidentClassifier', duration: 134, startOffset: 2368, status: 'success', type: 'agent', input: 'Process LLM classification result', output: 'Incident classified as P2-Database, routing to DBA team', metadata: { 'confidence': 0.87, 'category': 'Database' } },
  { id: 'span-6', name: 'ServiceNow API Call', service: 'ServiceNow', duration: 287, startOffset: 2502, status: 'success', type: 'external', input: 'Create ticket: { "priority": "P2", "category": "Database" }', output: 'Ticket INC0012345 created successfully', metadata: { 'ticket.id': 'INC0012345', 'api.version': 'v2' } },
  { id: 'span-7', name: 'Response Formatting', service: 'IncidentClassifier', duration: 42, startOffset: 2789, status: 'success', type: 'agent', input: 'Format response with ticket details', output: 'Response prepared with classification and ticket info', metadata: { 'format': 'json', 'fields': 6 } },
  { id: 'span-8', name: 'Response Sent', service: 'Gateway', duration: 16, startOffset: 2831, status: 'success', type: 'external', input: 'Send response to client', output: '200 OK - Classification complete', metadata: { 'http.status': 200, 'response.size': '0.8KB' } },
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
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(selectedTraceSpans[3]);
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set(['span-4']));
  const totalDuration = Math.max(...selectedTraceSpans.map(s => s.startOffset + s.duration));
  
  const currentTrace = traces.find(t => t.id === selectedTrace);

  const toggleSpanExpand = (spanId: string) => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId);
    } else {
      newExpanded.add(spanId);
    }
    setExpandedSpans(newExpanded);
  };

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
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
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
                  {/* Token & Cost Info */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-primary">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{trace.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-mono">${trace.cost.toFixed(4)}</span>
                    </div>
                    <span className="text-muted-foreground">{trace.model}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trace Detail - Waterfall */}
        <div className="col-span-2 glass-panel flex flex-col">
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

          {/* Trace Summary */}
          {currentTrace && (
            <div className="p-3 border-b border-border bg-muted/20">
              <div className="grid grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-mono text-foreground">{currentTrace.duration}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Tokens</p>
                  <p className="font-mono text-foreground">{currentTrace.totalTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Prompt Tokens</p>
                  <p className="font-mono text-muted-foreground">{currentTrace.promptTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completion Tokens</p>
                  <p className="font-mono text-muted-foreground">{currentTrace.completionTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-mono text-success">${currentTrace.cost.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Model</p>
                  <p className="font-mono text-foreground">{currentTrace.model}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-1 flex-1 overflow-auto">
            {/* Timeline Header */}
            <div className="flex items-center mb-4">
              <div className="w-56" />
              <div className="flex-1 flex justify-between text-xs text-muted-foreground font-mono">
                <span>0ms</span>
                <span>{Math.round(totalDuration / 4)}ms</span>
                <span>{Math.round(totalDuration / 2)}ms</span>
                <span>{Math.round(totalDuration * 3 / 4)}ms</span>
                <span>{totalDuration}ms</span>
              </div>
            </div>

            {/* Spans with expandable details */}
            {selectedTraceSpans.map((span) => {
              const config = statusConfig[span.status];
              const leftOffset = (span.startOffset / totalDuration) * 100;
              const width = (span.duration / totalDuration) * 100;
              const isExpanded = expandedSpans.has(span.id);

              return (
                <div key={span.id} className="group">
                  <div 
                    className={cn(
                      "flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded-lg py-1 px-1 transition-colors",
                      selectedSpan?.id === span.id && "bg-muted/40"
                    )}
                    onClick={() => {
                      setSelectedSpan(span);
                      toggleSpanExpand(span.id);
                    }}
                  >
                    <div className="w-56 flex items-center gap-2">
                      <button className="p-0.5 hover:bg-muted rounded">
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", typeColors[span.type])} />
                      <span className="text-sm text-foreground truncate">{span.name}</span>
                      {span.tokens && span.tokens > 0 && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto">
                          {span.tokens.toLocaleString()} tok
                        </Badge>
                      )}
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
                        {span.cost && span.cost > 0 && (
                          <span className="text-success ml-2">${span.cost.toFixed(4)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Span Details */}
                  {isExpanded && (
                    <div className="ml-8 mt-1 mb-2 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs space-y-3">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Service</p>
                          <p className="font-mono text-foreground">{span.service}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Type</p>
                          <Badge variant="outline" className="capitalize">{span.type}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Duration</p>
                          <p className="font-mono text-foreground">{span.duration}ms</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Status</p>
                          <Badge variant={config.badge}>{span.status}</Badge>
                        </div>
                      </div>

                      {span.tokens !== undefined && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-muted-foreground mb-1">Tokens Used</p>
                            <p className="font-mono text-primary">{span.tokens.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Cost</p>
                            <p className="font-mono text-success">${(span.cost || 0).toFixed(4)}</p>
                          </div>
                        </div>
                      )}

                      {span.input && (
                        <div>
                          <p className="text-muted-foreground mb-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Input
                          </p>
                          <div className="p-2 rounded bg-background/50 font-mono text-foreground whitespace-pre-wrap break-all max-h-24 overflow-auto">
                            {span.input}
                          </div>
                        </div>
                      )}

                      {span.output && (
                        <div>
                          <p className="text-muted-foreground mb-1 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Output
                          </p>
                          <div className="p-2 rounded bg-background/50 font-mono text-foreground whitespace-pre-wrap break-all max-h-24 overflow-auto">
                            {span.output}
                          </div>
                        </div>
                      )}

                      {span.metadata && Object.keys(span.metadata).length > 0 && (
                        <div>
                          <p className="text-muted-foreground mb-1">Metadata</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(span.metadata).map(([key, value]) => (
                              <div key={key} className="px-2 py-1 rounded bg-background/50 font-mono">
                                <span className="text-muted-foreground">{key}:</span>{' '}
                                <span className="text-foreground">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Span Quick View */}
          {selectedSpan && (
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Selected: {selectedSpan.name}</h4>
                <Badge variant="outline" className="capitalize">{selectedSpan.type}</Badge>
              </div>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="font-mono text-foreground">{selectedSpan.service}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-mono text-foreground">{selectedSpan.duration}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tokens</p>
                  <p className="font-mono text-foreground">{selectedSpan.tokens?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-mono text-success">{selectedSpan.cost ? `$${selectedSpan.cost.toFixed(4)}` : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedSpan.status].badge}>{selectedSpan.status}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
