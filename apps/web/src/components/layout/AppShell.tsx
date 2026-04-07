import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCurrentUserContext } from '../../lib/server/membership';

export async function AppShell({ children }: { children: ReactNode }) {
  const { user, memberships, authConfigured } = await getCurrentUserContext();
  const roles = memberships.map((membership: any) => membership.role);
  const isPrivileged = roles.some((role: string) => ['owner', 'admin', 'operator'].includes(role));
  const hasMembership = memberships.length > 0;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', show: true },
    { href: '/org/setup', label: 'Org Setup', show: isPrivileged },
    { href: '/workers', label: 'Workers', show: hasMembership || !user },
    { href: '/tasks', label: 'Tasks', show: hasMembership || !user },
    { href: '/approvals', label: 'Approvals', show: isPrivileged },
    { href: '/knowledge', label: 'Knowledge', show: true },
    { href: '/voice', label: 'Voice', show: true },
    { href: '/connector-runs', label: 'Connector Runs', show: hasMembership || isPrivileged },
    { href: '/login', label: user ? 'Account' : 'Sign In', show: true },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #ddd', padding: 20, display: 'grid', gap: 20 }}>
        <div>
          <h2>AAW</h2>
          <nav style={{ display: 'grid', gap: 8 }}>
            {navItems.filter((item) => item.show).map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
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
              <p style={{ marginBottom: 8 }}>Memberships: {memberships.length}</p>
              {roles.length ? <p style={{ marginBottom: 8 }}>Highest access: {isPrivileged ? 'privileged member' : 'collaborator member'}</p> : null}
              {memberships.length ? (
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {memberships.map((membership: any, index: number) => (
                    <li key={`${membership.organization?.id ?? 'org'}-${index}`}>
                      {membership.organization?.name ?? 'Organization'} — {membership.role}
                    </li>
                  ))}
                </ul>
              ) : null}
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
