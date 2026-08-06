import type {
  LeadSortBy,
  LeadSortOrder,
  LeadSource,
  LeadStatusTone,
  LeadStatusValue,
} from "../enums/lead.enums.ts";

export type LeadInboxAssignee = {
  fullName: string;
  id: string;
  initials: string;
};

export type LeadInboxItem = {
  assignedTo: LeadInboxAssignee | null;
  contactEmail: string;
  customerName: string;
  hasUnreadIndicator: boolean;
  id: string;
  lastActivity: string;
  phone: string;
  source: LeadSource;
  status: {
    label: string;
    tone: LeadStatusTone;
    value: LeadStatusValue;
  };
};

export type LeadInboxPagination = {
  page: number;
  pageSize: number;
  summaryLabel: string;
  total: number;
  totalPages: number;
};

export type LeadInboxResponse = {
  items: LeadInboxItem[];
  pagination: LeadInboxPagination;
  summary: string;
  title: string;
};

export type LeadInboxApiResponse = {
  items: LeadInboxItem[];
  totalCount: number;
  totalPage: number;
};

export type ListLeadsParams = {
  limit: number;
  page: number;
  search?: string;
  sortBy: LeadSortBy;
  sort: LeadSortOrder;
  source?: LeadSource;
  status?: LeadStatusValue;
};

export const LeadPreferredContactMethod = {
  EMAIL: "email",
  PHONE: "phone",
} as const;

export type LeadPreferredContactMethod =
  (typeof LeadPreferredContactMethod)[keyof typeof LeadPreferredContactMethod];

export const LeadTimelineItemType = {
  CALL: "call",
  EMAIL: "email",
  NOTE: "note",
  SYSTEM: "system",
} as const;

export type LeadTimelineItemType =
  (typeof LeadTimelineItemType)[keyof typeof LeadTimelineItemType];

export type LeadDetailTimelineItem = {
  actorName: string;
  happenedAt: string;
  id: string;
  note: string;
  title: string;
  type: LeadTimelineItemType;
};

export type LeadDetailResponse = {
  contactInfo: {
    email: string;
    phone: string | null;
    preferredMethod: LeadPreferredContactMethod;
  };
  customerName: string;
  id: string;
  inquiry: string | null;
  leadDetails: {
    assignedTo: LeadInboxAssignee | null;
    createdAt: string;
    source: LeadSource;
  };
  status: LeadInboxItem["status"];
  timeline: LeadDetailTimelineItem[];
};

export type CreateLeadActivityPayload = {
  note: string;
  type: Exclude<LeadTimelineItemType, "system">;
};

export type CreateLeadPayload = {
  assignedToId?: string | null;
  customerName: string;
  email: string;
  inquiry?: string | null;
  phone?: string | null;
  preferredContactMethod: LeadPreferredContactMethod;
  source: LeadSource;
};

export type UpdateLeadStatusPayload = {
  status: LeadStatusValue;
};

export type UpdateLeadStatusResponse = {
  status: LeadInboxItem["status"];
  timelineItem: LeadDetailTimelineItem | null;
};

export type UpdateLeadAssigneePayload = {
  assignedToId?: string | null;
};

export type UpdateLeadAssigneeResponse = {
  assignedTo: LeadInboxAssignee | null;
  timelineItem: LeadDetailTimelineItem | null;
};

export type ArchiveLeadResponse = {
  archivedAt: string;
  id: string;
};
