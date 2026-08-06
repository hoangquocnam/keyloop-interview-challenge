import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Spin } from "antd";

import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { LeadDetailInfoRow } from "@/components/leadsElements/LeadDetailInfoRow.tsx";
import { Button, Text, View } from "@/components/ui";
import type { LeadInboxAssignee } from "@/services/lead.types.ts";
import type { UserSummary } from "@/services/user.types.ts";
import { COLORS, FONT } from "@/theme/design-tokens.ts";

type LeadDetailsProps = {
  assignedTo: LeadInboxAssignee | null;
  createdAtLabel: string;
  isUpdatingAssignee?: boolean;
  onDeleteClick: () => void;
  onEditClick: () => void;
  onSelectAssignee: (assignedToId: string | null) => void;
  sourceLabel: string;
  users: UserSummary[];
};

export const LeadDetails = ({
  assignedTo,
  createdAtLabel,
  isUpdatingAssignee = false,
  onDeleteClick,
  onEditClick,
  onSelectAssignee,
  sourceLabel,
  users,
}: LeadDetailsProps) => {
  const assigneeMenuItems = [
    {
      key: "unassigned",
      label: "Unassigned (Queue)",
    },
    ...users.map((user) => ({
      key: user.id,
      label: user.fullName,
    })),
  ];

  return (
    <LeadDetailCard
      action={
        <Button
          icon={<EditOutlined />}
          onClick={onEditClick}
          size="sm"
          variant="link"
        >
          Edit
        </Button>
      }
      title="LEAD DETAILS"
    >
      <View backgroundColor="border" height={1} width="100%" />
      <View flexDirection="column" gap="lg">
        <LeadDetailInfoRow label="Source" value={sourceLabel} />
        <LeadDetailInfoRow label="Created" value={createdAtLabel} />
        <LeadDetailInfoRow
          label="Assigned To"
          value={
            <Dropdown
              menu={{
                items: assigneeMenuItems,
                onClick: ({ key }) => {
                  onSelectAssignee(key === "unassigned" ? null : key);
                },
                selectable: true,
                selectedKeys: [assignedTo?.id ?? "unassigned"],
              }}
              trigger={isUpdatingAssignee ? [] : ["click"]}
            >
              <View
                alignItems="center"
                cursor={isUpdatingAssignee ? "default" : "pointer"}
                flexDirection="row"
                gap="sm"
                minHeight={36}
              >
                {isUpdatingAssignee ? <Spin size="small" /> : null}
                {assignedTo ? (
                  <>
                    <Avatar
                      size={36}
                      style={{
                        backgroundColor: COLORS.gray100,
                        color: COLORS.gray700,
                        fontSize: FONT.fontSizeSm,
                        fontWeight: FONT.fontWeightBold,
                      }}
                    >
                      {assignedTo.initials}
                    </Avatar>
                    <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightMedium}>
                      {assignedTo.fullName}
                    </Text>
                  </>
                ) : (
                  <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
                    Unassigned (Queue)
                  </Text>
                )}
              </View>
            </Dropdown>
          }
        />
      </View>
      <View backgroundColor="border" height={1} width="100%" />
      <Button
        backgroundColor="error_50"
        borderColor="error_200"
        icon={<DeleteOutlined />}
        justifyContent="center"
        onClick={onDeleteClick}
        size="md"
        textColor="error_600"
        variant="outline"
        width="100%"
      >
        Delete Lead
      </Button>
    </LeadDetailCard>
  );
};
