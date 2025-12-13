import { useState } from 'react';
import { Shield, AlertTriangle, UserCheck, FileText, Lock, Eye, ToggleLeft, ToggleRight, Plus, Search, Filter, Download, Clock, CheckCircle, XCircle, Edit3, Trash2, Copy, ChevronDown, ChevronUp, Users, AlertCircle, Activity, Zap, Ban, FileWarning, Scale, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'guardrail' | 'boundary' | 'hitl' | 'audit';
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  appliedTo: string[];
  conditions: string[];
  lastTriggered: string;
  triggerCount: number;
}

interface HITLTask {
  id: string;
  type: string;
  agent: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal';
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  requester: string;
  context: string;
}

interface AuditLog {
  id: string;
  action: string;
  agent: string;
  user: string;
  timestamp: string;
  status: 'success' | 'blocked' | 'review';
  policyId?: string;
  details?: string;
  ipAddress?: string;
  sessionId?: string;
}

const policies: Policy[] = [
  { 
    id: '1', 
    name: 'PII Data Masking', 
    description: 'Automatically redact sensitive personal information from all agent inputs and outputs', 
    type: 'guardrail', 
    severity: 'critical',
    enabled: true, 
    appliedTo: ['All Agents'],
    conditions: ['Detect SSN patterns', 'Detect credit card numbers', 'Detect email addresses'],
    lastTriggered: '5 min ago',
    triggerCount: 1245
  },
  { 
    id: '2', 
    name: 'Token Budget Limit', 
    description: 'Cap token usage per request at 4000 tokens to prevent runaway costs', 
    type: 'boundary', 
    severity: 'high',
    enabled: true, 
    appliedTo: ['EscalationAgent', 'ResolutionAgent'],
    conditions: ['Max tokens per request: 4000', 'Daily limit: 100,000 tokens'],
    lastTriggered: '1 hour ago',
    triggerCount: 89
  },
  { 
    id: '3', 
    name: 'Critical Incident Approval', 
    description: 'Require human approval for all P1 incident escalation actions', 
    type: 'hitl', 
    severity: 'critical',
    enabled: true, 
    appliedTo: ['EscalationAgent'],
    conditions: ['Incident priority = P1', 'Action type = Escalate', 'Target team = On-Call'],
    lastTriggered: '30 min ago',
    triggerCount: 23
  },
  { 
    id: '4', 
    name: 'External API Calls', 
    description: 'Log all external service integrations with full request/response capture', 
    type: 'audit', 
    severity: 'medium',
    enabled: true, 
    appliedTo: ['All Agents'],
    conditions: ['Log HTTP requests', 'Capture response times', 'Store payload hashes'],
    lastTriggered: '1 min ago',
    triggerCount: 45200
  },
  { 
    id: '5', 
    name: 'Model Output Filtering', 
    description: 'Filter potentially harmful, biased, or inappropriate LLM outputs', 
    type: 'guardrail', 
    severity: 'high',
    enabled: true, 
    appliedTo: ['All Agents'],
    conditions: ['Toxicity score < 0.3', 'Bias score < 0.2', 'Factuality check'],
    lastTriggered: '2 hours ago',
    triggerCount: 156
  },
  { 
    id: '6', 
    name: 'Rate Limiting', 
    description: 'Limit agent actions to prevent abuse and ensure fair resource usage', 
    type: 'boundary', 
    severity: 'medium',
    enabled: true, 
    appliedTo: ['All Agents'],
    conditions: ['Max 100 actions/minute', 'Max 10 concurrent requests', 'Cooldown: 5s between bulk ops'],
    lastTriggered: '3 hours ago',
    triggerCount: 12
  },
  {
    id: '7',
    name: 'Data Retention Policy',
    description: 'Enforce data retention limits and automatic cleanup of sensitive data',
    type: 'audit',
    severity: 'high',
    enabled: true,
    appliedTo: ['DataAgent', 'KnowledgeAgent'],
    conditions: ['PII retention: 30 days', 'Logs retention: 90 days', 'Auto-purge enabled'],
    lastTriggered: '1 day ago',
    triggerCount: 890
  },
  {
    id: '8',
    name: 'Production Change Approval',
    description: 'Require approval for any changes to production environment',
    type: 'hitl',
    severity: 'critical',
    enabled: false,
    appliedTo: ['ResolutionAgent', 'AutomationAgent'],
    conditions: ['Environment = Production', 'Change type = Configuration', 'Impact level = High'],
    lastTriggered: 'Never',
    triggerCount: 0
  },
];

