export const dynamic = 'force-dynamic';

import { OpenTasksWidget } from '../../components/dashboard/OpenTasksWidget';
import { PendingApprovalsWidget } from '../../components/dashboard/PendingApprovalsWidget';
import { ConnectorRunsWidget } from '../../components/dashboard/ConnectorRunsWidget';
import { RecentMemoryWidget } from '../../components/dashboard/RecentMemoryWidget';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { SupabaseStatusCard } from '../../components/system/SupabaseStatusCard';
import { listApprovals } from '../../lib/services/approvals';
import { listConnectorRuns } from '../../lib/services/connector-runs';
import { listMemoryEntries } from '../../lib/services/memory';
import { listTasks } from '../../lib/services/tasks';
import { listWorkers } from '../../lib/services/workers';

export default async function DashboardPage() {
  const [
    { tasks, source: taskSource, error: taskError },
    { approvals, source: approvalSource },
    { runs, source: runSource },
    { entries: memoryEntries, source: memorySource },
    { workers },
  ] = await Promise.all([listTasks(), listApprovals(), listConnectorRuns(), listMemoryEntries(), listWorkers()]);

  const source = [taskSource, approvalSource, runSource, memorySource].includes('supabase') ? 'supabase' : 'mock';
  const queuedApprovalsCount = approvals.filter((approval) => approval.status === 'pending').length;
  const nextActionsCount = tasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled').length;
  const recentMemoryCount = memoryEntries.length;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Command center for approvals, workflow orchestration, and the latest connector outcomes.</p>
      <div style={{ display: 'grid', gap: 24 }}>
        <SupabaseStatusCard />
        <DataSourceNotice source={source} entityLabel="Dashboard widgets" error={taskError} />
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Workflow Snapshot</h2>
          <p style={{ marginBottom: 6 }}>Queued approvals: {queuedApprovalsCount}</p>
          <p style={{ marginBottom: 6 }}>Next actions: {nextActionsCount}</p>
          <p style={{ marginBottom: 0 }}>Recent memory entries: {recentMemoryCount}</p>
        </section>
        <OpenTasksWidget tasks={tasks} />
        <PendingApprovalsWidget approvals={approvals} />
        <RecentMemoryWidget entries={memoryEntries} workers={workers} />
        <ConnectorRunsWidget runs={runs} />
      </div>
    </main>
  );
}
