import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 20 }}>
        <h2>AAW</h2>
        <nav style={{ display: 'grid', gap: 8 }}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/org/setup">Org Setup</Link>
          <Link href="/workers">Workers</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/approvals">Approvals</Link>
          <Link href="/knowledge">Knowledge</Link>
          <Link href="/voice">Voice</Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
