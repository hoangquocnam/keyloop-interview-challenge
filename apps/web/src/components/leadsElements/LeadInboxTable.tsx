import {
  Avatar,

  Spin,
  Table,
} from "antd";
import { CaretDownOutlined, CaretUpOutlined, SwapOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@/components/ui";
import {
  getLeadSourceDisplayLabel,
  LeadSortBy,
  type LeadSortBy as LeadSortByValue,
  type LeadSortOrder,
} from "../../enums/lead.enums.ts";
import type { LeadInboxItem } from "../../services/lead.types.ts";
import { COLORS, FONT } from "@/theme/design-tokens.ts";
import { LeadStatusBadge } from "./LeadStatusBadge.tsx";

type Props = {
  hasMorePages: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void;
  onSelectLead: (leadId: string) => void;
  onSortChange: (sortBy: LeadSortByValue) => void;
  rows: LeadInboxItem[];
  sortBy: LeadSortByValue;
  sortOrder: LeadSortOrder;
  selectedLeadId: string | null;
};

const headerCellStyle = {
  backgroundColor: COLORS.gray50,
  borderBottom: `1px solid ${COLORS.border}`,
  color: COLORS.textSecondary,
  fontSize: 11,
  fontWeight: FONT.fontWeightBold,
  letterSpacing: 0.4,
};

export const LeadInboxTable = ({
  hasMorePages,
  isLoading = false,
  isLoadingMore = false,
  onLoadMore,
  onSelectLead,
  onSortChange,
  rows,
  sortBy,
  sortOrder,
  selectedLeadId,
}: Props) => {
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const [tableScrollHeight, setTableScrollHeight] = useState(420);

  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;

    if (!(tableWrapper instanceof HTMLDivElement)) {
      return;
    }

    const spinNested = tableWrapper.querySelector(".ant-spin-nested-loading");
    const spinContainer = tableWrapper.querySelector(".ant-spin-container");
    const tableRoot = tableWrapper.querySelector(".ant-table");
    const tableContainer = tableWrapper.querySelector(".ant-table-container");
    const tableBody = tableWrapper.querySelector(".ant-table-body");

    if (spinNested instanceof HTMLDivElement) {
      spinNested.style.display = "flex";
      spinNested.style.flex = "1 1 auto";
      spinNested.style.flexDirection = "column";
      spinNested.style.minHeight = "0";
      spinNested.style.height = "100%";
    }

    if (spinContainer instanceof HTMLDivElement) {
      spinContainer.style.display = "flex";
      spinContainer.style.flex = "1 1 auto";
      spinContainer.style.flexDirection = "column";
      spinContainer.style.minHeight = "0";
      spinContainer.style.height = "100%";
    }

    if (tableRoot instanceof HTMLDivElement) {
      tableRoot.style.display = "flex";
      tableRoot.style.flex = "1 1 auto";
      tableRoot.style.flexDirection = "column";
      tableRoot.style.minHeight = "0";
      tableRoot.style.height = "100%";
    }

    if (tableContainer instanceof HTMLDivElement) {
      tableContainer.style.display = "flex";
      tableContainer.style.flex = "1 1 auto";
      tableContainer.style.flexDirection = "column";
      tableContainer.style.minHeight = "0";
      tableContainer.style.height = "100%";
    }

    if (tableBody instanceof HTMLDivElement) {
      const resolvedHeight = `${tableScrollHeight}px`;

      tableBody.style.flex = "1 1 auto";
      tableBody.style.height = resolvedHeight;
      tableBody.style.maxHeight = resolvedHeight;
      tableBody.style.minHeight = resolvedHeight;
    }
  }, [isLoading, rows.length, tableScrollHeight]);

  useEffect(() => {
    const tableBody = tableWrapperRef.current?.querySelector(".ant-table-body");

    if (!(tableBody instanceof HTMLDivElement)) {
      return;
    }

    const handleScroll = () => {
      const reachedBottom =
        tableBody.scrollTop + tableBody.clientHeight >= tableBody.scrollHeight - 88;

      if (reachedBottom && hasMorePages && !isLoadingMore) {
        onLoadMore();
      }
    };

    tableBody.addEventListener("scroll", handleScroll);

    return () => {
      tableBody.removeEventListener("scroll", handleScroll);
    };
  }, [hasMorePages, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;

    if (!(tableWrapper instanceof HTMLDivElement)) {
      return;
    }

    const updateTableHeight = () => {
      const wrapperHeight = tableWrapper.getBoundingClientRect().height;
      const nextHeight = Math.max(wrapperHeight - 56, 320);

      setTableScrollHeight(nextHeight);
    };

    updateTableHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateTableHeight();
    });

    resizeObserver.observe(tableWrapper);
    window.addEventListener("resize", updateTableHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTableHeight);
    };
  }, []);

  const getHeaderCellProps = (nextSortBy?: LeadSortByValue) => ({
    onClick: nextSortBy
      ? () => {
          onSortChange(nextSortBy);
        }
      : undefined,
    style: {
      ...headerCellStyle,
      cursor: nextSortBy ? "pointer" : "default",
    },
  });

  const renderSortableHeader = (
    label: string,
    nextSortBy: LeadSortByValue,
  ) => {
    const isActive = sortBy === nextSortBy;
    const iconColor = isActive ? COLORS.text : COLORS.textTertiary;

    return (
      <View alignItems="center" flexDirection="row" gap="xs">
        <Text
          color={isActive ? "text" : "textSecondary"}
          fontSize={11}
          letterSpacing={0.4}
          weight={FONT.fontWeightBold}
        >
          {label}
        </Text>
        {isActive ? (
          sortOrder === "asc" ? (
            <CaretUpOutlined style={{ color: iconColor, fontSize: 11 }} />
          ) : (
            <CaretDownOutlined style={{ color: iconColor, fontSize: 11 }} />
          )
        ) : (
          <SwapOutlined style={{ color: iconColor, fontSize: 11 }} />
        )}
      </View>
    );
  };

  const columns = useMemo<TableColumnsType<LeadInboxItem>>(
    () => [
      {
        dataIndex: "customerName",
        key: "customerName",
        onHeaderCell: () => getHeaderCellProps(LeadSortBy.CUSTOMER_NAME),
        render: (value: string) => (
          <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightSemibold}>
            {value}
          </Text>
        ),
        title: renderSortableHeader("CUSTOMER NAME", LeadSortBy.CUSTOMER_NAME),
        width: 280,
      },
      {
        dataIndex: "contactEmail",
        key: "contactInfo",
        onHeaderCell: () => getHeaderCellProps(),
        render: (_value, row) => (
          <View flexDirection="column" gap="xxs">
            <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightMedium}>
              {row.contactEmail}
            </Text>
            <Text color="textSecondary" fontSize={FONT.fontSizeMd}>
              {row.phone}
            </Text>
          </View>
        ),
        title: "CONTACT INFO",
        width: 340,
      },
      {
        dataIndex: "source",
        key: "source",
        onHeaderCell: () => getHeaderCellProps(LeadSortBy.SOURCE),
        render: (value: LeadInboxItem["source"]) => (
          <Text fontSize={FONT.fontSizeLg}>{getLeadSourceDisplayLabel(value)}</Text>
        ),
        title: renderSortableHeader("SOURCE", LeadSortBy.SOURCE),
        width: 220,
      },
      {
        dataIndex: "status",
        key: "status",
        onHeaderCell: () => getHeaderCellProps(LeadSortBy.STATUS),
        render: (_value, row) => (
          <LeadStatusBadge
            label={row.status.label}
            value={row.status.value}
          />
        ),
        title: renderSortableHeader("STATUS", LeadSortBy.STATUS),
        width: 180,
      },
      {
        dataIndex: "assignedTo",
        key: "assignedTo",
        onHeaderCell: () => getHeaderCellProps(),
        render: (_value, row) => (
          <View alignItems="center" flexDirection="row" gap="xs">
            {row.assignedTo ? (
              <>
                <Avatar
                  size={36}
                  style={{
                    backgroundColor: COLORS.gray700,
                    color: COLORS.white,
                    fontSize: FONT.fontSizeSm,
                    fontWeight: FONT.fontWeightBold,
                  }}
                >
                  {row.assignedTo.initials}
                </Avatar>
                <Text fontSize={FONT.fontSizeLg}>{row.assignedTo.fullName}</Text>
              </>
            ) : (
              <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
                Unassigned
              </Text>
            )}
          </View>
        ),
        title: "ASSIGNED TO",
        width: 260,
      },
      {
        dataIndex: "lastActivity",
        key: "lastActivity",
        onHeaderCell: () => getHeaderCellProps(LeadSortBy.CREATED_AT),
        render: (value: string) => (
          <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
            {value}
          </Text>
        ),
        title: renderSortableHeader("LAST ACTIVITY", LeadSortBy.CREATED_AT),
        width: 240,
      },
    ],
    [onSortChange, sortBy, sortOrder],
  );

  return (
    <View
      backgroundColor="surface"
      borderColor="border"
      borderStyle="solid"
      borderWidth={1}
      minHeight={0}
      overflow="hidden"
      style={{ flex: "1 1 auto", height: "100%" }}
      width="100%"
      height={"100%"}
    >
      <div
        ref={tableWrapperRef}
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <Table<LeadInboxItem>
          columns={columns}
          dataSource={rows}
          loading={isLoading}
          onRow={(row) => {
            const isSelected = row.id === selectedLeadId;

            return {
              onClick: () => onSelectLead(row.id),
              style: {
                backgroundColor: isSelected ? COLORS.gray50 : COLORS.white,
                boxShadow: isSelected ? `inset 3px 0 0 ${COLORS.info}` : undefined,
                cursor: "pointer",
              },
            };
          }}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1540, y: tableScrollHeight }}
          style={{ flex: 1, minHeight: 0, width: "100%", height: "100%" }}
        />
      </div>

      {isLoadingMore ? (
        <View
          alignItems="center"
          borderColor="border"
          borderTopStyle="solid"
          borderTopWidth={1}
          justifyContent="center"
          minHeight={52}
          width="100%"
        >
          <Spin size="small" />
        </View>
      ) : null}
    </View>
  );
};
