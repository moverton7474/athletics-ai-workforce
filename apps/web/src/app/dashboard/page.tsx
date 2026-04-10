export const dynamic = 'force-dynamic';

import { OpenTasksWidget } from '../../components/dashboard/OpenTasksWidget';
import { PendingApprovalsWidget } from '../../components/dashboard/PendingApprovalsWidget';
import { ConnectorRunsWidget } from '../../components/dashboard/ConnectorRunsWidget';
import { CampaignDraftApprovalWidget } from '../../components/dashboard/CampaignDraftApprovalWidget';
import { MemoryRelationshipWidget } from '../../components/dashboard/MemoryRelationshipWidget';
import { PinnedMemoryWidget } from '../../components/dashboard/PinnedMemoryWidget';
import { RecentMemoryWidget } from '../../components/dashboard/RecentMemoryWidget';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { SupabaseStatusCard } from '../../components/system/SupabaseStatusCard';
import { listApprovals } from '../../lib/services/approvals';
import { listConnectorRuns } from '../../lib/services/connector-runs';
import { listMemoryEntries } from '../../lib/services/memory';
import { listCampaignDraftRecords } from '../../lib/services/route-state';
import { listTasks } from '../../lib/services/tasks';
import { listWorkers } from '../../lib/services/workers';

export default async function DashboardPage() {
  const [
    { tasks, source: taskSource, error: taskError },
    { approvals, source: approvalSource },
    { runs, source: runSource },
    { entries: memoryEntries, source: memorySource },
    { drafts, source: draftSource },
    { workers },
  ] = await Promise.all([listTasks(), listApprovals(), listConnectorRuns(), listMemoryEntries(), listCampaignDraftRecords(), listWorkers()]);

  const source = [taskSource, approvalSource, runSource, memorySource, draftSource].includes('supabase') ? 'supabase' : 'mock';
  const queuedApprovalsCount = approvals.filter((approval) => approval.status === 'pending').length;
  const nextActionsCount = tasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled').length;
  const recentMemoryCount = memoryEntries.length;
  const activeWorkersCount = workers.filter((worker) => worker.status === 'active').length;
  const awaitingApprovalRunsCount = runs.filter((run) => run.status === 'awaiting_approval').length;
  const pinnedMemoryCount = memoryEntries.filter((entry) => entry.pinned).length;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24, background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 240px)' }}>
      <section
        style={{
          borderRadius: 24,
          padding: 24,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #312e81 100%)',
          color: '#fff',
          display: 'grid',
          gap: 18,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: 780, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.08)' }}>Operator command center</span>
              <span style={{ border: '1px solid rgba(197,165,114,0.35)', borderRadius: 999, padding: '6px 12px', background: 'rgba(197,165,114,0.14)', color: '#f5deb3' }}>Governed workflow shell</span>
            </div>
            <div>
              <h1 style={{ margin: 0, marginBottom: 8 }}>Dashboard</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
                Command center for approvals, workflow orchestration, worker accountability, continuity coverage, and the latest connector outcomes.
              </p>
            </div>
          </div>
          <div style={{ maxWidth: 360, border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, padding: 16, background: 'rgba(255,255,255,0.06)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18 }}>Operator focus</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)' }}>
              Keep ownership visible, surface blocked approvals early, and make continuity gaps easy to resolve before work stalls.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {[
            { label: 'Queued approvals', value: queuedApprovalsCount, tone: '#fbbf24' },
            { label: 'Next actions', value: nextActionsCount, tone: '#93c5fd' },
            { label: 'Active workers', value: activeWorkersCount, tone: '#86efac' },
            { label: 'Connector runs awaiting approval', value: awaitingApprovalRunsCount, tone: '#fca5a5' },
            { label: 'Pinned memory', value: pinnedMemoryCount, tone: '#f5deb3' },
            { label: 'Recent memory entries', value: recentMemoryCount, tone: '#c4b5fd' },
          ].map((item) => (
            <article key={item.label} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 16, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ color: item.tone, fontSize: 28, fontWeight: 700 }}>{item.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.82)' }}>{item.label}</div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gap: 24 }}>
        <SupabaseStatusCard />
        <DataSourceNotice source={source} entityLabel="Dashboard widgets" error={taskError} />

        <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.2fr 0.8fr' }}>
          <OpenTasksWidget tasks={tasks} />
          <PendingApprovalsWidget approvals={approvals} />
        </section>

        <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
          <CampaignDraftApprovalWidget drafts={drafts} />
          <ConnectorRunsWidget runs={runs} approvals={approvals} tasks={tasks} />
        </section>

        <MemoryRelationshipWidget entries={memoryEntries} tasks={tasks} approvals={approvals} workers={workers} />

        <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
          <PinnedMemoryWidget entries={memoryEntries} workers={workers} />
          <RecentMemoryWidget entries={memoryEntries} workers={workers} />
        </section>
      </div>
    </main>
  );
}