const hitlTasks: HITLTask[] = [
  { 
    id: '1', 
    type: 'Escalation Approval', 
    agent: 'EscalationAgent', 
    description: 'Approve escalation of INC0012345 to P1 with on-call notification',
    priority: 'urgent',
    requestedAt: '2 min ago',
    status: 'pending',
    requester: 'EscalationAgent v1.8.3',
    context: 'Database connectivity issue affecting 500+ users. Current SLA: 45min remaining.'
  },
  { 
    id: '2', 
    type: 'Resolution Action', 
    agent: 'ResolutionAgent', 
    description: 'Approve auto-restart of production service web-api-prod',
    priority: 'high',
    requestedAt: '15 min ago',
    status: 'pending',
    requester: 'ResolutionAgent v3.1.0',
    context: 'Service showing degraded performance. Restart typically resolves issue.'
  },
  { 
    id: '3', 
    type: 'Data Access', 
    agent: 'DataAgent', 
    description: 'Approve access to customer PII for incident analysis',
    priority: 'high',
    requestedAt: '30 min ago',
    status: 'pending',
    requester: 'DataAgent v1.2.0',
    context: 'Required for root cause analysis of authentication failures.'
  },
  { 
    id: '4', 
    type: 'Escalation Approval', 
    agent: 'EscalationAgent', 
    description: 'Escalate network incident INC0012340 to Network Team',
    priority: 'normal',
    requestedAt: '1 hour ago',
    status: 'approved',
    requester: 'EscalationAgent v1.8.3',
    context: 'Intermittent packet loss on core router.'
  },
  { 
    id: '5', 
    type: 'Resolution Action', 
    agent: 'ResolutionAgent', 
    description: 'Execute runbook RB-1234 for memory optimization',
    priority: 'normal',
    requestedAt: '2 hours ago',
    status: 'rejected',
    requester: 'ResolutionAgent v3.1.0',
    context: 'Manual intervention preferred due to recent similar incident.'
  },
];

const auditLogs: AuditLog[] = [
  { id: '1', action: 'Escalated incident INC0012345 to P1', agent: 'EscalationAgent', user: 'admin@company.com', timestamp: '2 min ago', status: 'review', policyId: '3', details: 'Awaiting human approval', ipAddress: '10.0.1.45', sessionId: 'sess_abc123' },
  { id: '2', action: 'Created ServiceNow ticket', agent: 'IncidentClassifier', user: 'system', timestamp: '5 min ago', status: 'success', details: 'Ticket #TKT-45678 created', ipAddress: '10.0.1.50', sessionId: 'sess_def456' },
  { id: '3', action: 'Attempted to access restricted data', agent: 'DataAgent', user: 'system', timestamp: '12 min ago', status: 'blocked', policyId: '1', details: 'PII access denied without approval', ipAddress: '10.0.1.55', sessionId: 'sess_ghi789' },
  { id: '4', action: 'Applied auto-resolution to INC0012340', agent: 'ResolutionAgent', user: 'system', timestamp: '15 min ago', status: 'success', details: 'Runbook RB-5678 executed successfully', ipAddress: '10.0.1.50', sessionId: 'sess_jkl012' },
  { id: '5', action: 'Updated incident priority', agent: 'EscalationAgent', user: 'john.doe@company.com', timestamp: '20 min ago', status: 'success', details: 'Priority changed from P3 to P2', ipAddress: '192.168.1.100', sessionId: 'sess_mno345' },
  { id: '6', action: 'Token limit exceeded', agent: 'ResolutionAgent', user: 'system', timestamp: '25 min ago', status: 'blocked', policyId: '2', details: 'Request exceeded 4000 token limit', ipAddress: '10.0.1.50', sessionId: 'sess_pqr678' },
  { id: '7', action: 'Sent Slack notification', agent: 'NotificationAgent', user: 'system', timestamp: '30 min ago', status: 'success', details: 'Notified #incidents channel', ipAddress: '10.0.1.60', sessionId: 'sess_stu901' },
  { id: '8', action: 'Retrieved knowledge article', agent: 'KnowledgeAgent', user: 'system', timestamp: '35 min ago', status: 'success', details: 'KB-12345 retrieved for context', ipAddress: '10.0.1.55', sessionId: 'sess_vwx234' },
];

