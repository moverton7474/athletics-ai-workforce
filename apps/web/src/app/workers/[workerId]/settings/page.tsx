import { getWorkerWorkspaceContent } from '../../../../data/mock-worker-workspace';
import { WorkerWorkspaceShell } from '../../../../components/workers/WorkerWorkspaceShell';
import { getWorkerWorkspaceSnapshot } from '../../../../lib/services/workers';

type WorkerSettingsPageProps = {
  params: Promise<{ workerId: string }>;
};

function getAutonomyPolicy(roleName: string, mode: 'shared' | 'personal') {
  if (roleName === 'Sponsorship Intelligence') {
    return {
      autonomyPosture: 'Recommend and prepare, but require human approval before external or proposal-stage actions.',
      confidenceThreshold: 'High confidence for autonomous prep; medium/high confidence still requires review before execution.',
      confirmationRule: 'Always require confirmation for proposal, outreach, or workflow actions that touch external systems or revenue workflows.',
      channelPolicy: 'Can prepare email, SMS, and voice workflow artifacts but should not launch them without review.',
      quietHours: 'Respect organizational quiet hours for outbound communications; internal prep work can continue.',
      auditPolicy: 'Connector-backed reasoning and decision rationale should be visible before action moves forward.',
    };
  }

  if (roleName === 'Executive Assistant') {
    return {
      autonomyPosture: 'Can package summaries, agendas, reminders, and prep drafts with lower risk, but should stay clearly in support mode.',
      confidenceThreshold: 'Medium confidence is acceptable for internal prep; external send or sensitive scheduling should remain human-confirmed.',
      confirmationRule: 'Require confirmation for outreach, calendar changes, or any action that appears to speak for the operator.',
      channelPolicy: 'Internal summaries and draft prep are allowed; outbound communication should stay operator-controlled.',
      quietHours: 'Respect personal quiet hours and daily digest windows before surfacing reminders.',
      auditPolicy: 'Show what was prepared, what was proposed, and whether anything moved into a shared workflow.',
    };
  }

  return {
    autonomyPosture: mode === 'shared'
      ? 'Can coordinate internal workflow movement and surface recommended next actions, but should remain governed on consequential steps.'
      : 'Can optimize for one operator’s support flow while keeping consequential work visible before it becomes team-facing.',
    confidenceThreshold: 'Medium confidence can assist internal prep; anything high-impact should surface with visible rationale first.',
    confirmationRule: 'Require confirmation for approvals, external communication, or cross-worker workflow transitions.',
    channelPolicy: 'Can prepare internal digests and governed workflow recommendations; external channel use should remain gated.',
    quietHours: 'Use quiet-hours-aware delivery windows for nudges, summaries, and reminders.',
    auditPolicy: 'Every meaningful recommendation should be traceable to a worker, a rationale, and a next owner.',
  };
}

export default async function WorkerSettingsPage({ params }: WorkerSettingsPageProps) {
  const { workerId } = await params;
  const { worker, snapshot } = await getWorkerWorkspaceSnapshot(workerId);

  if (!worker) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Worker Settings</h1>
        <p>Worker not found.</p>
      </main>
    );
  }

  const content = getWorkerWorkspaceContent(worker);
  const policy = getAutonomyPolicy(worker.roleName, worker.mode);

  return (
    <WorkerWorkspaceShell worker={worker} activeTab="settings" snapshot={snapshot}>
      <section style={{ display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Worker Settings</h2>
          <p style={{ margin: 0 }}>Assignment mode, autonomy posture, confidence thresholds, and communication guardrails should all be explicit here.</p>
        </div>

        <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Autonomy & trust posture</h3>
            <p style={{ margin: 0, color: '#555' }}>Make worker authority visible: what this worker can prepare, what needs confirmation, and what must always remain governed.</p>
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Ownership model</strong>
              <p style={{ margin: '8px 0 0 0' }}>{snapshot ? `${snapshot.ownershipLabel} · ${snapshot.accountabilityLabel}` : worker.mode}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Autonomy posture</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.autonomyPosture}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Confidence threshold</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.confidenceThreshold}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Confirmation rule</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.confirmationRule}</p>
            </article>
          </div>
        </section>

        <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Channel & delivery governance</h3>
            <p style={{ margin: 0, color: '#555' }}>Borrowing from the Visionary trust model, communication channels and timing should be governed rather than implied.</p>
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Channel policy</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.channelPolicy}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Quiet hours / timing</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.quietHours}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Audit visibility</strong>
              <p style={{ margin: '8px 0 0 0' }}>{policy.auditPolicy}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>Current workload context</strong>
              <p style={{ margin: '8px 0 0 0' }}>
                {snapshot
                  ? `${snapshot.openTaskCount} open tasks · ${snapshot.pendingApprovalCount} pending approvals · ${snapshot.linkedMemoryCount} linked memory threads`
                  : 'No live workload snapshot available.'}
              </p>
            </article>
          </div>
        </section>

        <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Worker mode policy</h3>
            <p style={{ margin: 0 }}>
              {worker.mode === 'shared'
                ? 'This worker should remain organization-visible, support team workflows, and avoid overfitting to one individual’s preferences.'
                : 'This worker should optimize for one operator, package context cleanly, and preserve a more focused support experience.'}
            </p>
          </div>
          <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
            {content.settings.map((item) => (
              <div key={item.label} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <dt style={{ fontWeight: 700 }}>{item.label}</dt>
                <dd style={{ margin: '6px 0 0 0' }}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </WorkerWorkspaceShell>
  );
}
