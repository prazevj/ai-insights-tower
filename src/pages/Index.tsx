import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardSection } from '@/components/sections/DashboardSection';
import { EvaluationSection } from '@/components/sections/EvaluationSection';
import { ObservabilitySection } from '@/components/sections/ObservabilitySection';
import { PromptStudio } from '@/components/prompts/PromptStudio';
import { GovernancePanel } from '@/components/governance/GovernancePanel';
import { MCPIntegrations } from '@/components/integrations/MCPIntegrations';
import { AzureIntegration } from '@/components/integrations/AzureIntegration';
import { MultiCloudDashboard } from '@/components/integrations/MultiCloudDashboard';
import { InsightsTower } from '@/components/dashboard/InsightsTower';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { PageVisibilityProvider } from '@/contexts/PageVisibilityContext';

const sectionConfig: Record<string, { title: string; subtitle: string }> = {
  'dashboard': { title: 'Dashboard', subtitle: 'Real-time observability overview' },
  'observability': { title: 'Observability', subtitle: 'Traces, logs, and service health monitoring' },
  'insights-tower': { title: 'AI InsightsTower', subtitle: 'Meta-agent self-improvement system' },
  'evaluation': { title: 'Evaluation Metrics', subtitle: 'Multi-layer performance analysis' },
  'prompts': { title: 'Prompt Studio', subtitle: 'Manage and test agent prompts' },
  'governance': { title: 'Agent Governance', subtitle: 'Policies, guardrails, and audit' },
  'azure': { title: 'Azure Integration', subtitle: 'AKS clusters, observability pipeline, and remote evaluation' },
  'multi-cloud': { title: 'Multi-Cloud Dashboard', subtitle: 'Unified view across Azure, AWS, and GCP' },
  'integrations': { title: 'MCP Integrations', subtitle: 'IT Service Management connections' },
  'settings': { title: 'Settings', subtitle: 'Configure navigation and preferences' },
};

const IndexContent = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const config = sectionConfig[activeSection] || sectionConfig['dashboard'];

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
      case 'azure':
        return <AzureIntegration />;
      case 'multi-cloud':
        return <MultiCloudDashboard />;
      case 'integrations':
        return <MCPIntegrations />;
      case 'settings':
        return <SettingsPanel />;
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

const Index = () => {
  return (
    <PageVisibilityProvider>
      <IndexContent />
    </PageVisibilityProvider>
  );
};

export default Index;
