# 05. Technology Decisions

## Purpose

This section lists the main technologies chosen for the project, explains why they were selected, and summarizes the configuration approach used to keep the system lightweight and maintainable.

The overall goal was to choose tools that are:

- practical for a small interview challenge
- modern and familiar to reviewers
- fast to develop with
- easy to explain from an architectural point of view

## Technology summary

| Technology | Role | Why it was chosen |
| --- | --- | --- |
| React | frontend UI library | strong component model, widely understood, and well-suited to building a focused internal workflow UI |
| Vite | frontend build and dev tooling | very fast local startup, minimal configuration, and lower overhead than heavier app frameworks |
| TypeScript | type system across frontend and backend | improves maintainability, makes API contracts clearer, and reduces ambiguity in the domain model |
| Ant Design | frontend component library | speeds up delivery of internal-tool UI patterns such as tables, forms, badges, descriptions, notifications, and layout primitives |
| MobX | client and business state management | provides a lightweight observable state model that is easy to scale for workflow and UI state without heavy Redux-style boilerplate |
| mobx-persist-store | lightweight persisted UI and auth state | keeps session and shell state stable across refreshes without building a custom persistence layer |
| React Router | frontend routing | sufficient for a small multi-page application with login, inbox, and lead detail routes |
| TanStack Query | server-state management | keeps API reads and writes predictable while allowing MobX to stay focused on client and business state |
| React Hook Form + Zod | form state and validation | keeps forms efficient and type-aware while centralizing field validation rules |
| NestJS | backend framework | provides a clean controller-service-module structure that is easy to explain and extend |
| Prisma | ORM and schema management | gives a clear schema definition, typed queries, and a smooth local development workflow |
| PostgreSQL | relational database | a good fit for structured entities and relationships such as users, leads, and lead activities |
| Passport JWT + bcryptjs | authentication | provides a straightforward local authentication story for login and protected routes |
| Swagger | API documentation | helps with local inspection, manual testing, and interview demonstration of backend behavior |
| Docker Compose | local database runtime | makes PostgreSQL bootstrapping consistent for interview review and local development |
| workspace root scripts | monorepo organization | keeps the repository simple without introducing Turbo, Nx, or additional monorepo orchestration complexity |

## Frontend decisions and configuration

### React

React was selected because the application is UI-driven and benefits from a component-based structure.

Configuration approach:

- functional components only
- route-based page structure
- separation between pages, services, and theme configuration
- no unnecessary abstraction in the first version

### Vite

Vite was chosen for fast iteration and minimal setup.

Configuration approach:

- standard Vite React TypeScript template
- keep build configuration close to defaults
- avoid extra plugins unless there is a clear need

This supports fast local development and keeps the build story easy to explain.

### TypeScript

TypeScript was chosen to keep both layers aligned around a single typed language.

Configuration approach:

- strict TypeScript usage
- avoid `any`
- use explicit types for request and response shapes
- keep domain entities and API payloads easy to read

### Ant Design

Ant Design was chosen over a more custom UI approach because this project is an internal productivity tool.

It fits the challenge well because it already provides strong patterns for:

- data tables
- forms
- status tags
- drawers and detail panels
- notifications
- descriptive read-only data layouts

Configuration approach:

- centralize visual rules through a single theme configuration
- define typography, color, spacing, and border decisions through tokens
- wrap repeated UI usage through a small local component layer where helpful
- use a monochrome base theme with semantic success, error, warning, and info colors
- rely on Ant Design primitives rather than building custom components too early

### MobX

MobX was chosen for frontend state management because the product is workflow-driven and is likely to need more than route-local UI state as the inbox and detail experiences grow.

It fits the project well because it supports:

- lightweight observable state
- clear domain-oriented stores
- minimal boilerplate
- incremental adoption without forcing a large architecture up front

Configuration approach:

- keep a root store at the application level
- separate client and business state from server-fetched state
- use MobX for UI and workflow state such as auth session state, filters, selected lead context, and local interaction state
- add more focused stores only when the feature set actually requires them

