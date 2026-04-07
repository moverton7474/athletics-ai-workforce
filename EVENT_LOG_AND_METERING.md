# EVENT_LOG_AND_METERING.md

## Purpose
Use an append-oriented event log to support audit, observability, billing, and analytics.

## Event Types
- worker created
- worker updated
- thread started
- message sent
- task created
- task status changed
- workflow started/completed
- approval requested/decided
- connector run started/completed
- external action attempted/executed

## Required Fields
- event id
- organization id
- actor type/id
- target type/id
- action
- metadata
- created_at

## Why this matters
A strong event model powers:
- billing/metering
- audit trails
- admin timelines
- analytics dashboards
- replay/reconstruction later

## MVP recommendation
Capture the core events from day one even if analytics usage is basic at first.
