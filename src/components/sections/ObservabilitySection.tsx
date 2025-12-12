import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TraceViewer } from '@/components/observability/TraceViewer';
import { LogStream } from '@/components/observability/LogStream';
import { ServiceHealth } from '@/components/observability/ServiceHealth';
import { Activity, Layers, FileText, Heart } from 'lucide-react';

export function ObservabilitySection() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="health" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
            <Heart className="w-4 h-4" />
            Service Health
          </TabsTrigger>
          <TabsTrigger value="traces" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
            <Layers className="w-4 h-4" />
            Traces
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
            <FileText className="w-4 h-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <ServiceHealth />
        </TabsContent>

        <TabsContent value="traces" className="mt-6">
          <TraceViewer />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <LogStream />
        </TabsContent>
      </Tabs>
    </div>
  );
}
