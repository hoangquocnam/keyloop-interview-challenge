import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { Dropdown, Empty, type MenuProps } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { LeadInboxTable } from "../../components/LeadInbox/index.ts";
import { Text } from "../../components/Text/index.ts";
import { View } from "../../components/View/index.ts";
import {
  LEAD_SORT_OPTIONS,
  LeadSortOrder,
  LeadSource,
  LeadStatusValue,
  type LeadSortBy,
  type LeadSourceFilterValue,
  type LeadStatusFilterValue,
} from "../../enums/lead.ts";
import { useLeadInboxQuery } from "../../hooks/use-lead-inbox-query.ts";
import type { ListLeadsParams } from "../../services/lead.types.ts";
import { useRootStore } from "../../stores/use-root-store.ts";
import { FONT } from "../../theme/design-tokens.ts";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const isLeadSortBy = (value: string | null): value is LeadSortBy => {
  return value != null && value in LEAD_SORT_OPTIONS.reduce<Record<string, true>>((result, option) => {
    result[option.value] = true;
    return result;
  }, {});
};

const isLeadSortOrder = (value: string | null): value is LeadSortOrder => {
  return value === LeadSortOrder.ASC || value === LeadSortOrder.DESC;
};

const isLeadStatusValue = (value: string | null): value is LeadStatusValue => {
  return value != null && Object.values(LeadStatusValue).includes(value as LeadStatusValue);
};

const isLeadSource = (value: string | null): value is LeadSource => {
  return value != null && Object.values(LeadSource).includes(value as LeadSource);
};

const parseLimit = (value: string | null) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedValue, MAX_LIMIT);
};

const getQueryFromSearchParams = (
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

const getSearchParamsFromQuery = (query: Omit<ListLeadsParams, "page">) => {
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

export const LeadInboxPage = observer(() => {
  const { auth, lead } = useRootStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams],
  );
  const leadInboxQuery = useLeadInboxQuery({
    enabled: auth.isAuthenticated,
    params: lead.query,
  });

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

  const statusMenuItems: MenuProps["items"] = lead.statusOptions.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  const sourceMenuItems: MenuProps["items"] = lead.sourceOptions.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  const sortMenuItems: MenuProps["items"] = LEAD_SORT_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  return (
    <View flexDirection="column" gap="md">
      <View flexDirection="column" gap="xs">
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

      <View
        backgroundColor="surface"
        borderColor="border"
        borderRadius={2}
        borderStyle="solid"
        borderWidth={1}
        flexDirection="row"
        gap="sm"
        p="sm"
        width="100%"
      >
        <Dropdown
          menu={{
            items: statusMenuItems,
            onClick: ({ key }) => {
              lead.setStatusFilter(key as LeadStatusFilterValue);
            },
          }}
          trigger={["click"]}
        >
          <Button
            borderRadius={2}
            textColor="text"
            icon={<DownOutlined />}
            iconPosition="end"
            size="lg"
            variant="outline"
          >
            {lead.statusFilterLabel}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: sourceMenuItems,
            onClick: ({ key }) => {
              lead.setSourceFilter(key as LeadSourceFilterValue);
            },
          }}
          trigger={["click"]}
        >
          <Button
            borderRadius={2}
            textColor="text"
            icon={<DownOutlined />}
            iconPosition="end"
            size="lg"
            variant="outline"
          >
            {lead.sourceFilterLabel}
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: sortMenuItems,
            onClick: ({ key }) => {
              lead.setSort(key as LeadSortBy);
            },
          }}
          trigger={["click"]}
        >
          <Button
            borderRadius={2}
            textColor="text"
            icon={<FilterOutlined />}
            iconPosition="start"
            size="lg"
            variant="outline"
          >
            {lead.sortLabel}
          </Button>
        </Dropdown>
      </View>

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
          onSelectLead={lead.selectLead}
          rows={lead.items}
          selectedLeadId={lead.selectedLeadId}
        />
      )}
    </View>
  );
});
