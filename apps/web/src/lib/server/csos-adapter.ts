import { getCsosServerClient, getCsosServerCredentials } from './csos-server';

export type CsosAdapterAction =
  | 'constituents.search'
  | 'constituents.profile'
  | 'opportunities.list'
  | 'proposals.generate'
  | 'proposals.approve'
  | 'proposals.send'
  | 'sponsorship.pipeline'
  | 'sponsorship.proposals'
  | 'reporting.dashboard'
  | 'sync.salesforce.status'
  | 'sync.salesforce.run'
  | 'ticketing.prospects.segment'
  | 'ticketing.renewal_risk.list'
  | 'ticketing.outreach.compose';

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

  if (mode === 'edge-function' && request.action === 'ticketing.outreach.compose') {
    const credentials = getCsosServerCredentials();

    if (!credentials) {
      return {
        ok: false,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'error',
        summary: 'CSOS edge-function mode is configured, but no server credentials are available.',
        output: null,
        error: 'Missing CSOS server-side credentials.',
      };
    }

    const campaignId = typeof request.input?.campaignId === 'string' ? request.input.campaignId : undefined;
    const constituentIds = Array.isArray(request.input?.constituentIds)
      ? request.input?.constituentIds.filter((value): value is string => typeof value === 'string' && value.length > 0)
      : [];
    const channel = typeof request.input?.channel === 'string' ? request.input.channel : 'email';
    const touchType = typeof request.input?.touchType === 'string' ? request.input.touchType : 'initial_outreach';

    if (!campaignId || !constituentIds.length) {
      return {
        ok: false,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'error',
        summary: 'Outreach compose requires a CSOS campaign id and at least one constituent id.',
        output: null,
        error: 'Missing campaign or constituent context.',
      };
    }

    try {
      const response = await fetch(`${credentials.url}/functions/v1/ticket_outreach`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credentials.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'compose',
          campaign_id: campaignId,
          constituent_ids: constituentIds,
          channel,
          touch_type: touchType,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          ok: false,
          source: 'csos-adapter',
          mode,
          action: request.action,
          status: 'error',
          summary: 'CSOS outreach compose failed.',
          output: null,
          error: payload?.error ?? payload?.message ?? `HTTP ${response.status}`,
        };
      }

      return {
        ok: true,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'success',
        summary: `CSOS outreach draft composed for ${constituentIds.length} constituent(s).`,
        output: {
          draft: payload?.preview ?? payload ?? null,
        },
        error: null,
      };
    } catch (error: any) {
      return {
        ok: false,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'error',
        summary: 'CSOS outreach compose request failed.',
        output: null,
        error: error?.message ?? 'Unknown edge-function error.',
      };
    }
  }

  if (mode === 'direct-read') {
    const client = getCsosServerClient();

    if (!client) {
      return {
        ok: false,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'error',
        summary: 'CSOS direct-read mode is configured, but no server client is available.',
        output: null,
        error: 'Missing CSOS server-side credentials.',
      };
    }

    try {
      if (request.action === 'ticketing.renewal_risk.list') {
        const sport = typeof request.input?.sport === 'string' ? request.input.sport : undefined;
        const riskLevel = typeof request.input?.riskLevel === 'string' ? request.input.riskLevel : 'high';
        const limit = typeof request.input?.limit === 'number' ? request.input.limit : 100;

        const { data, error } = await client
          .from('scores')
          .select('renewal_risk, ticket_propensity, as_of_date, constituent:constituent_master(id, first_name, last_name, email, phone, sport_affinity, is_ticket_holder, lifetime_ticket_spend)')
          .eq('renewal_risk', riskLevel)
          .order('as_of_date', { ascending: false })
          .limit(limit * 3);

        if (error) {
          return {
            ok: false,
            source: 'csos-adapter',
            mode,
            action: request.action,
            status: 'error',
            summary: 'Failed to load renewal-risk cohort from CSOS.',
            output: null,
            error: error.message,
          };
        }

        const grouped = new Map<string, any>();
        for (const row of data ?? []) {
          const constituent = (row as any).constituent;
          const key = constituent?.id;
          if (!key) {
            continue;
          }
          if (sport && constituent.sport_affinity !== sport) {
            continue;
          }
          if (!grouped.has(key)) {
            grouped.set(key, {
              id: constituent.id,
              firstName: constituent.first_name,
              lastName: constituent.last_name,
              email: constituent.email,
              phone: constituent.phone,
              sportAffinity: constituent.sport_affinity,
              isTicketHolder: constituent.is_ticket_holder,
              lifetimeTicketSpend: constituent.lifetime_ticket_spend,
              renewalRisk: (row as any).renewal_risk,
              ticketPropensity: (row as any).ticket_propensity,
            });
          }
        }

        const constituents = Array.from(grouped.values()).slice(0, limit);

        return {
          ok: true,
          source: 'csos-adapter',
          mode,
          action: request.action,
          status: 'success',
          summary: `Loaded ${constituents.length} ${sport ?? 'all-sport'} renewal-risk constituent(s) from CSOS.`,
          output: {
            cohort: {
              label: sport ? `${sport[0].toUpperCase()}${sport.slice(1)} renewal-risk cohort` : 'Renewal-risk cohort',
              summary: 'CSOS-backed renewal-risk cohort returned through the athletics adapter.',
              audienceCount: constituents.length,
              sourceType: 'csos_query',
            },
            constituents,
          },
          error: null,
        };
      }

      if (request.action === 'constituents.search') {
        const queryText = typeof request.input?.query === 'string' ? request.input.query.trim() : '';
        const limit = typeof request.input?.limit === 'number' ? request.input.limit : 25;

        if (!queryText) {
          return {
            ok: false,
            source: 'csos-adapter',
            mode,
            action: request.action,
            status: 'error',
            summary: 'Constituent search requires a query string.',
            output: null,
            error: 'Missing query string.',
          };
        }

        const { data, error } = await client
          .from('constituent_master')
          .select('id, first_name, last_name, email, phone, sport_affinity, is_ticket_holder, lifetime_ticket_spend')
          .or(`first_name.ilike.%${queryText}%,last_name.ilike.%${queryText}%,email.ilike.%${queryText}%,phone.ilike.%${queryText}%`)
          .order('last_name', { ascending: true })
          .limit(limit);

        if (error) {
          return {
            ok: false,
            source: 'csos-adapter',
            mode,
            action: request.action,
            status: 'error',
            summary: 'Failed to search constituents in CSOS.',
            output: null,
            error: error.message,
          };
        }

        const matches = (data ?? []).map((row: any) => ({
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone,
          sportAffinity: row.sport_affinity,
          isTicketHolder: row.is_ticket_holder,
          lifetimeTicketSpend: row.lifetime_ticket_spend,
        }));

        return {
          ok: true,
          source: 'csos-adapter',
          mode,
          action: request.action,
          status: 'success',
          summary: `Found ${matches.length} constituent match(es) in CSOS for "${queryText}".`,
          output: {
            matches,
          },
          error: null,
        };
      }

      if (request.action === 'ticketing.prospects.segment') {
        let query = client
          .from('constituent_master')
          .select('id, first_name, last_name, email, phone, sport_affinity, is_ticket_holder, lifetime_ticket_spend, paciolan_account_id, scores!inner(ticket_propensity, renewal_risk, ask_readiness, as_of_date)')
          .order('created_at', { ascending: false })
          .limit(typeof request.input?.limit === 'number' ? request.input.limit : 100);

        if (typeof request.input?.sport === 'string') {
          query = query.eq('sport_affinity', request.input.sport);
        }
        if (typeof request.input?.isTicketHolder === 'boolean') {
          query = query.eq('is_ticket_holder', request.input.isTicketHolder);
        }
        if (typeof request.input?.hasPaciolan === 'boolean') {
          query = request.input.hasPaciolan ? query.not('paciolan_account_id', 'is', null) : query.is('paciolan_account_id', null);
        }

        const { data, error } = await query;
        if (error) {
          return {
            ok: false,
            source: 'csos-adapter',
            mode,
            action: request.action,
            status: 'error',
            summary: 'Failed to load segmented prospects from CSOS.',
            output: null,
            error: error.message,
          };
        }

        const minPropensity = typeof request.input?.minPropensity === 'number' ? request.input.minPropensity : 0;
        const maxPropensity = typeof request.input?.maxPropensity === 'number' ? request.input.maxPropensity : 100;
        const prospects = (data ?? [])
          .map((row: any) => {
            const latestScore = Array.isArray(row.scores)
              ? row.scores.sort((a: any, b: any) => b.as_of_date.localeCompare(a.as_of_date))[0]
              : row.scores;
            const propensity = latestScore?.ticket_propensity ?? 0;
            if (propensity < minPropensity || propensity > maxPropensity) {
              return null;
            }
            return {
              id: row.id,
              firstName: row.first_name,
              lastName: row.last_name,
              email: row.email,
              phone: row.phone,
              sportAffinity: row.sport_affinity,
              isTicketHolder: row.is_ticket_holder,
              lifetimeTicketSpend: row.lifetime_ticket_spend,
              propensity,
              renewalRisk: latestScore?.renewal_risk,
              askReadiness: latestScore?.ask_readiness,
            };
          })
          .filter((value) => !!value)
          .sort((a, b) => Number(b.propensity) - Number(a.propensity));

        return {
          ok: true,
          source: 'csos-adapter',
          mode,
          action: request.action,
          status: 'success',
          summary: `Loaded ${prospects.length} prospect(s) from CSOS ticket segmentation.`,
          output: {
            cohort: {
              label: 'Segmented ticket prospects',
              summary: 'CSOS-backed prospect cohort returned through the athletics adapter.',
              audienceCount: prospects.length,
              sourceType: 'csos_query',
            },
            prospects,
          },
          error: null,
        };
      }
    } catch (error: any) {
      return {
        ok: false,
        source: 'csos-adapter',
        mode,
        action: request.action,
        status: 'error',
        summary: `CSOS direct-read failed for ${request.action}.`,
        output: null,
        error: error?.message ?? 'Unknown adapter error.',
      };
    }
  }

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
