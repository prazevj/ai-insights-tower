import { useState } from 'react';
import { Play, History, GitBranch, Zap, Clock, Target, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromptVersion {
  id: string;
  version: string;
  agent: string;
  status: 'active' | 'testing' | 'archived';
  accuracy: number;
  tokenUsage: number;
  responseTime: string;
  lastModified: string;
}

const promptVersions: PromptVersion[] = [
  { id: '1', version: 'v2.4.1', agent: 'IncidentClassifier', status: 'active', accuracy: 94.2, tokenUsage: 1250, responseTime: '1.2s', lastModified: '2 hours ago' },
  { id: '2', version: 'v2.4.0', agent: 'IncidentClassifier', status: 'archived', accuracy: 91.8, tokenUsage: 1420, responseTime: '1.5s', lastModified: '1 day ago' },
  { id: '3', version: 'v1.8.3', agent: 'EscalationAgent', status: 'active', accuracy: 89.5, tokenUsage: 980, responseTime: '0.9s', lastModified: '3 hours ago' },
  { id: '4', version: 'v1.9.0-beta', agent: 'EscalationAgent', status: 'testing', accuracy: 92.1, tokenUsage: 1100, responseTime: '1.0s', lastModified: '30 min ago' },
  { id: '5', version: 'v3.1.0', agent: 'ResolutionAgent', status: 'active', accuracy: 96.8, tokenUsage: 2100, responseTime: '2.1s', lastModified: '5 hours ago' },
];

const aggregatedMetrics = {
  activePrompts: 12,
  avgAccuracy: 93.4,
  totalTokens: '2.4M',
  avgResponseTime: '1.4s'
};

export function PromptStudio() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Aggregated Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.activePrompts}</p>
              <p className="text-xs text-muted-foreground">Active Prompts</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.avgAccuracy}%</p>
              <p className="text-xs text-muted-foreground">Avg Accuracy</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.totalTokens}</p>
              <p className="text-xs text-muted-foreground">Token Usage (24h)</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">{aggregatedMetrics.avgResponseTime}</p>
              <p className="text-xs text-muted-foreground">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Prompt Versions */}
        <div className="glass-panel">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Prompt Versions</h3>
              <p className="text-sm text-muted-foreground">Manage and track prompt iterations</p>
            </div>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>

          <div className="divide-y divide-border">
            {promptVersions.map((prompt) => (
              <div 
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-muted/30",
                  selectedPrompt === prompt.id && "bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm text-foreground">{prompt.version}</span>
                    <Badge 
                      variant={
                        prompt.status === 'active' ? 'success' : 
                        prompt.status === 'testing' ? 'warning' : 'muted'
                      }
                    >
                      {prompt.status}
                    </Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{prompt.agent}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Accuracy: </span>
                    <span className="font-mono text-success">{prompt.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tokens: </span>
                    <span className="font-mono text-foreground">{prompt.tokenUsage}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed: </span>
                    <span className="font-mono text-foreground">{prompt.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playground */}
        <div className="glass-panel">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Prompt Playground</h3>
              <p className="text-sm text-muted-foreground">Test prompts against datasets</p>
            </div>
            <Button variant="glow" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Run Evaluation
            </Button>
          </div>

          <div className="p-4">
            {/* Prompt Editor */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground mb-2 block">System Prompt</label>
              <textarea 
                className="w-full h-32 p-3 rounded-lg bg-muted/50 border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Enter your system prompt here..."
                defaultValue="You are an IT incident classification agent. Analyze incoming tickets and categorize them based on severity, type, and affected services..."
              />
            </div>

            {/* Test Dataset */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Test Dataset</label>
              <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>ServiceNow Incidents (1000 samples)</option>
                <option>Historical P1 Incidents (500 samples)</option>
                <option>Network Issues Dataset (750 samples)</option>
                <option>Custom Dataset...</option>
              </select>
            </div>

            {/* Evaluation Config */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Model</label>
                <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>GPT-4o</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Gemini Pro</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Evaluation Type</label>
                <select className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Multi-Agent Workflow</option>
                  <option>Single Agent</option>
                  <option>A/B Comparison</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Last Evaluation Results</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-lg font-mono font-semibold text-success">94.2%</p>
                  <p className="text-[10px] text-muted-foreground">Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-foreground">1.2s</p>
                  <p className="text-[10px] text-muted-foreground">Latency</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-foreground">1,250</p>
                  <p className="text-[10px] text-muted-foreground">Tokens/req</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-semibold text-foreground">$0.02</p>
                  <p className="text-[10px] text-muted-foreground">Cost/req</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
