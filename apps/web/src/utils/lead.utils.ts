import { LEAD_SORT_OPTIONS, LeadSortBy, LeadSortOrder, LeadSource, LeadStatusValue } from "@/enums/lead.enums";
import type { ListLeadsParams } from "@/services/lead.types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const isLeadSortBy = (value: string | null): value is LeadSortBy => {
  return (
    value != null &&
    value in
      LEAD_SORT_OPTIONS.reduce<Record<string, true>>((result, option) => {
        result[option.value] = true;
        return result;
      }, {})
  );
};

const isLeadSortOrder = (value: string | null): value is LeadSortOrder => {
  return value === LeadSortOrder.ASC || value === LeadSortOrder.DESC;
};

const isLeadStatusValue = (value: string | null): value is LeadStatusValue => {
  return (
    value != null &&
    Object.values(LeadStatusValue).includes(value as LeadStatusValue)
  );
};

const isLeadSource = (value: string | null): value is LeadSource => {
  return (
    value != null && Object.values(LeadSource).includes(value as LeadSource)
  );
};

const parseLimit = (value: string | null) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedValue, MAX_LIMIT);
};

export const getQueryFromSearchParams = (
  searchParams: URLSearchParams,
): Omit<ListLeadsParams, "page"> => {
  const search = searchParams.get("search")?.trim() || undefined;
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const sortBy = searchParams.get("sortBy");
  const sort = searchParams.get("sort");

  return {
    limit: parseLimit(searchParams.get("limit")),
    search,
    sort: isLeadSortOrder(sort) ? sort : LeadSortOrder.DESC,
    sortBy: isLeadSortBy(sortBy) ? sortBy : LEAD_SORT_OPTIONS[0].value,
    source: isLeadSource(source) ? source : undefined,
    status: isLeadStatusValue(status) ? status : undefined,
  };
};

export const getSearchParamsFromQuery = (query: Omit<ListLeadsParams, "page">) => {
  const nextSearchParams = new URLSearchParams();

  nextSearchParams.set("limit", String(query.limit));
  nextSearchParams.set("sortBy", query.sortBy);
  nextSearchParams.set("sort", query.sort);

  if (query.search) {
    nextSearchParams.set("search", query.search);
  }

  if (query.source) {
    nextSearchParams.set("source", query.source);
  }

  if (query.status) {
    nextSearchParams.set("status", query.status);
  }

  return nextSearchParams;
};
