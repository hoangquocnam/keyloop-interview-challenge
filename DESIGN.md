# Design Direction

## Purpose

This document captures the agreed UI and UX direction for the Sales Lead Management Tool.

It is intended to help:

- keep the product visually consistent during implementation
- give interview reviewers a quick understanding of the intended interface
- provide guidance for future design exploration in tools such as Stitch

## Design goals

- Build a minimal internal tool, not a marketing-style product
- Prioritize clarity, scanability, and task completion
- Keep the interface visually calm and neutral
- Make the lead workflow obvious on first use
- Focus design effort on the core working screens

## Product tone

| Attribute | Direction |
| --- | --- |
| Overall feel | practical, quiet, efficient |
| Style | minimal and monochrome |
| Visual hierarchy | typography, spacing, and layout first |
| Motion | subtle only where helpful |
| Mood | internal workspace, not a dashboard showroom |

## Color system

### Base palette

The default product theme should rely on:

- white
- black
- gray

These should be used for:

- page backgrounds
- text hierarchy
- borders and dividers
- cards, tables, and panel surfaces

### Semantic colors

Color should be used as feedback, not decoration.

| Meaning | Color direction | Typical use |
| --- | --- | --- |
| Success | green | saved activity, successful login, status confirmation |
| Error | red | failed login, failed activity submission, API error |
| Warning | yellow or amber | incomplete data, caution, pending issue |
| Info | blue | neutral notification, helpful status update |

## Theme guidance

| Token area | Direction |
| --- | --- |
| Backgrounds | white to light gray |
| Primary text | near-black |
| Secondary text | medium gray |
| Borders | light neutral gray |
| Interactive focus | clear but restrained |
| Shadows | soft and subtle |
| Radius | medium, not overly rounded |

### Current token implementation

The current frontend theme already maps these decisions into shared tokens.

| Token area | Current implementation |
| --- | --- |
| Primary font | `IBM Plex Sans` |
| Monospace font | `IBM Plex Mono` |
| Font sizes | `12`, `13`, `14`, `16`, `20`, `28`, `40` |
| Font weights | `400`, `500`, `600`, `700` |
| Base radius scale | `6`, `8`, `12`, `16` |
| Base spacing scale | `4`, `8`, `12`, `16`, `24`, `32`, `40` |
| Base semantic colors | success green, error red, warning amber, info blue |

## Typography

| Element | Direction |
| --- | --- |
| Headings | clean sans-serif, strong hierarchy |
| Body text | readable, neutral, moderate line height |
| Labels | compact and clear |
| Data-heavy content | prioritize alignment and scanability |

Typography should carry the hierarchy more than color.

## Core pages to prioritize

### Shell layout

The implemented shell already follows a simple internal-tool layout:

- left sidebar for primary navigation
- topbar for global search and create-lead action
- protected content area for page-level workflows

This layout should remain stable as the product grows.

### 1. Login page

Purpose:

- allow a seeded salesperson to enter the system quickly

Expected behavior:

- centered and simple layout
- email and password fields
- one clear primary sign-in action
- room for inline validation and error feedback
- optional helper text for local demo credentials

The login page should feel minimal and frictionless.

Current implementation note:

- centered card layout
- inline credential error state
- seeded demo account hint shown on the page

### 2. Lead inbox page

Purpose:

- give salespeople a fast overview of all leads

Expected behavior:

- list or table-based layout
- search input
- simple status filter
- highly scannable row design
- clear indication when a row is clickable or selected

Each lead item should make it easy to see:

- customer identity
- contact information
- source
- status
- assigned salesperson
- created date
- latest activity summary

This is the most important page in the product and should feel optimized for daily use.

### 3. Lead detail page

Purpose:

- help the salesperson understand the full context of a single lead

Expected behavior:

- clear page header with lead identity and status
- contact summary
- message or inquiry block
- metadata such as source, created date, assigned owner
- chronological activity timeline
- form for adding a new follow-up activity
- quick status update control
- easy return path to the inbox

This page should function like a focused work area rather than a generic detail screen.

Current implementation note:

- timeline, status update, assignee update, and archive actions are already part of the page scope

### 4. Create lead page

Purpose:

- allow the salesperson to add a new lead directly from the portal

Expected behavior:

- form-first layout
- clear contact information section
- preferred contact method controls
- optional assignee selection
- confirmation and error feedback after submission
- easy return path to the inbox

This page should feel consistent with the detail workspace rather than like a separate product area.

## Key interaction areas

### Activity timeline

The timeline is one of the most important UX elements.

It should:

- show activities in clear chronological order
- make activity type easy to identify
- show note, timestamp, and salesperson name
- remain readable even when multiple activities exist

### Activity logging form

The form should feel lightweight and quick to use.

Suggested fields:

- activity type
- note
- submit action

Current implementation note:

- for the current MVP, the backend generates the activity timestamp on submit

The interaction should support:

- validation errors
- submitting state
- success feedback
- clear recovery when submission fails

### Lead status update

Status should be:

- visible at a glance
- easy to update
- consistent between inbox and detail page

The status change interaction should not dominate the page, but it should be easy to find.

## Component guidance

| Component | Design direction |
| --- | --- |
| Table or list rows | clean separators, strong hover/selected state |
| Badges | neutral by default, semantic color when useful |
| Forms | simple labels, generous spacing, clear validation |
| Cards and panels | subtle borders and restrained shadows |
| Toasts | semantic colors only, concise messaging |
| Empty states | helpful, calm, no decorative excess |
| Error states | explicit, readable, recoverable |

## States to support

The interface should explicitly support:

- loading
- empty
- no search results
- validation error
- API failure
- successful action confirmation
- warning or caution state

## Layout guidance

| Context | Direction |
| --- | --- |
| Desktop | default priority, dense but readable |
| Tablet | maintain list/detail clarity |
| Mobile | support narrow layouts without losing key actions |

The app does not need a complex responsive transformation, but it should remain usable on smaller screens.

## Non-goals

The first version should avoid:

- flashy gradients as the main style language
- heavy dashboard widgets
- decorative charts
- too many accent colors
- overly animated interactions

## Implementation status note

- `/dashboard` exists in the shell but is intentionally a placeholder
- the strongest implementation effort currently sits in `/login`, `/leads`, `/leads/new`, and `/leads/:leadId`

## Summary

The design should present the app as a polished internal sales tool:

- minimal
- structured
- readable
- workflow-first

The strongest design investment should go into the inbox, the lead detail page, and the activity logging flow.
