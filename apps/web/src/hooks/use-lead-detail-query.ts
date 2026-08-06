import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-keys.ts";
import { fetchLeadDetail } from "@/services/leads.ts";
import type { LeadDetailResponse } from "@/services/lead.types.ts";

type UseLeadDetailQueryParams = {
  enabled?: boolean;
  leadId?: string;
};

export const useLeadDetailQuery = ({
  enabled = true,
  leadId,
}: UseLeadDetailQueryParams) => {
  return useQuery<LeadDetailResponse, Error>({
    enabled: enabled && Boolean(leadId),
    queryFn: async () => fetchLeadDetail(leadId as string),
    queryKey: queryKeys.leadDetail(leadId ?? ""),
    staleTime: 30_000,
  });
};
