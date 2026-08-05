export const LeadStatusValue = {
  CONTACTED: "CONTACTED",
  LOST: "LOST",
  NEW: "NEW",
  QUALIFIED: "QUALIFIED",
  WON: "WON",
} as const;

export type LeadStatusValue =
  (typeof LeadStatusValue)[keyof typeof LeadStatusValue];

export const LeadStatusTone = {
  INFO: "info",
  NEUTRAL: "neutral",
  SUCCESS: "success",
} as const;

export type LeadStatusTone =
  (typeof LeadStatusTone)[keyof typeof LeadStatusTone];

export const LeadSortBy = {
  CREATED_AT: "createdAt",
  CUSTOMER_NAME: "customerName",
  SOURCE: "source",
  STATUS: "status",
} as const;

export type LeadSortBy = (typeof LeadSortBy)[keyof typeof LeadSortBy];

export const LeadSortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type LeadSortOrder =
  (typeof LeadSortOrder)[keyof typeof LeadSortOrder];

export const LeadSource = {
  PHONE_INBOUND: "phone_inbound",
  WALK_IN: "walk_in",
  WEBSITE_FORM: "website_form",
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  [LeadSource.PHONE_INBOUND]: "Phone Inbound",
  [LeadSource.WALK_IN]: "Walk-in",
  [LeadSource.WEBSITE_FORM]: "Website Form",
};

export const LEAD_STATUS_OPTIONS = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: LeadStatusValue.NEW,
    value: LeadStatusValue.NEW,
  },
  {
    label: LeadStatusValue.CONTACTED,
    value: LeadStatusValue.CONTACTED,
  },
  {
    label: LeadStatusValue.QUALIFIED,
    value: LeadStatusValue.QUALIFIED,
  },
] as const;

export const LEAD_SOURCE_OPTIONS = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: LEAD_SOURCE_LABELS[LeadSource.WEBSITE_FORM],
    value: LeadSource.WEBSITE_FORM,
  },
  {
    label: LEAD_SOURCE_LABELS[LeadSource.PHONE_INBOUND],
    value: LeadSource.PHONE_INBOUND,
  },
  {
    label: LEAD_SOURCE_LABELS[LeadSource.WALK_IN],
    value: LeadSource.WALK_IN,
  },
] as const;

export const LEAD_SORT_OPTIONS = [
  {
    label: "Newest",
    value: LeadSortBy.CREATED_AT,
  },
  {
    label: "Customer",
    value: LeadSortBy.CUSTOMER_NAME,
  },
  {
    label: "Source",
    value: LeadSortBy.SOURCE,
  },
  {
    label: "Status",
    value: LeadSortBy.STATUS,
  },
] as const;

export const LEAD_SORT_LABELS: Record<LeadSortBy, string> = {
  [LeadSortBy.CREATED_AT]: "Newest",
  [LeadSortBy.CUSTOMER_NAME]: "Customer",
  [LeadSortBy.SOURCE]: "Source",
  [LeadSortBy.STATUS]: "Status",
};

export type LeadStatusFilterValue =
  | "ALL"
  | typeof LeadStatusValue.NEW
  | typeof LeadStatusValue.CONTACTED
  | typeof LeadStatusValue.QUALIFIED;

export type LeadSourceFilterValue = "ALL" | LeadSource;

export const getLeadStatusLabel = (status?: LeadStatusValue) => {
  return status ? `Status: ${status}` : "Status: All";
};

export const getLeadSourceLabel = (source?: LeadSource) => {
  return source ? `Source: ${LEAD_SOURCE_LABELS[source]}` : "Source: All";
};

export const getLeadSourceDisplayLabel = (source: LeadSource) => {
  return LEAD_SOURCE_LABELS[source];
};

export const getLeadSortLabel = (
  sortBy: LeadSortBy,
  sortOrder: LeadSortOrder,
) => {
  const directionLabel =
    sortBy === LeadSortBy.CREATED_AT && sortOrder === LeadSortOrder.ASC
      ? "Oldest"
      : LEAD_SORT_LABELS[sortBy];

  return `Sort: ${directionLabel}`;
};
