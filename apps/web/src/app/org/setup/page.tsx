import { OrgProfileForm } from '../../../components/org/OrgProfileForm';

export default function OrgSetupPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Organization Setup</h1>
      <p>Capture the org profile that drives worker generation and behavior.</p>
      <OrgProfileForm />
    </main>
  );
}
