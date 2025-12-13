import { useState } from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Plug, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'insights';
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'observability', label: 'Observability', icon: <Eye className="w-5 h-5" />, badge: 'LIVE', badgeVariant: 'success' },
  { id: 'insights-tower', label: 'AI InsightsTower', icon: <Brain className="w-5 h-5" />, badge: 'META', badgeVariant: 'insights' },
  { id: 'evaluation', label: 'Evaluation Metrics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'prompts', label: 'Prompt Studio', icon: <MessageSquare className="w-5 h-5" />, badge: '12', badgeVariant: 'default' },
  { id: 'governance', label: 'Agent Governance', icon: <Shield className="w-5 h-5" /> },
  { id: 'azure', label: 'Azure Integration', icon: <Zap className="w-5 h-5" />, badge: 'NEW', badgeVariant: 'insights' },
  { id: 'integrations', label: 'MCP Integrations', icon: <Plug className="w-5 h-5" />, badge: '3', badgeVariant: 'success' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">AgentOps</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "nav-item w-full",
              activeSection === item.id && "nav-item-active"
            )}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant={item.badgeVariant} className="text-[10px] px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Status Indicator */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent",
          collapsed && "justify-center"
        )}>
          <div className="status-dot status-healthy" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">All Systems Operational</p>
              <p className="text-[10px] text-muted-foreground">47 agents active</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <button className={cn(
          "nav-item w-full",
          collapsed && "justify-center"
        )}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
