# 04. Data Flow

## Login flow

1. The salesperson submits email and password from the web app.
2. The web app sends the credentials to `POST /auth/login`.
3. The API validates the credentials against stored user data.
4. The API returns a JWT and current-user payload on success.
5. The web app stores the token and uses it for future authenticated requests.

## Lead inbox flow

1. The salesperson opens the inbox page.
2. The web app requests `GET /leads`.
3. The API authenticates the request and loads lead summaries from PostgreSQL through Prisma.
4. The API returns a lead list to the frontend.
5. The web app renders the inbox with loading, empty, or error states as needed.

## Lead detail flow

1. The salesperson selects a lead from the inbox.
2. The web app requests `GET /leads/:id`.
3. The API authenticates the request and loads the lead, related activity history, and associated user references.
4. The API returns a detail payload that includes the lead record and chronological activity list.
5. The web app renders the lead detail workspace.

## Activity logging flow

1. The salesperson fills in the activity form on the lead detail page.
2. The web app sends a request to `POST /leads/:id/activities`.
3. The API validates the payload and writes a new activity row to the database.
4. The API returns the created activity or an updated lead detail payload.
5. The web app updates the timeline and shows success or error feedback.

## Lead status update flow

1. The salesperson changes the lead status from the UI.
2. The web app sends `PATCH /leads/:id`.
3. The API validates the new status and updates the lead row.
4. The API returns the updated lead record.
5. The web app refreshes the visible status state.

## Key design principle

The frontend owns interaction state and presentation.

The backend owns:

- authentication
- validation
- business rules
- persistence
