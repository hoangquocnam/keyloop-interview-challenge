# 04. Data Flow

## Purpose

This section explains how data moves through the system during the main user workflows.

The goal is to show:

- where data enters the system
- how the frontend and backend interact
- where validation happens
- when data is read from or written to the database

## High-level flow pattern

Most workflows follow the same pattern:

1. The salesperson performs an action in the web app.
2. The web app sends an HTTP request to the API.
3. The API authenticates and validates the request.
4. The API reads from or writes to PostgreSQL through Prisma.
5. The API returns a response payload.
6. The web app updates the visible UI state.

## Flow 1: Authentication

### Trigger

The salesperson submits login credentials from the login page.

### Request path

1. The web app sends the credentials to `POST /api/auth/login`.
2. The API validates the email and password against stored user data.
3. If authentication succeeds, the API returns:
   - a JWT access token
   - the current user payload
4. The web app stores the token and attaches it to future protected requests.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | email and password |
| API -> Database | read user record |
| API -> Client | JWT token and current user data |

## Flow 2: Session restore

### Trigger

The salesperson refreshes the page or reopens the app with a stored access token.

### Request path

1. The frontend restores local auth state and checks for the stored access token.
2. The web app sends `GET /api/auth/me`.
3. The API validates the bearer token through the JWT guard.
4. The API reloads the current user from PostgreSQL.
5. The web app either restores the session or clears it if the token is invalid.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | current-user request with bearer token |
| API -> Database | user lookup by token subject |
| API -> Client | authenticated user payload |

## Flow 3: Lead inbox retrieval

### Trigger

The salesperson opens the lead inbox page or changes a search, filter, sort, or pagination control.

### Request path

1. The web app sends `GET /api/leads`.
2. The API validates the JWT and authorizes the request.
3. The API applies query rules such as search, filtering, sorting, and pagination.
4. The API queries PostgreSQL through Prisma for lead summary data.
5. The API returns a list of leads to the frontend.
6. The web app renders the inbox and applies loading, empty, or error states as needed.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | authenticated lead list request with query params |
| API -> Database | read lead summary records |
| API -> Client | lead inbox payload |

## Flow 4: Lead detail retrieval

### Trigger

The salesperson selects a lead from the inbox.

### Request path

1. The web app sends `GET /api/leads/:leadId`.
2. The API validates the JWT and the requested lead identifier.
3. The API loads:
   - the lead record
   - related follow-up activities
   - associated user references such as the assigned salesperson or activity author
4. The API shapes the response so the frontend can render the detail workspace.
5. The web app displays the lead summary and chronological activity history.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | authenticated lead detail request |
| API -> Database | read one lead and related activity rows |
| API -> Client | lead detail payload with history |

## Flow 5: Lead creation

### Trigger

The salesperson submits the new-lead form from `/leads/new`.

### Request path

1. The web app sends `POST /api/leads`.
2. The API validates the JWT and the lead-creation payload.
3. The API creates the lead row and a first system timeline item.
4. The API returns the newly created lead detail payload.
5. The web app invalidates the inbox query and navigates to the new lead detail page.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | new lead payload |
| API -> Database | insert lead row and initial activity row |
| API -> Client | newly created lead detail payload |

## Flow 6: Activity logging

### Trigger

The salesperson submits a new follow-up activity from the lead detail page.

### Request path

1. The web app sends `POST /api/leads/:leadId/activities`.
2. The API validates:
   - the JWT
   - the lead identifier
   - the activity payload such as activity type and note
3. The API writes a new `lead_activity` record through Prisma.
4. The API generates the activity timestamp on the server.
5. The API returns the created timeline item.
6. The web app updates the activity timeline and shows success or error feedback.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | new activity payload |
| API -> Database | insert activity row |
| API -> Client | created timeline item |

## Flow 7: Lead status update

### Trigger

The salesperson changes the current lead status from the UI.

### Request path

1. The web app sends `PATCH /api/leads/:leadId/status`.
2. The API validates the JWT, lead identifier, and next status value.
3. The API updates the lead row and creates a system timeline item in one transaction.
4. The API returns the updated status and the optional timeline item.
5. The web app refreshes the visible status state in the inbox and detail view.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | status update request |
| API -> Database | update lead row and insert system activity row |
| API -> Client | updated status payload |

## Flow 8: Assignee update

### Trigger

The salesperson changes the assigned owner from the lead detail page.

### Request path

1. The web app requests assignable users from `GET /api/users`.
2. The salesperson selects an assignee and the web app sends `PATCH /api/leads/:leadId/assignee`.
3. The API validates the user, lead, and assignee.
4. The API updates the lead owner and creates a system timeline item when the assignee changed.
5. The web app updates the detail view and inbox row.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | users list request, then assignee update request |
| API -> Database | read users, update lead owner, insert optional activity row |
| API -> Client | users list and assignee update payload |

## Flow 9: Lead archive

### Trigger

The salesperson archives a lead from the detail page.

### Request path

1. The web app sends `PATCH /api/leads/:leadId/archive`.
2. The API validates the JWT and lead identifier.
3. The API applies a soft archive by setting `archivedAt`.
4. The API returns the archived lead identifier and timestamp.
5. The web app navigates back to the inbox and refreshes the visible dataset.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | archive request |
| API -> Database | update lead row with archive timestamp |
| API -> Client | archive confirmation payload |

## Validation and trust boundaries

The system uses a clear trust boundary:

- the frontend can collect and display data
- the backend is responsible for validating and accepting data
- the database stores only the data that has passed backend validation

This means the frontend improves usability, but the backend remains the final source of truth for:

- authentication
- input validation
- business rules
- persistence

## Response contract note

The current backend wraps successful responses in a standardized envelope:

- `success`
- `statusCode`
- `data`

Error responses are also normalized through a global exception filter.

This keeps frontend parsing predictable even though the system is still lightweight.

## Consistency model for the MVP

The application uses a straightforward request-response consistency model.

- read requests return the latest committed state from PostgreSQL
- write requests complete before the API returns success
- the frontend updates its visible state from API responses rather than assuming writes succeeded locally

This approach is appropriate for a lightweight interview challenge because it is simple, predictable, and easy to explain.
