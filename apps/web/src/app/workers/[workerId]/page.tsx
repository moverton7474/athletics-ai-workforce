import { getWorkerWorkspaceContent } from '../../../data/mock-worker-workspace';
import { MemoryCaptureForm } from '../../../components/memory/MemoryCaptureForm';
import { WorkerContinuityPanel } from '../../../components/workers/WorkerContinuityPanel';
import { WorkerWorkspaceShell } from '../../../components/workers/WorkerWorkspaceShell';
import { listApprovals } from '../../../lib/services/approvals';
import { listMemoryEntriesForWorker } from '../../../lib/services/memory';
import { listTasks } from '../../../lib/services/tasks';
import { getWorkerById } from '../../../lib/services/workers';

type WorkerPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerDetailPage({ params }: WorkerPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  if (!worker) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Worker Workspace</h1>
        <p>Worker not found.</p>
      </main>
    );
  }

  const content = getWorkerWorkspaceContent(worker);
  const [{ tasks }, { approvals }, { entries: memoryEntries }] = await Promise.all([
    listTasks(),
    listApprovals(),
    listMemoryEntriesForWorker(worker.id),
  ]);

  const workerTasks = tasks.filter((task) => task.workerId === worker.id).slice(0, 4);
  const workerApprovals = approvals
    .filter((approval) => approval.taskId && workerTasks.some((task) => task.id === approval.taskId))
    .slice(0, 4);

  return (
    <WorkerWorkspaceShell worker={worker} activeTab="chat">
      <section style={{ display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Chat Workspace</h2>
          <p style={{ margin: 0 }}>
            This is the conversational operating surface for {worker.name}. The next iteration should connect this panel to real worker threads,
            but the shell now reflects the intended workspace model.
          </p>
        </div>
        <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Suggested prompts</h3>
          <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
            {content.quickActions.map((action) => (
              <li key={action}>"{action}"</li>
            ))}
          </ul>
        </section>
        <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Current focus</h3>
          <p style={{ marginBottom: 0 }}>
            {worker.roleName === 'Sponsorship Intelligence'
              ? 'Use this workspace to analyze sponsor signals, package proposal recommendations, and surface approval-worthy actions.'
              : worker.roleName === 'Chief of Staff'
                ? 'Use this workspace to coordinate cross-team execution, summarize priorities, and keep leadership aligned on next actions.'
                : 'Use this workspace to turn role-specific context into organized, reviewable work.'}
          </p>
        </section>
        <WorkerContinuityPanel
          worker={worker}
          tasks={workerTasks}
          approvals={workerApprovals}
          memoryEntries={memoryEntries}
        />
        <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Capture Worker Memory</h3>
            <p style={{ margin: 0 }}>
              Save handoffs, signals, and operator notes directly against {worker.name} so continuity can be captured inside the workspace where the work happens.
            </p>
          </div>
          <MemoryCaptureForm
            workers={[{ id: worker.id, name: worker.name, roleName: worker.roleName }]}
            tasks={workerTasks.map((task) => ({ id: task.id, title: task.title }))}
            approvals={workerApprovals.map((approval) => ({ id: approval.id, title: approval.title }))}
            initialWorkerId={worker.id}
            lockWorker
          />
        </section>
      </section>
    </WorkerWorkspaceShell>
  );
}
