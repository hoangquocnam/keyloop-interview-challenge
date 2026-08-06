import { describe, expect, it } from "vitest";

import { LeadSource } from "@/enums/lead.enums.ts";
import { LeadPreferredContactMethod } from "@/services/lead.types.ts";
import {
  createLeadSchema,
  updateLeadInfoSchema,
} from "@/validations/lead.ts";

describe("lead validation", () => {
  it("accepts a valid create lead payload", () => {
    const result = createLeadSchema.safeParse({
      assignedToId: "",
      customerName: "Jamie Le",
      email: "jamie@leadstream.demo",
      inquiry: "Interested in a walk-in appointment.",
      phone: "(555) 100-1035",
      preferredContactMethod: LeadPreferredContactMethod.PHONE,
      source: LeadSource.WALK_IN,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing phone when preferred contact method is phone", () => {
    const result = createLeadSchema.safeParse({
      assignedToId: "",
      customerName: "Jamie Le",
      email: "jamie@leadstream.demo",
      inquiry: "",
      phone: "",
      preferredContactMethod: LeadPreferredContactMethod.PHONE,
      source: LeadSource.WEBSITE_FORM,
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.phone).toContain(
      "Phone number is required for the selected preferred contact method",
    );
  });

  it("allows update lead info schema to be derived independently from create schema", () => {
    const result = updateLeadInfoSchema.safeParse({
      email: "lead36@leadstream.demo",
      phone: "",
      preferredContactMethod: LeadPreferredContactMethod.EMAIL,
      source: LeadSource.WALK_IN,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid source in update lead info schema", () => {
    const result = updateLeadInfoSchema.safeParse({
      email: "lead36@leadstream.demo",
      phone: "(555) 100-1035",
      preferredContactMethod: LeadPreferredContactMethod.EMAIL,
      source: "invalid_source",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.source).toContain(
      "Lead source is required",
    );
  });
});