const complianceData = [
  { date: 'Dec 8', violations: 12, blocked: 8, approved: 45 },
  { date: 'Dec 9', violations: 8, blocked: 5, approved: 52 },
  { date: 'Dec 10', violations: 15, blocked: 12, approved: 48 },
  { date: 'Dec 11', violations: 6, blocked: 4, approved: 61 },
  { date: 'Dec 12', violations: 9, blocked: 7, approved: 55 },
  { date: 'Dec 13', violations: 5, blocked: 3, approved: 58 },
];

const policyDistribution = [
  { name: 'Guardrails', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Boundaries', value: 25, color: 'hsl(var(--warning))' },
  { name: 'HITL', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Audit', value: 20, color: 'hsl(var(--muted-foreground))' },
];

const typeIcons = {
  guardrail: Shield,
  boundary: Lock,
  hitl: UserCheck,
  audit: FileText,
};

const typeColors = {
  guardrail: 'text-primary bg-primary/10',
  boundary: 'text-warning bg-warning/10',
  hitl: 'text-secondary bg-secondary/10',
  audit: 'text-muted-foreground bg-muted',
};

const severityColors = {
  critical: 'text-destructive bg-destructive/10',
  high: 'text-warning bg-warning/10',
  medium: 'text-secondary bg-secondary/10',
  low: 'text-muted-foreground bg-muted',
};

export function GovernancePanel() {
  const [policyStates, setPolicyStates] = useState<Record<string, boolean>>(
    policies.reduce((acc, p) => ({ ...acc, [p.id]: p.enabled }), {})
  );
  const [selectedTab, setSelectedTab] = useState('policies');
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePolicy = (id: string) => {
    setPolicyStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pendingTasks = hitlTasks.filter(t => t.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{policies.filter(p => policyStates[p.id]).length}</p>
              <p className="text-xs text-muted-foreground">Active Policies</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{pendingTasks.length}</p>
              <p className="text-xs text-muted-foreground">Pending HITL</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Ban className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{auditLogs.filter(l => l.status === 'blocked').length}</p>
              <p className="text-xs text-muted-foreground">Blocked Today</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">99.2%</p>
              <p className="text-xs text-muted-foreground">Compliance Rate</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">47.5K</p>
              <p className="text-xs text-muted-foreground">Policy Triggers</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Users className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Agents Governed</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="hitl" className="relative">
              Human-in-the-Loop
              {pendingTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-warning-foreground text-[10px] rounded-full flex items-center justify-center">
                  {pendingTasks.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-9 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="policies" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Governance Policies</h3>
                <Button variant="glow" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Policy
                </Button>
              </div>

              <div className="space-y-3">
                {policies.map((policy) => {
                  const Icon = typeIcons[policy.type];
                  const isEnabled = policyStates[policy.id];
                  const isExpanded = expandedPolicy === policy.id;
                  
                  return (
                    <div 
                      key={policy.id} 
                      className={cn(
                        "glass-panel transition-all",
                        isEnabled ? "border-l-4 border-l-primary" : "opacity-60"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={cn("p-2 rounded-lg", typeColors[policy.type])}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{policy.name}</h4>
                                <Badge variant="muted" className="text-[10px]">{policy.type.toUpperCase()}</Badge>
                                <Badge className={cn("text-[10px]", severityColors[policy.severity])}>
                                  {policy.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Triggered: <span className="text-foreground">{policy.triggerCount.toLocaleString()}</span></span>
                                <span>Last: <span className="text-foreground">{policy.lastTriggered}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                            <button 
                              onClick={() => togglePolicy(policy.id)}
                              className={cn(
                                "relative w-12 h-6 rounded-full transition-colors",
                                isEnabled ? "bg-success" : "bg-muted"
                              )}
                            >
                              <div className={cn(
                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                                isEnabled ? "left-7" : "left-1"
                              )} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-muted/20 animate-fade-in">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Applied To</p>
                              <div className="flex flex-wrap gap-1">
                                {policy.appliedTo.map((agent, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px]">{agent}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Conditions</p>
                              <ul className="space-y-1">
                                {policy.conditions.map((condition, i) => (
                                  <li key={i} className="text-xs text-foreground flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-success" />
                                    {condition}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="w-3 h-3 mr-1" />
                              Clone
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-4">Policy Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {policyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Critical Policies</span>
                    <Badge variant="critical">{policies.filter(p => p.severity === 'critical').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Disabled Policies</span>
                    <Badge variant="muted">{policies.filter(p => !policyStates[p.id]).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Triggers/Day</span>
                    <span className="text-sm font-mono text-foreground">1,245</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hitl" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 glass-panel">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Human-in-the-Loop Tasks</h3>
                  <p className="text-sm text-muted-foreground">{pendingTasks.length} pending approval</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {hitlTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-4 transition-colors",
                      task.status === 'pending' && "bg-warning/5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            task.priority === 'urgent' ? 'critical' : 
                            task.priority === 'high' ? 'warning' : 'muted'
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.type}</Badge>
                        <span className="text-sm font-mono text-primary">{task.agent}</span>
                      </div>
                      <Badge 
                        variant={
                          task.status === 'pending' ? 'warning' : 
                          task.status === 'approved' ? 'success' : 'critical'
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2">{task.description}</p>
                    <p className="text-xs text-muted-foreground mb-3 p-2 rounded bg-muted/30">{task.context}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Requested {task.requestedAt} by {task.requester}</span>
                      {task.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                          <Button variant="glow" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">HITL Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Auto-approve after</span>
                    <select className="h-8 px-2 rounded bg-muted/50 border border-border text-sm text-foreground">
                      <option>Never</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Escalation after</span>
                    <select className="h-8 px-2 rounded bg-muted/50 border border-border text-sm text-foreground">
                      <option>10 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Notify on urgent</span>
                    <button className="relative w-10 h-5 rounded-full bg-success">
                      <div className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Response Time</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Response</span>
                    <span className="font-mono text-foreground">4.2 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Urgent</span>
                    <span className="font-mono text-success">1.8 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Approval Rate</span>
                    <span className="font-mono text-foreground">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <div className="glass-panel">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Audit Logs</h3>
                <p className="text-sm text-muted-foreground">Complete activity history</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Agent</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">User</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Details</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className={cn(
                        "border-b border-border hover:bg-muted/20 cursor-pointer",
                        selectedLog?.id === log.id && "bg-muted/30"
                      )}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="p-3">
                        <Badge 
                          variant={
                            log.status === 'success' ? 'success' : 
                            log.status === 'blocked' ? 'critical' : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="p-3 text-sm font-mono text-primary">{log.agent}</td>
                      <td className="p-3 text-sm text-foreground">{log.action}</td>
                      <td className="p-3 text-sm text-muted-foreground">{log.user}</td>
                      <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">{log.details}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="approved" name="Approved" stroke="hsl(var(--success))" strokeWidth={2} />
                    <Line type="monotone" dataKey="blocked" name="Blocked" stroke="hsl(var(--destructive))" strokeWidth={2} />
                    <Line type="monotone" dataKey="violations" name="Violations" stroke="hsl(var(--warning))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Policy Effectiveness</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policies.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={120} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar dataKey="triggerCount" name="Triggers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-2 glass-panel p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Frameworks</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: 'SOC 2 Type II', status: 'compliant', coverage: 98 },
                  { name: 'GDPR', status: 'compliant', coverage: 95 },
                  { name: 'ISO 27001', status: 'partial', coverage: 82 },
                  { name: 'HIPAA', status: 'not_applicable', coverage: 0 },
                ].map((framework, i) => (
                  <div key={i} className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{framework.name}</span>
                      <Badge 
                        variant={
                          framework.status === 'compliant' ? 'success' : 
                          framework.status === 'partial' ? 'warning' : 'muted'
                        }
                      >
                        {framework.status === 'not_applicable' ? 'N/A' : framework.status}
                      </Badge>
                    </div>
                    {framework.status !== 'not_applicable' && (
                      <>
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              framework.coverage >= 90 ? "bg-success" : "bg-warning"
                            )}
                            style={{ width: `${framework.coverage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{framework.coverage}% coverage</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
