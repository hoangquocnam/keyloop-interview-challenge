import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-keys.ts";
import { fetchUsers } from "@/services/users.ts";
import type { UserSummary } from "@/services/user.types.ts";

type UseUsersQueryParams = {
  enabled?: boolean;
};

export const useUsersQuery = ({ enabled = true }: UseUsersQueryParams = {}) => {
  return useQuery<UserSummary[], Error>({
    enabled,
    queryFn: fetchUsers,
    queryKey: queryKeys.usersList,
    staleTime: 5 * 60_000,
  });
};
