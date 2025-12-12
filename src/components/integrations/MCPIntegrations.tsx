import { Plug, CheckCircle, AlertCircle, Clock, ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  eventsProcessed: number;
  type: 'ticketing' | 'monitoring' | 'communication';
}

const integrations: Integration[] = [
  { 
    id: '1', 
    name: 'ServiceNow', 
    description: 'IT Service Management Platform',
    logo: '🎫',
    status: 'connected', 
    lastSync: '2 min ago',
    eventsProcessed: 12450,
    type: 'ticketing'
  },
  { 
    id: '2', 
    name: 'Jira Service Management', 
    description: 'Atlassian ITSM Solution',
    logo: '📋',
    status: 'connected', 
    lastSync: '5 min ago',
    eventsProcessed: 8320,
    type: 'ticketing'
  },
  { 
    id: '3', 
    name: 'PagerDuty', 
    description: 'Incident Response Platform',
    logo: '🚨',
    status: 'syncing', 
    lastSync: 'Syncing...',
    eventsProcessed: 3240,
    type: 'monitoring'
  },
  { 
    id: '4', 
    name: 'Zendesk', 
    description: 'Customer Service Platform',
    logo: '💬',
    status: 'disconnected', 
    lastSync: '1 day ago',
    eventsProcessed: 0,
    type: 'ticketing'
  },
  { 
    id: '5', 
    name: 'Slack', 
    description: 'Team Communication',
    logo: '💼',
    status: 'connected', 
    lastSync: '1 min ago',
    eventsProcessed: 45200,
    type: 'communication'
  },
  { 
    id: '6', 
    name: 'Microsoft Teams', 
    description: 'Collaboration Platform',
    logo: '👥',
    status: 'connected', 
    lastSync: '3 min ago',
    eventsProcessed: 28100,
    type: 'communication'
  },
];

const statusConfig = {
  connected: { label: 'Connected', icon: CheckCircle, color: 'text-success', badge: 'success' as const },
  disconnected: { label: 'Disconnected', icon: AlertCircle, color: 'text-destructive', badge: 'critical' as const },
  syncing: { label: 'Syncing', icon: RefreshCw, color: 'text-warning', badge: 'warning' as const },
};

export function MCPIntegrations() {
  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalEvents = integrations.reduce((sum, i) => sum + i.eventsProcessed, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plug className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{connectedCount}</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{totalEvents.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Events Processed</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">99.8%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <RefreshCw className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">Syncing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="glass-panel">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">MCP Tool Integrations</h3>
            <p className="text-sm text-muted-foreground">Connect with IT Service Management tools</p>
          </div>
          <Button variant="glow" size="sm">
            <Plug className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          {integrations.map((integration) => {
            const config = statusConfig[integration.status];
            const StatusIcon = config.icon;
            
            return (
              <div 
                key={integration.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:border-primary/30",
                  integration.status === 'connected' ? 'border-success/30 bg-success/5' :
                  integration.status === 'syncing' ? 'border-warning/30 bg-warning/5' :
                  'border-border bg-card'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.logo}</div>
                    <div>
                      <h4 className="font-medium text-foreground">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Badge variant={config.badge} className="flex items-center gap-1">
                    <StatusIcon className={cn("w-3 h-3", integration.status === 'syncing' && "animate-spin")} />
                    {config.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <span>Last sync: </span>
                    <span className="text-foreground">{integration.lastSync}</span>
                  </div>
                  {integration.status === 'connected' && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-mono text-primary">{integration.eventsProcessed.toLocaleString()}</span>
                      <span> events</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {integration.status === 'disconnected' ? (
                    <Button variant="outline" size="sm" className="flex-1">
                      Connect
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
