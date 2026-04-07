# CONNECTOR_RUN_MODEL.md

## Purpose
Define the normalized record shape for all connector executions.

## Core fields
- id
- organization_id
- connector_name
- worker_id
- command_template_id
- input payload
- output payload
- raw stdout/stderr references (later)
- status
- error_text
- started_at
- completed_at

## Lifecycle
1. run requested
2. policy checked
3. approval checked if needed
4. connector execution started
5. output normalized
6. task/workflow updated
7. event emitted

## Status values
- queued
- running
- success
- failed
- blocked
- awaiting_approval

## Why this matters
Connector runs are the bridge between:
- worker intent
- system execution
- auditability
- analytics/billing
