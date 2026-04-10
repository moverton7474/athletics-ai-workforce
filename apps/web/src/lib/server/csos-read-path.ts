import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DEMO_ORGANIZATION_ID } from '../constants';
import { invokeCsosAdapter } from './csos-adapter';

const execFileAsync = promisify(execFile);

export async function loadCsosSponsorshipPipelineRead() {
  const cliBin = process.env.CSOS_CLI_BIN || 'csos';

  try {
    const { stdout } = await execFileAsync(cliBin, ['reporting', 'run', '--report', 'sponsorship-pipeline', '--json']);
    const output = stdout ? JSON.parse(stdout) : {};
    return {
      ok: true,
      source: 'csos-adapter' as const,
      mode: 'direct-read' as const,
      organizationId: DEMO_ORGANIZATION_ID,
      summary: 'CSOS sponsorship pipeline loaded through the adapter read path.',
      output,
    };
  } catch {
    const adapterResponse = await invokeCsosAdapter({
      organizationId: DEMO_ORGANIZATION_ID,
      action: 'sponsorship.pipeline',
      entity: {
        type: 'segment',
        name: 'CSOS Sponsorship Pipeline',
      },
      input: {
        report: 'sponsorship-pipeline',
      },
    });

    const output = adapterResponse.output ?? {
      opportunities: [
        { sponsor: 'Acme Roofing', stage: 'proposal', value: 25000, owner: 'Sponsorship Intelligence', note: 'Stub CSOS pipeline opportunity.' },
        { sponsor: 'North Metro Bank', stage: 'prospecting', value: 18000, owner: 'Chief of Staff', note: 'Stub CSOS pipeline opportunity.' },
      ],
    };

    return {
      ok: adapterResponse.ok,
      source: adapterResponse.source,
      mode: adapterResponse.mode,
      organizationId: DEMO_ORGANIZATION_ID,
      summary: adapterResponse.summary,
      output,
    };
  }
}
