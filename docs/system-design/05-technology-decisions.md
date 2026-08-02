# 05. Technology Decisions

## Chosen technologies

| Technology | Role | Why it was chosen |
| --- | --- | --- |
| React | frontend UI library | widely used, strong component model, good fit for interview expectations |
| Vite | frontend tooling | fast local development, minimal setup, lightweight compared with heavier application frameworks |
| TypeScript | shared language across FE and BE | improves maintainability and reduces ambiguity in API and domain modeling |
| React Router | frontend routing | sufficient for a small multi-page internal tool |
| TanStack Query | server-state management | keeps API loading and mutation flows structured without adding heavy global state |
| NestJS | backend framework | clear module, controller, and service structure that is easy to explain in a system design review |
| Prisma | ORM and schema management | fast iteration, clear schema definition, and strong local developer experience |
| PostgreSQL | relational database | reliable fit for structured entities such as users, leads, and activity logs |
| Swagger | API documentation | useful for review, local testing, and backend visibility during implementation |
| npm workspaces | repo organization | keeps the monorepo lightweight without adding Turbo or Nx complexity |

## Why not a heavier setup

The project intentionally avoids:

- microservices
- event-driven infrastructure
- advanced caching layers
- monorepo orchestration frameworks
- heavy admin platforms

These would increase setup cost without adding meaningful value for this challenge.

## Architectural tradeoff

The chosen stack favors:

- speed of delivery
- readability
- interview clarity
- enough realism to demonstrate sound engineering decisions
