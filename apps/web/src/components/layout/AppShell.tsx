import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCurrentUserContext } from '../../lib/server/membership';

export async function AppShell({ children }: { children: ReactNode }) {
  const { user, memberships, authConfigured } = await getCurrentUserContext();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 20, display: 'grid', gap: 20 }}>
        <div>
          <h2>AAW</h2>
          <nav style={{ display: 'grid', gap: 8 }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/org/setup">Org Setup</Link>
            <Link href="/workers">Workers</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/approvals">Approvals</Link>
            <Link href="/knowledge">Knowledge</Link>
            <Link href="/voice">Voice</Link>
            <Link href="/login">Sign In</Link>
          </nav>
        </div>

        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Auth Status</h3>
          <p style={{ marginBottom: 8 }}>
            {authConfigured ? 'Supabase auth configured.' : 'Supabase auth not configured yet.'}
          </p>
          {user ? (
            <>
              <p style={{ marginBottom: 8 }}>Signed in as {user.email ?? user.id}</p>
              <p style={{ margin: 0 }}>Memberships: {memberships.length}</p>
            </>
          ) : (
            <p style={{ margin: 0 }}>No active session.</p>
          )}
        </section>
      </aside>
      <div>{children}</div>
    </div>
  );
}
