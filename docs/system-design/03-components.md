# 03. Components

## Purpose

This section gives a brief description of each major system component and explains its role in the overall architecture.

The system is intentionally small, so each component has a clear and focused responsibility.

## Component summary

| Component | Primary role | Why it exists |
| --- | --- | --- |
| `Salesperson` | end user of the system | interacts with the app to review leads and log follow-up actions |
| `apps/web` | frontend client application | provides the user interface and handles user interaction |
| `apps/api` | backend application server | exposes APIs, applies business rules, and protects data access |
| Prisma | data access layer | provides structured access from the API to the relational database |
| PostgreSQL | persistent storage | stores users, leads, and lead activity history |
| Swagger | API documentation surface | supports local inspection, backend review, and manual testing |

## Component descriptions

### Salesperson

The salesperson is the primary actor in the system.

This user needs to:

- sign in
- view the lead inbox
- open a lead detail page
- review prior follow-up history
- add a new follow-up activity
- update lead status

### `apps/web`

The web application is the presentation layer of the system.

Its role is to:

- render the login, inbox, and lead detail experiences
- manage routing between pages
- call backend APIs
- display loading, empty, success, and error states
- capture user input for login, status updates, and activity logging

The frontend does not own business validation or persistence. It acts as the interaction layer between the salesperson and the backend.

### `apps/api`

The API server is the core application layer.

Its role is to:

- authenticate the salesperson
- issue and validate JWT-based access
- validate incoming request payloads
- expose lead and activity endpoints
- enforce application rules
- coordinate persistence through Prisma

This component acts as the boundary between the UI and the database.

### Prisma

Prisma is the structured data access layer used by the backend.

Its role is to:

- map the domain model to relational database tables
- support typed data access from the API
- keep queries and mutations consistent
- manage schema evolution through Prisma schema and migrations

Prisma is not a business-logic layer. It exists to make persistence predictable and maintainable.

### PostgreSQL

PostgreSQL is the system of record.

Its role is to persist:

- salesperson accounts
- sales leads
- chronological follow-up activity history

This database gives the system durable storage for operational data and supports the core CRM-style workflow of the challenge.

### Swagger

Swagger is a supporting component for development and review.

Its role is to:

- document available API endpoints
- make backend behavior easier to inspect locally
- help demonstrate the API during the challenge review

Swagger is not part of the end-user workflow, but it improves clarity and maintainability during development.

## Responsibility boundaries

| Concern | Primary owner |
| --- | --- |
| user interaction | `apps/web` |
| page rendering and local UI state | `apps/web` |
| routing and API calls | `apps/web` |
| authentication and authorization checks | `apps/api` |
| request validation | `apps/api` |
| business rules | `apps/api` |
| data access orchestration | `apps/api` plus Prisma |
| persistent storage | PostgreSQL |
| API visibility for local review | Swagger |

## Why this split is appropriate

This separation keeps the architecture easy to reason about:

- the frontend focuses on experience and interaction
- the backend focuses on rules and data integrity
- the database focuses on persistence
- the ORM keeps data access structured without adding another unnecessary layer
