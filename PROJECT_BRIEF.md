# Project Brief

## Project name

Sales Lead Management Tool

## Context

This project is a lightweight fullstack interview challenge for a dealership sales workflow.

The goal is to build an internal tool that helps salespeople manage incoming website leads, review lead details, and keep a clear history of follow-up activity.

## Product goal

The app should act like a small CRM for dealership sales teams.

It should allow a salesperson to:

- view incoming leads from the dealership website
- open a lead and review full details
- track all follow-up actions in chronological order
- log new follow-up activities
- update the lead status as the lead moves through the sales process

## Primary user

`Salesperson`

This user needs a simple workflow to avoid losing track of leads and to maintain a visible history of customer contact.

## Core requirements

| Requirement | Description |
| --- | --- |
| Lead Inbox | Display a list of all incoming sales leads |
| Lead Details View | Show full lead information when a lead is selected |
| Activity Timeline | Show follow-up activities in chronological order |
| Activity Logging | Allow the salesperson to create a new follow-up activity |
| Lead Status Updates | Allow lead progression through a simple sales lifecycle |
| Basic Authentication | Allow a seeded salesperson account to log in and use the app |

## MVP scope

### Must have

- login with a seeded user account
- lead inbox page
- lead detail page
- follow-up activity timeline
- add activity form
- update lead status
- PostgreSQL persistence through Prisma
- protected API routes with JWT auth

### Nice to have later

- simple filtering by status
- simple search by customer name or email
- assign lead to salesperson

### Out of scope for the first version

- complex role-based access control
- refresh token flow
- realtime updates
- file upload
- advanced analytics
- heavy admin tooling

## Business problem

Website leads are valuable but easy to lose if there is no clear internal workflow.

The app should solve three practical problems:

1. Sales needs one place to see all incoming leads.
2. Sales needs visibility into what has already happened for each lead.
3. Sales needs a reliable way to record each follow-up action.

## Main user flow

1. Salesperson logs in.
2. Salesperson opens the lead inbox.
3. Salesperson selects a lead.
4. Salesperson reviews the lead details and activity history.
5. Salesperson logs a new activity.
6. Salesperson updates the lead status if needed.

## Suggested lead lifecycle

- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `WON`
- `LOST`

## Domain model

| Entity | Purpose | Key fields |
| --- | --- | --- |
| `User` | authenticated salesperson | `id`, `fullName`, `email`, `passwordHash`, `role` |
| `Lead` | customer sales lead | `id`, `firstName`, `lastName`, `email`, `phone`, `message`, `source`, `status`, `assignedToId`, `createdAt`, `updatedAt` |
| `LeadActivity` | follow-up record for a lead | `id`, `leadId`, `userId`, `type`, `note`, `happenedAt`, `createdAt` |

## Frontend scope

| Area | Expected responsibility |
| --- | --- |
| Login page | authenticate the salesperson |
| Lead inbox page | display all leads in a clear and scannable layout |
| Lead detail page | display lead summary and chronological activity history |
| Activity form | submit a new follow-up activity |
| Status UI | show and update the current lead status |
| API integration | fetch list/detail data and submit updates cleanly |

## Backend scope

| Area | Expected responsibility |
| --- | --- |
| Auth | login and current-user endpoint |
| Leads API | list leads, get lead detail, update lead status |
| Activities API | create a lead activity |
| Validation | validate request payloads |
| Persistence | Prisma models backed by PostgreSQL |
| API documentation | expose Swagger for local inspection and demo |

## Initial API outline

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | authenticate a salesperson |
| `GET` | `/auth/me` | return the current user |
| `GET` | `/leads` | return the lead inbox |
| `GET` | `/leads/:id` | return full lead details and activity history |
| `PATCH` | `/leads/:id` | update lead status or other editable lead fields |
| `POST` | `/leads/:id/activities` | create a new follow-up activity |

## Technical direction

| Layer | Stack |
| --- | --- |
| Frontend | React, Vite, TypeScript, React Router, TanStack Query |
| Backend | NestJS, Prisma, PostgreSQL |
| Repo structure | npm workspaces monorepo with `apps/web` and `apps/api` |

## Delivery principle

This challenge should prioritize:

- clean user flow
- clear separation between frontend and backend responsibilities
- practical API design
- maintainable code structure
- a polished MVP rather than an oversized system

## Success criteria

The project is successful if an interviewer can quickly understand that:

- the product solves a real sales workflow problem
- the MVP scope is focused and reasonable
- the frontend is the main experience layer
- the backend is lightweight but correctly structured
- the app demonstrates solid mid-level fullstack engineering judgment