### React Hook Form and Zod

These were chosen because the current app already contains multiple form workflows:

- login
- create lead
- activity logging
- lead edits

Configuration approach:

- React Hook Form manages field registration and submission lifecycle
- Zod provides schema-based validation with readable error messages
- resolver integration keeps form validation close to the input contract

### React Router

React Router was chosen because the navigation model is simple and page-based.

Configuration approach:

- browser routing
- root application shell
- separate routes for login, dashboard, lead inbox, create lead, and lead detail

### TanStack Query

TanStack Query was chosen specifically for API-driven server state, not as the primary client state layer.

Configuration approach:

- use query keys for lead list, lead detail, and auth-aware server state
- keep retries modest
- disable unnecessary refetch noise where appropriate
- let server responses remain the source of truth after mutations

This keeps concerns clean:

- MobX manages client and business state
- TanStack Query manages server reads, caching, and mutation flows

## Backend decisions and configuration

### NestJS

NestJS was chosen because it gives the backend a clear and familiar application structure.

Configuration approach:

- module-based organization
- controller-service separation
- global validation pipe
- global success-response interceptor
- global exception filter
- global API prefix
- CORS configured for the frontend origin

This is enough structure to demonstrate backend discipline without making the API feel overbuilt.

### Prisma

Prisma was chosen because the domain is relational and well-defined.

Configuration approach:

- define the core data model in a single Prisma schema
- use migrations for database evolution
- generate typed client access for backend usage
- keep persistence logic explicit and close to the backend domain
- use enum-backed fields for status, source, preferred contact method, and activity type

### PostgreSQL

PostgreSQL was chosen because the system works with structured operational data.

It is a good fit for:

- user accounts
- lead records
- activity history with timestamps
- future filtering and reporting needs

Configuration approach:

- local PostgreSQL instance for development
- environment-based connection string
- relational model with indexes on likely query paths such as status, assignee, archive flag, and timestamps

### Passport JWT and bcryptjs

These were chosen because the challenge only needs a simple but real authentication layer.

Configuration approach:

- email and password login
- bcrypt hash comparison in the auth service
- JWT bearer token returned after login
- JWT guard protecting `/api/auth/me`, `/api/users`, and `/api/leads` routes

### Swagger

Swagger was chosen to make backend behavior visible and easy to test.

Configuration approach:

- expose local API documentation through the NestJS Swagger module
- keep endpoint visibility available during development and review
- advertise bearer auth in the generated docs

### Docker Compose

Docker Compose is used only for local database infrastructure.

Configuration approach:

- one PostgreSQL service
- stable port mapping for local development
- persistent named volume
- no containerization requirement for the frontend or backend app processes

## Repository and environment decisions

### Workspace root scripts

Root-level workspace scripts were chosen to keep the fullstack project in one repository without adding monorepo framework overhead.

Configuration approach:

- `apps/web` for the frontend
- `apps/api` for the backend
- root-level scripts for dev, build, and lint
- shared dependency management through a single install flow

### Environment configuration

The environment strategy is intentionally simple.

Configuration approach:

- use `.env.example` files per app
- keep database URL, API URL, JWT secret, and web origin configurable
- keep demo bootstrapping simple through Docker Compose and Prisma seed scripts
- optimize for local reproducibility rather than complex deployment automation

## Why these choices fit the challenge

The selected technologies support the core goals of the challenge:

- deliver a polished frontend quickly
- keep the backend realistic but lightweight
- preserve clean architectural boundaries
- make the implementation easy to review

## Why not a heavier setup

The project intentionally avoids:

- microservices
- event-driven infrastructure
- advanced caching layers
- Docker-first orchestration as a requirement
- monorepo orchestration frameworks such as Turbo or Nx
- heavy state management frameworks

These would increase setup and explanation cost without adding proportional value for the interview scope.

## Final tradeoff

The chosen stack favors:

- speed of delivery
- code readability
- maintainability
- clear architectural communication
- enough realism to show sound engineering judgment without unnecessary complexity
