# 03. Components

## Component roles

| Component | Role |
| --- | --- |
| `apps/web` | Provides the user interface for login, lead inbox, lead detail, and follow-up activity logging |
| `apps/api` | Exposes HTTP endpoints, enforces validation, handles authentication, and coordinates persistence |
| Prisma | Maps the application domain to the relational database and keeps data access structured |
| PostgreSQL | Stores users, leads, and lead activity history |
| Swagger | Provides local API inspection and helps demonstrate the backend during review |

## Frontend responsibilities

The frontend is responsible for:

- rendering the main user workflows
- managing route transitions
- fetching lead data from the API
- submitting login, status updates, and activity creation requests
- presenting loading, empty, and error states

## Backend responsibilities

The backend is responsible for:

- authenticating the salesperson
- protecting private routes
- validating request payloads
- returning lead data in a shape the UI can consume
- writing lead activity history to persistent storage

## Data ownership

| Concern | Owning layer |
| --- | --- |
| UI state | frontend |
| business validation | backend |
| persistence | backend plus database |
| authentication token issuance | backend |
| lead and activity history | database |
