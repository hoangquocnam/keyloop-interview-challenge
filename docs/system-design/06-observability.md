# 06. Observability

## Goal

Observability in this project should be lightweight but intentional.

The challenge does not require production-grade telemetry, but the system should still make failures and key behaviors visible.

## Logging strategy

### Application logs

The API should log:

- server startup
- authentication failures
- validation failures
- unhandled application errors
- lead activity creation events at an appropriate informational level

### HTTP request visibility

The API should capture enough request context to help diagnose issues, such as:

- method
- route
- response status
- request duration
- request identifier if added later

## Metrics strategy

For this challenge, formal metrics backends are optional.

If expanded, useful metrics would include:

- login success and failure counts
- request latency by endpoint
- lead activity creation count
- error rate by route

## Tracing strategy

Distributed tracing is not necessary for the first version because the architecture is a single API service plus a database.

If the project expanded, tracing could follow:

- request entry into the API
- service-layer execution
- Prisma database operations

## Health visibility

The existing health endpoint provides a basic operational signal that:

- the service is booting
- the HTTP layer is reachable

This is enough for early-stage local development and challenge review.

## Practical observability approach for MVP

| Concern | MVP approach |
| --- | --- |
| Startup status | Nest startup logs |
| Error visibility | explicit API error logging |
| API inspection | Swagger and health endpoint |
| Request debugging | structured request logs if added during implementation |

## Design principle

The observability strategy should stay proportional to the size of the system:

- simple enough for an interview project
- clear enough to show engineering maturity
