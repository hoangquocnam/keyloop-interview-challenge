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
