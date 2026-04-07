export const dynamic = 'force-dynamic';

import { OpenTasksWidget } from '../../components/dashboard/OpenTasksWidget';
import { PendingApprovalsWidget } from '../../components/dashboard/PendingApprovalsWidget';
import { ConnectorRunsWidget } from '../../components/dashboard/ConnectorRunsWidget';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { SupabaseStatusCard } from '../../components/system/SupabaseStatusCard';
import { listApprovals } from '../../lib/services/approvals';
import { listConnectorRuns } from '../../lib/services/connector-runs';
import { listTasks } from '../../lib/services/tasks';

export default async function DashboardPage() {
  const [{ tasks, source: taskSource, error: taskError }, { approvals, source: approvalSource }, { runs, source: runSource }] = await Promise.all([
    listTasks(),
    listApprovals(),
    listConnectorRuns(),
  ]);

  const source = [taskSource, approvalSource, runSource].includes('supabase') ? 'supabase' : 'mock';

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Command center for workers, approvals, workflows, and key outcomes.</p>
      <div style={{ display: 'grid', gap: 24 }}>
        <SupabaseStatusCard />
        <DataSourceNotice source={source} entityLabel="Dashboard widgets" error={taskError} />
        <OpenTasksWidget tasks={tasks} />
        <PendingApprovalsWidget approvals={approvals} />
        <ConnectorRunsWidget runs={runs} />
      </div>
    </main>
  );
}
