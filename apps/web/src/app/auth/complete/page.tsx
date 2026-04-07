import { CompleteAuthSession } from '../../../components/auth/CompleteAuthSession';

export default function CompleteAuthSessionPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Complete sign in</h1>
      <CompleteAuthSession />
    </main>
  );
}
