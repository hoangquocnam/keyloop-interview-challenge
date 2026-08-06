import type { ListLeadsParams } from "../services/lead.types.ts";

export const queryKeys = {
  leadDetail: (leadId: string) => ["lead-detail", leadId] as const,
  leadDetailRoot: ["lead-detail"] as const,
  leadInbox: (params: Omit<ListLeadsParams, "page">) =>
    ["lead-inbox", params] as const,
  leadInboxRoot: ["lead-inbox"] as const,
};
