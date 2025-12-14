import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePageVisibility } from '@/contexts/PageVisibilityContext';
import { 
  LayoutDashboard, 
  Eye, 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap, 
  Cloud,
  Plug,
  Settings
} from 'lucide-react';

const pageConfig: Array<{
  id: string;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}> = [
  { id: 'dashboard', label: 'Dashboard', description: 'Real-time observability overview', icon: LayoutDashboard },
  { id: 'observability', label: 'Observability', description: 'Traces, logs, and service health', icon: Eye, badge: 'LIVE' },
  { id: 'insights-tower', label: 'AI InsightsTower', description: 'Meta-agent self-improvement system', icon: Brain, badge: 'META' },
  { id: 'evaluation', label: 'Evaluation Metrics', description: 'Multi-layer performance analysis', icon: BarChart3 },
  { id: 'prompts', label: 'Prompt Studio', description: 'Manage and test agent prompts', icon: MessageSquare },
  { id: 'governance', label: 'Agent Governance', description: 'Policies, guardrails, and audit', icon: Shield },
  { id: 'azure', label: 'Azure Integration', description: 'AKS clusters and observability pipeline', icon: Zap, badge: 'NEW' },
  { id: 'multi-cloud', label: 'Multi-Cloud Dashboard', description: 'Unified view across Azure, AWS, GCP', icon: Cloud, badge: 'NEW' },
  { id: 'integrations', label: 'MCP Integrations', description: 'IT Service Management connections', icon: Plug },
];

export function SettingsPanel() {
  const { visibility, toggleVisibility } = usePageVisibility();

  const enabledCount = Object.values(visibility).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Navigation Visibility
          </CardTitle>
          <CardDescription>
            Control which pages appear in the sidebar navigation. Disabled pages won't be visible in the menu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">Pages enabled</span>
            <Badge variant="outline" className="font-mono">
              {enabledCount} / {pageConfig.length}
            </Badge>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            {pageConfig.map((page) => {
              const Icon = page.icon;
              const isEnabled = visibility[page.id as keyof typeof visibility];
              
              return (
                <div 
                  key={page.id} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isEnabled ? 'bg-muted/20' : 'bg-muted/5 opacity-60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={page.id} className="font-medium cursor-pointer">
                          {page.label}
                        </Label>
                        {page.badge && (
                          <Badge variant={page.badge === 'NEW' ? 'insights' : page.badge === 'LIVE' ? 'success' : 'default'} className="text-[10px] px-1.5">
                            {page.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{page.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={page.id}
                    checked={isEnabled}
                    onCheckedChange={() => toggleVisibility(page.id as keyof typeof visibility)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button 
            onClick={() => pageConfig.forEach(p => {
              if (!visibility[p.id as keyof typeof visibility]) {
                toggleVisibility(p.id as keyof typeof visibility);
              }
            })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors"
          >
            Enable all pages
          </button>
          <button 
            onClick={() => pageConfig.forEach(p => {
              if (visibility[p.id as keyof typeof visibility] && p.id !== 'dashboard') {
                toggleVisibility(p.id as keyof typeof visibility);
              }
            })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-muted-foreground"
          >
            Show only Dashboard
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
