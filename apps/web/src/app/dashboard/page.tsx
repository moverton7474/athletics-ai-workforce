import { OpenTasksWidget } from '../../components/dashboard/OpenTasksWidget';
import { PendingApprovalsWidget } from '../../components/dashboard/PendingApprovalsWidget';
import { ConnectorRunsWidget } from '../../components/dashboard/ConnectorRunsWidget';

export default function DashboardPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Command center for workers, approvals, workflows, and key outcomes.</p>
      <div style={{ display: 'grid', gap: 24 }}>
        <OpenTasksWidget />
        <PendingApprovalsWidget />
        <ConnectorRunsWidget />
      </div>
    </main>
  );
}
