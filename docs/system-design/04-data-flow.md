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

## Flow 1: Authentication and session setup

### Trigger

The salesperson submits login credentials from the login page.

### Request path

1. The web app sends the credentials to `POST /auth/login`.
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

## Flow 2: Lead inbox retrieval

### Trigger

The salesperson opens the lead inbox page.

### Request path

1. The web app sends `GET /leads`.
2. The API validates the JWT and authorizes the request.
3. The API queries PostgreSQL through Prisma for lead summary data.
4. The API returns a list of leads to the frontend.
5. The web app renders the inbox and applies loading, empty, or error states as needed.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | authenticated lead list request |
| API -> Database | read lead summary records |
| API -> Client | lead inbox payload |

## Flow 3: Lead detail retrieval

### Trigger

The salesperson selects a lead from the inbox.

### Request path

1. The web app sends `GET /leads/:id`.
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

## Flow 4: Activity logging

### Trigger

The salesperson submits a new follow-up activity from the lead detail page.

### Request path

1. The web app sends `POST /leads/:id/activities`.
2. The API validates:
   - the JWT
   - the lead identifier
   - the activity payload such as activity type, note, and timestamp
3. The API writes a new `lead_activity` record through Prisma.
4. The API returns either:
   - the created activity
   - or an updated lead detail response, depending on implementation preference
5. The web app updates the activity timeline and shows success or error feedback.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | new activity payload |
| API -> Database | insert activity row |
| API -> Client | created activity or refreshed detail state |

## Flow 5: Lead status update

### Trigger

The salesperson changes the current lead status from the UI.

### Request path

1. The web app sends `PATCH /leads/:id`.
2. The API validates the JWT, lead identifier, and next status value.
3. The API updates the lead row in PostgreSQL through Prisma.
4. The API returns the updated lead record.
5. The web app refreshes the visible status state in the inbox and detail view.

### Data movement

| Step | Data movement |
| --- | --- |
| Client -> API | status update request |
| API -> Database | update lead row |
| API -> Client | updated lead payload |

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

## Consistency model for the MVP

The application uses a straightforward request-response consistency model.

- read requests return the latest committed state from PostgreSQL
- write requests complete before the API returns success
- the frontend updates its visible state from API responses rather than assuming writes succeeded locally

This approach is appropriate for a lightweight interview challenge because it is simple, predictable, and easy to explain.
