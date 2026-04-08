'use client';

import { Suspense } from 'react';
import { DFSDynamicMenu } from '@/components/DFSDynamicMenu';
import { KairosDashboard } from '@/components/KairosDashboard';

export default function AgentsKairosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DFSDynamicMenu userRole="admin" currentPath="/dashboard/agents/kairos" />
      <div className="pt-20">
        <Suspense fallback={<div className="p-6">Loading KAIROS...</div>}>
          <KairosDashboard sessionId="default" />
        </Suspense>
      </div>
    </div>
  );
}
