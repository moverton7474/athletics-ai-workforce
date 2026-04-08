import Link from 'next/link';
import { getWorkerWorkspaceContent } from '../../data/mock-worker-workspace';
import type { WorkerDTO, WorkerTab } from '../../lib/types';

const tabHref: Record<WorkerTab, (workerId: string) => string> = {
  chat: (workerId) => `/workers/${workerId}`,
  outputs: (workerId) => `/workers/${workerId}/outputs`,
  guidelines: (workerId) => `/workers/${workerId}/guidelines`,
  settings: (workerId) => `/workers/${workerId}/settings`,
};

const tabLabel: Record<WorkerTab, string> = {
  chat: 'Chat',
  outputs: 'Outputs',
  guidelines: 'Guidelines',
  settings: 'Settings',
};

export function WorkerWorkspaceShell({
  worker,
  activeTab,
  children,
}: {
  worker: WorkerDTO;
  activeTab: WorkerTab;
  children: React.ReactNode;
}) {
  const content = getWorkerWorkspaceContent(worker);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Link href="/workers">← Back to workers</Link>
          <div>
            <h1 style={{ margin: 0 }}>{worker.name}</h1>
            <p style={{ margin: '8px 0 0 0' }}>{worker.roleName}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Mode: {worker.mode}</span>
            <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Status: {worker.status}</span>
          </div>
        </div>
        <section style={{ maxWidth: 520, border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Mission</h2>
          <p style={{ margin: 0 }}>{content.mission}</p>
        </section>
      </div>

      <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {worker.tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Link
              key={tab}
              href={tabHref[tab](worker.id)}
              style={{
                border: '1px solid #ddd',
                borderRadius: 999,
                padding: '8px 14px',
                textDecoration: 'none',
                background: isActive ? '#111' : '#fff',
                color: isActive ? '#fff' : '#111',
              }}
            >
              {tabLabel[tab]}
            </Link>
          );
        })}
      </nav>

      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>{children}</div>
        <aside style={{ display: 'grid', gap: 16 }}>
          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
            <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
              {content.quickActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </section>
          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Workspace Model</h2>
            <p style={{ margin: '0 0 8px 0' }}>
              {worker.mode === 'shared'
                ? 'This worker is shared across the organization and should support collaborative operating workflows.'
                : 'This worker is personal and should optimize for focused support to the assigned operator.'}
            </p>
            <p style={{ margin: 0 }}>Use this workspace to keep outputs, guidelines, and settings organized around the worker rather than scattered across the app.</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
