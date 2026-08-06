import { Empty, type MenuProps } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { appRoutes } from "@/app/routes.ts";
import { LeadInboxTable } from "@/components/leadsElements/LeadInboxTable";
import { Text, View } from "@/components/ui";
import { LEAD_SORT_OPTIONS } from "@/enums/lead.enums";
import { useLeadInboxQuery } from "@/hooks/use-lead-inbox-query.ts";
import { useRootStore } from "@/stores/use-root-store.ts";
import { FONT } from "@/theme/design-tokens.ts";
import {
  getQueryFromSearchParams,
  getSearchParamsFromQuery,
} from "@/utils/lead.utils";
import FilterSortTableControls from "@/components/leadsElements/FilterSortTableControls";

export const LeadInboxPage = observer(() => {
  const { auth, lead } = useRootStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams],
  );
  const leadInboxQuery = useLeadInboxQuery({
    enabled: auth.isAuthenticated,
    params: lead.query,
  });

  const statusMenuItems: MenuProps["items"] = lead.statusOptions.map(
    (option) => ({
      key: option.value,
      label: option.label,
    }),
  );

  const sourceMenuItems: MenuProps["items"] = lead.sourceOptions.map(
    (option) => ({
      key: option.value,
      label: option.label,
    }),
  );

  const sortMenuItems: MenuProps["items"] = LEAD_SORT_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  useEffect(() => {
    lead.syncQueryFromUrl(queryFromUrl);
  }, [lead, queryFromUrl]);

  useEffect(() => {
    const nextSearchParams = getSearchParamsFromQuery(lead.query);

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [lead.query, searchParams, setSearchParams]);

  useEffect(() => {
    if (leadInboxQuery.data?.pages) {
      lead.applyLeadInboxPages(leadInboxQuery.data.pages);
      return;
    }

    if (!leadInboxQuery.isFetching) {
      lead.clearLeadInbox();
    }
  }, [lead, leadInboxQuery.data?.pages, leadInboxQuery.isFetching]);

  return (
    <View
      flexDirection="column"
      gap="md"
      minHeight={0}
      style={{ flex: "1 1 auto", height: "100%" }}
    >
      <View flexDirection="column" flexShrink={0} gap="xs">
        <Text
          as="h1"
          fontSize={FONT.fontSize2Xl}
          lineHeight={FONT.lineHeightHeading}
          m={0}
          weight={FONT.fontWeightBold}
        >
          {lead.title}
        </Text>
        <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
          {lead.summary}
        </Text>
      </View>

      <FilterSortTableControls
        statusMenuItems={statusMenuItems}
        sourceMenuItems={sourceMenuItems}
        sortMenuItems={sortMenuItems}
      />

      {leadInboxQuery.isError ? (
        <View
          backgroundColor="error_50"
          borderColor="error_200"
          borderRadius={2}
          borderStyle="solid"
          borderWidth={1}
          p="md"
        >
          <Text color="error_600" fontSize={FONT.fontSizeMd}>
            Failed to load leads.{" "}
            {leadInboxQuery.error instanceof Error
              ? leadInboxQuery.error.message
              : "Try refreshing the page."}
          </Text>
        </View>
      ) : !leadInboxQuery.isFetching && !lead.hasData ? (
        <View
          alignItems="center"
          backgroundColor="surface"
          borderColor="border"
          borderRadius={2}
          borderStyle="solid"
          borderWidth={1}
          justifyContent="center"
          minHeight={240}
          p="lg"
          width="100%"
        >
          <Empty description="No leads match the current filters." />
        </View>
      ) : (
        <LeadInboxTable
          hasMorePages={leadInboxQuery.hasNextPage ?? false}
          isLoading={leadInboxQuery.isFetching && !lead.hasData}
          isLoadingMore={leadInboxQuery.isFetchingNextPage}
          onLoadMore={() => {
            if (leadInboxQuery.hasNextPage) {
              void leadInboxQuery.fetchNextPage();
            }
          }}
          onSelectLead={(leadId) => {
            lead.selectLead(leadId);
            void navigate(`${appRoutes.leadDetail(leadId)}${location.search}`);
          }}
          rows={lead.items}
          selectedLeadId={lead.selectedLeadId}
        />
      )}
    </View>
  );
});
