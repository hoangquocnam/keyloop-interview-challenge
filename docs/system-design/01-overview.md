# 01. Overview

## Purpose

This document set describes the system design for the Sales Lead Management Tool interview challenge.

The target system is a lightweight internal web application that helps dealership salespeople manage incoming website leads, review lead details, and log follow-up activity.

## Scope

The initial version is intentionally small and focused.

### Included in scope

- authenticated salesperson access
- lead inbox view
- lead detail view
- activity timeline
- activity logging
- lead status updates
- PostgreSQL-backed persistence

### Out of scope for the first version

- advanced role management
- realtime updates
- complex analytics
- multi-team workflow orchestration

## High-level system shape

The application is designed as a simple web client and API server backed by PostgreSQL.

| Layer | Responsibility |
| --- | --- |
| `apps/web` | user interface, routing, MobX client state, TanStack Query data fetching, interaction handling |
| `apps/api` | authentication, lead workflows, users API, validation, response shaping, persistence orchestration |
| PostgreSQL | durable storage for users, leads, and follow-up activities |

## Current implementation snapshot

As of the current repository state:

- the frontend has working routes for login, lead inbox, create lead, and lead detail
- the app shell already includes route guards, sidebar navigation, and topbar search
- the backend already exposes `auth`, `leads`, `users`, Swagger, and `health`
- the dashboard route exists but is still a placeholder
- request ID tracing and structured request logging are still planned, not yet implemented

## Design priorities

- keep the architecture easy to explain in an interview setting
- prefer simple and maintainable boundaries
- keep frontend and backend responsibilities clearly separated
- support realistic local development without heavy platform setup
