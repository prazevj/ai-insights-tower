import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardSection } from '@/components/sections/DashboardSection';
import { EvaluationSection } from '@/components/sections/EvaluationSection';
import { ObservabilitySection } from '@/components/sections/ObservabilitySection';
import { PromptStudio } from '@/components/prompts/PromptStudio';
import { GovernancePanel } from '@/components/governance/GovernancePanel';
import { MCPIntegrations } from '@/components/integrations/MCPIntegrations';
import { InsightsTower } from '@/components/dashboard/InsightsTower';

const sectionConfig: Record<string, { title: string; subtitle: string }> = {
  'dashboard': { title: 'Dashboard', subtitle: 'Real-time observability overview' },
  'observability': { title: 'Observability', subtitle: 'Traces, logs, and service health monitoring' },
  'insights-tower': { title: 'AI InsightsTower', subtitle: 'Meta-agent self-improvement system' },
  'evaluation': { title: 'Evaluation Metrics', subtitle: 'Multi-layer performance analysis' },
  'prompts': { title: 'Prompt Studio', subtitle: 'Manage and test agent prompts' },
  'governance': { title: 'Agent Governance', subtitle: 'Policies, guardrails, and audit' },
  'integrations': { title: 'MCP Integrations', subtitle: 'IT Service Management connections' },
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const config = sectionConfig[activeSection];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'observability':
        return <ObservabilitySection />;
      case 'insights-tower':
        return (
          <div className="max-w-2xl">
            <InsightsTower />
          </div>
        );
      case 'evaluation':
        return <EvaluationSection />;
      case 'prompts':
        return <PromptStudio />;
      case 'governance':
        return <GovernancePanel />;
      case 'integrations':
        return <MCPIntegrations />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={config.title} subtitle={config.subtitle} />
        
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="animate-fade-in">
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
