# Lead Detail FE Integration Guide

## Goal

Use backend data as the single source of truth for the Lead Detail page.

Do not build `Customer Inquiry`, `Activity Timeline`, `Created`, or `Preferred Method` from local constants anymore.

## Base Rules

- All lead detail endpoints are JWT-protected.
- Every API response is wrapped in:

```json
{
  "success": true,
  "statusCode": "200",
  "data": {}
}
```

- FE should read from `response.data`.
- `statusCode` may come back as a string because of the current API response interceptor.

## Endpoints

### 1. Get Lead Detail

`GET /api/leads/:leadId`

Use this endpoint whenever the user opens `/leads/:leadId`.

Do not depend on inbox page memory for detail rendering. Direct page load and browser refresh must call this endpoint.

Example response:

```json
{
  "success": true,
  "statusCode": "200",
  "data": {
    "id": "985ac8c2-ec0f-44b9-af6e-0fff56a02b84",
    "customerName": "Alex Nguyen",
    "inquiry": "Demo lead 1 requesting more information about available vehicles and financing options.",
    "status": {
      "value": "NEW",
      "label": "NEW",
      "tone": "neutral"
    },
    "contactInfo": {
      "email": "lead1@leadstream.demo",
      "phone": "(555) 100-1000",
      "preferredMethod": "email"
    },
    "leadDetails": {
      "source": "website_form",
      "createdAt": "2026-08-06T04:24:39.818Z",
      "assignedTo": {
        "id": "7faf7a87-2307-4ae6-820b-e2d6516978c1",
        "fullName": "Jim Halpert",
        "initials": "JH"
      }
    },
    "timeline": [
      {
        "id": "cc20af44-e8bb-42fe-b960-7a7001310ffc",
        "type": "system",
        "title": "Lead Received",
        "note": "New lead entered the system from the website form channel.",
        "actorName": "System",
        "happenedAt": "2026-08-06T03:47:39.176Z"
      }
    ]
  }
}
```

### 2. Create Lead Activity

`POST /api/leads/:leadId/activities`

Request body:

```json
{
  "type": "note",
  "note": "Confirmed budget and scheduled a follow-up test drive."
}
```

Allowed `type` values:

- `call`
- `email`
- `note`

Response:

```json
{
  "success": true,
  "statusCode": "201",
  "data": {
    "id": "c834f2f7-1026-4fa5-87fd-e8cb33fc97e4",
    "type": "note",
    "title": "Note Added",
    "note": "Confirmed budget and scheduled a follow-up test drive.",
    "actorName": "LeadStream Admin",
    "happenedAt": "2026-08-06T04:25:46.575Z"
  }
}
```

### 3. Update Lead Status

`PATCH /api/leads/:leadId/status`

Request body:

```json
{
  "status": "CONTACTED"
}
```

Allowed status values:

- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `WON`
- `LOST`

Response:

```json
{
  "success": true,
  "statusCode": "200",
  "data": {
    "status": {
      "value": "CONTACTED",
      "label": "CONTACTED",
      "tone": "info"
    },
    "timelineItem": {
      "id": "af09de3e-1e4a-4f0d-b15c-21c0162767f5",
      "type": "system",
      "title": "Status Updated",
      "note": "Lead status updated to CONTACTED.",
      "actorName": "System",
      "happenedAt": "2026-08-06T04:25:46.610Z"
    }
  }
}
```

If the next status is the same as the current status, `timelineItem` returns `null`.

## UI Mapping

### Header

- Lead name: `data.customerName`
- Current status badge:
  - label: `data.status.label`
  - tone: `data.status.tone`
  - value: `data.status.value`

### Customer Inquiry

- Use `data.inquiry`
- This is the real backend value.
- Render empty state if it is `null`

Recommended fallback copy:

`No customer inquiry was provided for this lead.`

### Log Activity

Composer button -> request `type`

- `Call` -> `call`
- `Email` -> `email`
- `Note` -> `note`

Textarea -> request `note`

On success:

