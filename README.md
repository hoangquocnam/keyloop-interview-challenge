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

- Frontend: React, Vite, TypeScript, Ant Design, React Router, MobX, TanStack Query
- Backend: NestJS, Prisma, PostgreSQL
- Package management: npm workspaces

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
- PostgreSQL running locally

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

3. Create the database in local PostgreSQL:

   ```bash
   createdb keyloop_sales_leads
   ```

4. Generate Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate:dev -- --name init
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
- `npm run prisma:studio` opens Prisma Studio

## Default local URLs

- Web: `http://localhost:5173`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`
