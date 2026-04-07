# CSOS_CONNECTOR_SPEC.md

## Purpose
The CSOS Connector allows athletics-ai-workforce agents to safely trigger athletics-specific workflows through the existing KSU CSOS system.

## Design Principle
Agents should not hold raw CSOS service credentials directly. The connector service should mediate all CSOS interactions.

## Phase 1 Execution Mode
### CLI Adapter
Execute CSOS commands as subprocess calls and parse machine-readable JSON output.

**Examples:**
- `csos sponsor attrition --json`
- `csos sponsor match-alumni --category roofing --json`
- `csos proposal create --company ...`

## Phase 2 Execution Mode
### Direct API / RPC Adapter
Use the same Supabase/PostgREST and RPC access patterns exposed by CSOS for higher-performance or lower-latency workflows.

## Connector Responsibilities
- execute approved CSOS commands
- capture stdout/stderr
- parse JSON results
- normalize outputs into task/workflow records
- log all command runs
- handle retries and errors
- enforce permission boundaries

## Example Workflow
### Sponsor Recovery
1. Sponsorship Intelligence Agent requests attrition analysis.
2. Connector executes `csos sponsor attrition --json`.
3. Result is normalized into a workflow record.
4. Alumni matching step is triggered.
5. Proposal/Outreach Agent uses proposal creation actions.
6. Chief of Staff / Executive Assistant synthesizes next actions.

## Security Requirements
- CSOS credentials stored only in connector backend env/secrets manager
- role-based access to connector actions
- full audit log for each connector run
- approval gate before external outbound actions where appropriate

## Connector Output Model
Each run should capture:
- run id
- org id
- initiating agent id
- command template
- raw input
- normalized input
- raw output
- normalized output
- status
- started_at
- finished_at
- error metadata