- Option A: prepend returned `timelineItem` to local timeline state
- Option B: invalidate and refetch lead detail

Recommended:

- use returned `data` for immediate UI update
- then invalidate detail query
- also invalidate lead inbox query because `lastActivity` changes there

### Activity Timeline

Use `data.timeline`

Each row:

- title: `item.title`
- actor name: `item.actorName`
- body text: `item.note`
- timestamp: format `item.happenedAt`
- icon/style by `item.type`

Suggested timeline icon mapping:

- `system` -> system/user icon
- `call` -> phone icon
- `email` -> mail icon
- `note` -> note/file icon

Important:

- Backend already returns timeline sorted newest first
- FE should not rebuild fake timeline entries from status/source anymore

### Contact Info

- Email: `data.contactInfo.email`
- Phone: `data.contactInfo.phone`
- Preferred Method: `data.contactInfo.preferredMethod`

Preferred method display mapping:

- `email` -> `Email`
- `phone` -> `Phone`

If `phone` is `null`, render your empty placeholder instead of `"--"` for detail page.

### Lead Details

- Source: `data.leadDetails.source`
- Created: `data.leadDetails.createdAt`
- Assigned To: `data.leadDetails.assignedTo`

Source display mapping:

- `website_form` -> `Website Form`
- `phone_inbound` -> `Phone Inbound`
- `walk_in` -> `Walk-in`

Assigned salesperson:

- avatar initials: `assignedTo.initials`
- display name: `assignedTo.fullName`

If `assignedTo` is `null`, render `Unassigned`.

### Status and Update Status

Current badge should always use `data.status`.

When user picks a new status:

1. call `PATCH /api/leads/:leadId/status`
2. replace current status badge from `response.data.status`
3. if `response.data.timelineItem` exists, prepend it to the timeline
4. invalidate lead detail query
5. invalidate lead inbox query

## Recommended FE Query Shape

### Query keys

Suggested keys:

- `['leadInbox', params]`
- `['leadDetail', leadId]`

### Detail page load

- Read `leadId` from route param
- Fetch `GET /api/leads/:leadId`
- Do not derive detail from inbox rows except as optional placeholder while loading

### After mutations

After `POST /activities`:

- invalidate `['leadDetail', leadId]`
- invalidate `['leadInbox']`

After `PATCH /status`:

- invalidate `['leadDetail', leadId]`
- invalidate `['leadInbox']`

## FE Types

Recommended shape:

```ts
export type LeadTimelineItem = {
  actorName: string;
  happenedAt: string;
  id: string;
  note: string;
  title: string;
  type: "system" | "call" | "email" | "note";
};

export type LeadDetailResponse = {
  contactInfo: {
    email: string;
    phone: string | null;
    preferredMethod: "email" | "phone";
  };
  customerName: string;
  id: string;
  inquiry: string | null;
  leadDetails: {
    assignedTo: {
      fullName: string;
      id: string;
      initials: string;
    } | null;
    createdAt: string;
    source: "website_form" | "phone_inbound" | "walk_in";
  };
  status: {
    label: string;
    tone: "neutral" | "info" | "success";
    value: "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";
  };
  timeline: LeadTimelineItem[];
};
```

## FE Cleanup After Integration

These FE patterns should be removed after wiring to BE:

- hardcoded inquiry by email
- hardcoded timeline by email
- inferred preferred method from source/status
- fake created date by status
- local-only status updates
- local-only activity timeline appends without refetch

## Practical Render Rules

- Use backend `status.label` and `status.tone` directly for badge
- Use backend `title` and `note` directly for timeline content
- Format `createdAt` and `happenedAt` in FE for final UI display
- Treat `source` and `preferredMethod` as enum values, not display text
- Map enum values to UI labels in FE

## Minimal FE Integration Order

1. Add `lead detail` service types
2. Add `getLeadDetail(leadId)`
3. Replace `constants/lead-detail.ts` data source with API data
4. Add `createLeadActivity()`
5. Add `updateLeadStatus()`
6. Invalidate detail + inbox queries after mutations

