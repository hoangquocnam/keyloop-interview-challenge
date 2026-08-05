import { requestJson } from "./api.ts";
import type {
  LeadInboxApiResponse,
  LeadInboxResponse,
  ListLeadsParams,
} from "./lead.types.ts";

const appendSearchParam = (
  searchParams: URLSearchParams,
  key: string,
  value: number | string | undefined,
) => {
  if (value == null || value === "") {
    return;
  }

  searchParams.set(key, String(value));
};

const normalizeLeadInboxResponse = (
  response: LeadInboxApiResponse,
  params: Pick<ListLeadsParams, "limit" | "page">,
): LeadInboxResponse => {
  const start = response.totalCount === 0 ? 0 : (params.page - 1) * params.limit + 1;
  const end = Math.min(params.page * params.limit, response.totalCount);

  return {
    items: response.items,
    pagination: {
      page: params.page,
      pageSize: params.limit,
      summaryLabel: `Showing ${start} to ${end} of ${response.totalCount} entries`,
      total: response.totalCount,
      totalPages: response.totalPage,
    },
    summary: `${response.totalCount} total leads requiring attention`,
    title: "Leads Inbox",
  };
};

export const fetchLeadInbox = async (
  params: ListLeadsParams,
): Promise<LeadInboxResponse> => {
  const searchParams = new URLSearchParams();

  appendSearchParam(searchParams, "page", params.page);
  appendSearchParam(searchParams, "limit", params.limit);
  appendSearchParam(searchParams, "search", params.search);
  appendSearchParam(searchParams, "source", params.source);
  appendSearchParam(searchParams, "status", params.status);
  appendSearchParam(searchParams, "sortBy", params.sortBy);
  appendSearchParam(searchParams, "sort", params.sort);

  const queryString = searchParams.toString();
  const response = await requestJson<LeadInboxApiResponse>(
    `/leads${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    },
  );

  return normalizeLeadInboxResponse(response.data, params);
};
