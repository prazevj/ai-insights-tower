import { useState } from 'react';
import { Shield, AlertTriangle, UserCheck, FileText, Lock, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'guardrail' | 'boundary' | 'hitl' | 'audit';
  enabled: boolean;
  appliedTo: string[];
}

interface AuditLog {
  id: string;
  action: string;
  agent: string;
  user: string;
  timestamp: string;
  status: 'success' | 'blocked' | 'review';
}

const policies: Policy[] = [
  { id: '1', name: 'PII Data Masking', description: 'Automatically redact sensitive personal information', type: 'guardrail', enabled: true, appliedTo: ['All Agents'] },
  { id: '2', name: 'Token Budget Limit', description: 'Cap token usage per request at 4000 tokens', type: 'boundary', enabled: true, appliedTo: ['EscalationAgent', 'ResolutionAgent'] },
  { id: '3', name: 'Critical Incident Approval', description: 'Require human approval for P1 incident actions', type: 'hitl', enabled: true, appliedTo: ['EscalationAgent'] },
  { id: '4', name: 'External API Calls', description: 'Log all external service integrations', type: 'audit', enabled: true, appliedTo: ['All Agents'] },
  { id: '5', name: 'Model Output Filtering', description: 'Filter potentially harmful or biased outputs', type: 'guardrail', enabled: false, appliedTo: ['All Agents'] },
  { id: '6', name: 'Rate Limiting', description: 'Limit agent actions to 100 per minute', type: 'boundary', enabled: true, appliedTo: ['All Agents'] },
];

const auditLogs: AuditLog[] = [
  { id: '1', action: 'Escalated incident INC0012345 to P1', agent: 'EscalationAgent', user: 'admin@company.com', timestamp: '2 min ago', status: 'review' },
  { id: '2', action: 'Created ServiceNow ticket', agent: 'IncidentClassifier', user: 'system', timestamp: '5 min ago', status: 'success' },
  { id: '3', action: 'Attempted to access restricted data', agent: 'DataAgent', user: 'system', timestamp: '12 min ago', status: 'blocked' },
  { id: '4', action: 'Applied auto-resolution to INC0012340', agent: 'ResolutionAgent', user: 'system', timestamp: '15 min ago', status: 'success' },
  { id: '5', action: 'Updated incident priority', agent: 'EscalationAgent', user: 'john.doe@company.com', timestamp: '20 min ago', status: 'success' },
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

export function GovernancePanel() {
  const [policyStates, setPolicyStates] = useState<Record<string, boolean>>(
    policies.reduce((acc, p) => ({ ...acc, [p.id]: p.enabled }), {})
  );

  const togglePolicy = (id: string) => {
    setPolicyStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Policies */}
      <div className="col-span-2 glass-panel">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Governance Policies</h3>
            <p className="text-sm text-muted-foreground">Guardrails, boundaries, and controls</p>
          </div>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </div>

        <div className="divide-y divide-border">
          {policies.map((policy) => {
            const Icon = typeIcons[policy.type];
            const isEnabled = policyStates[policy.id];
            
            return (
              <div key={policy.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", typeColors[policy.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{policy.name}</h4>
                        <Badge variant="muted" className="text-[10px]">{policy.type.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Applied to:</span>
                        {policy.appliedTo.map((agent, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{agent}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
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
            );
          })}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-panel">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Audit Logs</h3>
            <p className="text-sm text-muted-foreground">Recent agent activities</p>
          </div>
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant={
                    log.status === 'success' ? 'success' : 
                    log.status === 'blocked' ? 'critical' : 'warning'
                  }
                  className="text-[10px]"
                >
                  {log.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{log.timestamp}</span>
              </div>
              <p className="text-sm text-foreground mb-1">{log.action}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-primary">{log.agent}</span>
                <span>{log.user}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            View All Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
