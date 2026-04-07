export const dynamic = 'force-dynamic';

import { ConnectorRunsList } from '../../components/connector/ConnectorRunsList';

export default function ConnectorRunsPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Connector Runs</h1>
      <p>Detailed history of connector executions and their latest summaries.</p>
      <ConnectorRunsList />
    </main>
  );
}
