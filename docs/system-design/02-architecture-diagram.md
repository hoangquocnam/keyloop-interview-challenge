# 02. Architecture Diagram

## Diagram

```mermaid
flowchart LR
    Salesperson["Salesperson"]

    subgraph Client["Client Layer"]
        Web["Web App\nReact + Vite + TypeScript"]
        ClientState["MobX + Route Guards\nSession and UI state"]
        ServerState["TanStack Query + Services\nAPI requests and cache"]
    end

    subgraph Server["Application Layer"]
        API["API Server\nNestJS"]
        Auth["Auth Module\nJWT login and current-user"]
        Leads["Leads Module\nInbox, detail, create, activity,\nstatus, assignee, archive"]
        Users["Users Module\nAssignable sales users"]
        Common["Global Validation + Response Layer\nValidationPipe, exception filter,\nsuccess interceptor"]
        Docs["Swagger + Health Check"]
    end

    subgraph Data["Data Layer"]
        Prisma["Prisma ORM"]
        DB["PostgreSQL\nusers, leads, lead_activities"]
    end

    Salesperson -->|"Uses via browser"| Web
    Web --> ClientState
    Web --> ServerState
    ServerState -->|"HTTP / REST API\nBearer token on protected routes"| API
    API -->|"Authenticates current session"| Auth
    API -->|"Executes lead workflows"| Leads
    API -->|"Loads assignable users"| Users
    API -->|"Validates and shapes responses"| Common
    API -->|"Exposes local API docs and service visibility"| Docs
    API -->|"Queries and mutations"| Prisma
    Prisma -->|"Read / write persistent data"| DB
```

## What the diagram shows

The architecture is intentionally simple and centered around a single user-facing workflow.

- The salesperson uses the web application in the browser.
- The web application is the only client and communicates with the backend over HTTP.
- The NestJS API owns authentication, request validation, response shaping, and the lead workflow.
- Prisma acts as the API's data access layer.
- PostgreSQL is the system of record for users, leads, and follow-up activities.
- The frontend separates client and workflow state from server-state fetching.

## Reading guide

1. The `Client Layer` contains the browser-based web application used by the salesperson.
2. The `Application Layer` contains the backend service and its core responsibilities.
3. The `Data Layer` contains the ORM and relational database used for persistence.
4. The main runtime path is:
   `Salesperson -> Web App -> API Server -> Prisma -> PostgreSQL`
5. The main frontend control path is:
   `Web App -> MobX / Route Guards -> Query Hooks / Services -> API`

## Why this level of detail is appropriate

- This challenge does not need a distributed or event-driven architecture.
- A single frontend, a single backend, and a single database are enough for the MVP.
- The diagram still highlights the most important concerns: user entry point, API boundary, authentication, business logic, and persistent storage.

## Design note

Swagger and the health endpoint are shown as supporting backend capabilities rather than separate runtime services.

That keeps the diagram aligned with the real implementation while still making observability and API inspection visible in the system design.
