import { ClaimDemoOrgButton } from '../../components/auth/ClaimDemoOrgButton';
import { EmailSignInForm } from '../../components/auth/EmailSignInForm';
import { getCurrentUserContext } from '../../lib/server/membership';

export default async function LoginPage() {
  const { user, memberships, authConfigured } = await getCurrentUserContext();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Sign in</h1>
      <p>Use email magic-link auth to start wiring real tenant membership into the workforce platform.</p>
      {!authConfigured ? <p>Supabase auth env vars are not configured for this runtime.</p> : null}
      {user ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <p>Signed in as {user.email ?? user.id}</p>
          <p>Memberships found: {memberships.length}</p>
          {!memberships.length ? <ClaimDemoOrgButton /> : null}
        </div>
      ) : (
        <EmailSignInForm />
      )}
    </main>
  );
}
