# Sales Lead Management Tool

Interview challenge monorepo for a lightweight sales lead management tool.

## Documentation

- [Project Brief](./PROJECT_BRIEF.md)
- [Design Direction](./DESIGN.md)
- [System Design Index](./docs/system-design/README.md)
- [System Design: Overview](./docs/system-design/01-overview.md)
- [System Design: Architecture Diagram](./docs/system-design/02-architecture-diagram.md)
- [System Design: Components](./docs/system-design/03-components.md)
- [System Design: Data Flow](./docs/system-design/04-data-flow.md)
- [System Design: Technology Decisions](./docs/system-design/05-technology-decisions.md)
- [System Design: Observability](./docs/system-design/06-observability.md)
- [System Design: GenAI Design Usage](./docs/system-design/07-genai-design-usage.md)

## Stack

- Frontend: React, Vite, TypeScript, Ant Design, React Router, MobX, TanStack Query, React Hook Form, Zod
- Backend: NestJS, Prisma, PostgreSQL, Passport JWT, Swagger
- Local infrastructure: Docker Compose + PostgreSQL 15
- Monorepo: workspace-based repo with root-level scripts

## Current implementation snapshot

- Auth: `/login`, JWT sign-in, session restore via `/api/auth/me`
- App shell: protected layout with sidebar, topbar search, and route guards
- Lead inbox: search, status/source filters, sorting, pagination, row selection
- Lead detail: contact summary, inquiry block, timeline, status update, assignee update, activity logging, archive
- Lead creation: `/leads/new` form with validation and assignment support
- Supporting backend surfaces: Swagger, `/api/health`, standardized success and error envelopes
- Demo data: seeded salesperson accounts plus a larger lead dataset for inbox browsing
- Demo credentials: `admin@leadstream.com` / `Password123!`

## Project structure

```txt
apps/
  api/   # NestJS API + Prisma
  web/   # React frontend
package.json
README.md
```

## Requirements

- Node.js 20.19+
- npm 10+
- Docker Desktop with Docker Compose support

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env files:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. Start PostgreSQL in Docker:

   ```bash
   npm run db:up
   ```

   This starts PostgreSQL on `localhost:5434` using:
   - database: `keyloop_sales_leads`
   - username: `postgres`
   - password: `postgres`

4. Generate Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate:dev
   cd apps/api && npm run prisma:seed
   ```

5. Start both apps:

   ```bash
   npm run dev
   ```

## Useful scripts

- `npm run dev` runs frontend and backend together
- `npm run dev:web` runs only the Vite app
- `npm run dev:api` runs only the Nest API
- `npm run build` builds both apps
- `npm run lint` runs lint in both apps
- `npm run db:up` starts the Docker PostgreSQL service
- `npm run db:down` stops the Docker PostgreSQL service
- `npm run db:logs` tails the PostgreSQL container logs
- `npm run prisma:studio` opens Prisma Studio
- `cd apps/api && npm run prisma:seed` seeds demo users and leads

## Default local URLs

- Web: `http://localhost:5173`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`
- Health: `http://localhost:3000/api/health`
