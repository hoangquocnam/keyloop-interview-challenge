import type { ListLeadsParams } from "../services/lead.types.ts";

export const queryKeys = {
  leadInbox: (params: Omit<ListLeadsParams, "page">) =>
    ["lead-inbox", params] as const,
};
