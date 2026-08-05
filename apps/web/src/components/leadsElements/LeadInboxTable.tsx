import { Avatar, Spin, Table } from "antd";
import type { TableColumnsType } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { Text, View } from "@/components/ui"
import { getLeadSourceDisplayLabel } from "../../enums/lead.enums.ts";
import type { LeadInboxItem } from "../../services/lead.types.ts";
import { COLORS, FONT } from "@/theme/design-tokens.ts";
import { LeadStatusBadge } from "./LeadStatusBadge.tsx";

type Props = {
  hasMorePages: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void;
  onSelectLead: (leadId: string) => void;
  rows: LeadInboxItem[];
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
  rows,
  selectedLeadId,
}: Props) => {
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);

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

  const columns = useMemo<TableColumnsType<LeadInboxItem>>(
    () => [
      {
        dataIndex: "customerName",
        key: "customerName",
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
        render: (value: string) => (
          <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightSemibold}>
            {value}
          </Text>
        ),
        title: "CUSTOMER NAME",
        width: 280,
      },
      {
        dataIndex: "contactEmail",
        key: "contactInfo",
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
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
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
        render: (value: LeadInboxItem["source"]) => (
          <Text fontSize={FONT.fontSizeLg}>{getLeadSourceDisplayLabel(value)}</Text>
        ),
        title: "SOURCE",
        width: 220,
      },
      {
        dataIndex: "status",
        key: "status",
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
        render: (_value, row) => (
          <LeadStatusBadge label={row.status.label} tone={row.status.tone} />
        ),
        title: "STATUS",
        width: 180,
      },
      {
        dataIndex: "assignedTo",
        key: "assignedTo",
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
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
        onHeaderCell: () => ({
          style: headerCellStyle,
        }),
        render: (value: string) => (
          <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
            {value}
          </Text>
        ),
        title: "LAST ACTIVITY",
        width: 240,
      },
    ],
    [selectedLeadId],
  );

  return (
    <View
      backgroundColor="surface"
      borderColor="border"
      borderStyle="solid"
      borderWidth={1}
      width="100%"
    >
      <div ref={tableWrapperRef} style={{ width: "100%" }}>
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
          scroll={{ x: 1540, y: 580 }}
          style={{ width: "100%" }}
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
