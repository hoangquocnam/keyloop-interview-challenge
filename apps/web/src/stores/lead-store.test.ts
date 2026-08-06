import { describe, expect, it } from "vitest";

import { LeadStore } from "@/stores/lead-store.ts";

describe("LeadStore", () => {
  it("updates current lead status and mirrors the inbox row", () => {
    const store = new LeadStore();

    store.items = [
      {
        assignedTo: null,
        contactEmail: "lead36@leadstream.demo",
        customerName: "Jamie Le",
        hasUnreadIndicator: true,
        id: "lead-1",
        lastActivity: "Submitted 1m ago",
        phone: "(555) 100-1035",
        source: "walk_in",
        status: {
          label: "NEW",
          tone: "neutral",
          value: "NEW",
        },
      },
    ];

    store.currentLead = {
      contactInfo: {
        email: "lead36@leadstream.demo",
        phone: "(555) 100-1035",
        preferredMethod: "email",
      },
      customerName: "Jamie Le",
      id: "lead-1",
      inquiry: "Interested in a walk-in appointment.",
      leadDetails: {
        assignedTo: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        source: "walk_in",
      },
      status: {
        label: "NEW",
        tone: "neutral",
        value: "NEW",
      },
      timeline: [],
    };

    store.updateCurrentLeadStatus(
      {
        label: "CONTACTED",
        tone: "info",
        value: "CONTACTED",
      },
      null,
    );

    expect(store.currentLead?.status.value).toBe("CONTACTED");
    expect(store.items[0]?.status.value).toBe("CONTACTED");
  });

  it("updates current lead assignee and mirrors the inbox row", () => {
    const store = new LeadStore();

    store.items = [
      {
        assignedTo: null,
        contactEmail: "lead36@leadstream.demo",
        customerName: "Jamie Le",
        hasUnreadIndicator: true,
        id: "lead-1",
        lastActivity: "Submitted 1m ago",
        phone: "(555) 100-1035",
        source: "walk_in",
        status: {
          label: "NEW",
          tone: "neutral",
          value: "NEW",
        },
      },
    ];

    store.currentLead = {
      contactInfo: {
        email: "lead36@leadstream.demo",
        phone: "(555) 100-1035",
        preferredMethod: "email",
      },
      customerName: "Jamie Le",
      id: "lead-1",
      inquiry: "Interested in a walk-in appointment.",
      leadDetails: {
        assignedTo: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        source: "walk_in",
      },
      status: {
        label: "NEW",
        tone: "neutral",
        value: "NEW",
      },
      timeline: [],
    };

    store.updateCurrentLeadAssignee(
      {
        fullName: "Dwight Schrute",
        id: "user-1",
        initials: "DS",
      },
      null,
    );

    expect(store.currentLead?.leadDetails.assignedTo?.fullName).toBe(
      "Dwight Schrute",
    );
    expect(store.items[0]?.assignedTo?.id).toBe("user-1");
  });
});
