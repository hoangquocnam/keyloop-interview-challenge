import { makeAutoObservable } from "mobx";
import {
  LEAD_SORT_LABELS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LeadSortBy,
  LeadSortOrder,
  type LeadSourceFilterValue,
  type LeadStatusFilterValue,
  getLeadSortLabel,
  getLeadSourceLabel,
  getLeadStatusLabel,
} from "../enums/lead.ts";
import type { LeadInboxResponse, ListLeadsParams } from "../services/lead.types.ts";

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 500;

const createDefaultQuery = (): Omit<ListLeadsParams, "page"> => ({
  limit: DEFAULT_PAGE_SIZE,
  sortBy: LeadSortBy.CREATED_AT,
  sort: LeadSortOrder.DESC,
});

export class LeadStore {
  items: LeadInboxResponse["items"] = [];
  pagination: LeadInboxResponse["pagination"] = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    summaryLabel: "Showing 0 to 0 of 0 entries",
    total: 0,
    totalPages: 1,
  };
  query: Omit<ListLeadsParams, "page"> = createDefaultQuery();
  searchInput = "";
  selectedLeadId: string | null = null;
  summary = "0 total leads requiring attention";
  title = "Leads Inbox";

  private searchDebounceWindowId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get hasData() {
    return this.items.length > 0;
  }

  get hasMorePages() {
    return this.pagination.page < this.pagination.totalPages;
  }

  get sortLabel() {
    return getLeadSortLabel(this.query.sortBy, this.query.sort);
  }

  get sortOptions() {
    return Object.entries(LEAD_SORT_LABELS).map(([value, label]) => ({
      label,
      value,
    }));
  }

  get sourceFilterLabel() {
    return getLeadSourceLabel(this.query.source);
  }

  get sourceOptions() {
    return LEAD_SOURCE_OPTIONS;
  }

  get statusFilterLabel() {
    return getLeadStatusLabel(this.query.status);
  }

  get statusOptions() {
    return LEAD_STATUS_OPTIONS;
  }

  applyLeadInboxPages(pages: LeadInboxResponse[]) {
    const nextItems = pages.flatMap((page) => page.items);
    const lastPage = pages.at(-1);

    this.items = nextItems;
    this.pagination =
      lastPage?.pagination ?? {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        summaryLabel: "Showing 0 to 0 of 0 entries",
        total: 0,
        totalPages: 1,
    };
    this.summary = lastPage?.summary ?? "0 total leads requiring attention";
    this.title = lastPage?.title ?? "Leads Inbox";

    if (
      this.selectedLeadId &&
      !nextItems.some((item) => item.id === this.selectedLeadId)
    ) {
      this.selectedLeadId = null;
    }
  }

  clearLeadInbox() {
    this.items = [];
    this.pagination = {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      summaryLabel: "Showing 0 to 0 of 0 entries",
      total: 0,
      totalPages: 1,
    };
    this.summary = "0 total leads requiring attention";
    this.title = "Leads Inbox";
    this.selectedLeadId = null;
  }

  reset() {
    if (this.searchDebounceWindowId != null) {
      window.clearTimeout(this.searchDebounceWindowId);
    }

    this.clearLeadInbox();
    this.query = createDefaultQuery();
    this.searchInput = "";
  }

  syncQueryFromUrl(query: Omit<ListLeadsParams, "page">) {
    const normalizedSearch = query.search?.trim() || undefined;
    const nextQuery = {
      ...createDefaultQuery(),
      ...query,
      search: normalizedSearch,
    };

    if (this.searchDebounceWindowId != null) {
      window.clearTimeout(this.searchDebounceWindowId);
      this.searchDebounceWindowId = null;
    }

    const hasChanged =
      this.query.limit !== nextQuery.limit ||
      this.query.search !== nextQuery.search ||
      this.query.sortBy !== nextQuery.sortBy ||
      this.query.sort !== nextQuery.sort ||
      this.query.source !== nextQuery.source ||
      this.query.status !== nextQuery.status ||
      this.searchInput !== (normalizedSearch ?? "");

    if (!hasChanged) {
      return;
    }

    this.clearLeadInbox();
    this.query = nextQuery;
    this.searchInput = normalizedSearch ?? "";
  }

  selectLead(leadId: string) {
    this.selectedLeadId = leadId;
  }

  setSearchInput(value: string) {
    this.searchInput = value;

    if (this.searchDebounceWindowId != null) {
      window.clearTimeout(this.searchDebounceWindowId);
    }

    this.searchDebounceWindowId = window.setTimeout(() => {
      this.query = {
        ...this.query,
        search: value.trim() || undefined,
      };
      this.clearLeadInbox();
      this.searchDebounceWindowId = null;
    }, SEARCH_DEBOUNCE_MS);
  }

  setSort(sortBy: LeadSortBy) {
    const nextSortOrder =
      this.query.sortBy === sortBy && this.query.sort === LeadSortOrder.DESC
        ? LeadSortOrder.ASC
        : LeadSortOrder.DESC;

    this.query = {
      ...this.query,
      sortBy,
      sort: nextSortOrder,
    };
    this.clearLeadInbox();
  }

  setSourceFilter(source: LeadSourceFilterValue) {
    this.query = {
      ...this.query,
      source: source === "ALL" ? undefined : source,
    };
    this.clearLeadInbox();
  }

  setStatusFilter(status: LeadStatusFilterValue) {
    this.query = {
      ...this.query,
      status: status === "ALL" ? undefined : status,
    };
    this.clearLeadInbox();
  }
}
