export type CsosAdapterAction =
  | 'constituents.search'
  | 'opportunities.list'
  | 'proposals.generate'
  | 'proposals.approve'
  | 'proposals.send'
  | 'sponsorship.pipeline'
  | 'sponsorship.proposals'
  | 'reporting.dashboard'
  | 'sync.salesforce.status'
  | 'sync.salesforce.run';

export type CsosAdapterMode = 'stub' | 'edge-function' | 'direct-read';

export type CsosAdapterEntity = {
  type: string;
  name: string;
};

export type CsosAdapterRequest = {
  organizationId: string;
  approvalId?: string;
  action: CsosAdapterAction;
  entity?: CsosAdapterEntity;
  input?: Record<string, unknown>;
  requestedBy?: {
    userId: string;
    role?: string;
  };
};

export type CsosAdapterResponse = {
  ok: boolean;
  source: 'csos-adapter';
  mode: CsosAdapterMode;
  action: CsosAdapterAction;
  status: 'success' | 'queued' | 'error';
  summary: string;
  output?: Record<string, unknown> | null;
  error?: string | null;
};

export function getCsosAdapterMode(): CsosAdapterMode {
  if (process.env.CSOS_ADAPTER_USE_EDGE_FUNCTIONS === 'true') {
    return 'edge-function';
  }

  if (process.env.CSOS_ADAPTER_USE_DIRECT_READS === 'true') {
    return 'direct-read';
  }

  return 'stub';
}

export async function invokeCsosAdapter(request: CsosAdapterRequest): Promise<CsosAdapterResponse> {
  const mode = getCsosAdapterMode();

  if (mode === 'stub') {
    return {
      ok: true,
      source: 'csos-adapter',
      mode,
      action: request.action,
      status: 'queued',
      summary: `CSOS adapter stub accepted ${request.action}.`,
      output: {
        stub: true,
        entity: request.entity ?? null,
        input: request.input ?? {},
      },
      error: null,
    };
  }

  return {
    ok: false,
    source: 'csos-adapter',
    mode,
    action: request.action,
    status: 'error',
    summary: `CSOS adapter mode ${mode} is not implemented yet.`,
    output: null,
    error: `Adapter mode ${mode} requires implementation wiring.`,
  };
}

export function buildProposalSendRequest(input: {
  organizationId: string;
  approvalId: string;
  company: string;
  requestedByUserId: string;
  requestedByRole?: string;
}) {
  return {
    organizationId: input.organizationId,
    approvalId: input.approvalId,
    action: 'proposals.send' as const,
    entity: {
      type: 'proposal',
      name: input.company,
    },
    input: {
      company: input.company,
    },
    requestedBy: {
      userId: input.requestedByUserId,
      role: input.requestedByRole,
    },
  };
}
