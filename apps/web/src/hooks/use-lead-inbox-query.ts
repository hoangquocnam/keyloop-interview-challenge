import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../app/query-keys.ts";
import { fetchLeadInbox } from "../services/leads.ts";
import type { LeadInboxResponse, ListLeadsParams } from "../services/lead.types.ts";

type UseLeadInboxQueryParams = {
  enabled?: boolean;
  params: Omit<ListLeadsParams, "page">;
};

export const useLeadInboxQuery = ({
  enabled = true,
  params,
}: UseLeadInboxQueryParams) => {
  return useInfiniteQuery<LeadInboxResponse, Error>({
    enabled,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return fetchLeadInbox({
        ...params,
        page: pageParam as number,
      });
    },
    queryKey: queryKeys.leadInbox(params),
    staleTime: 30_000,
  });
};
