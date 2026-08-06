import { DeleteOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { LeadDetailInfoRow } from "@/components/leadsElements/LeadDetailInfoRow.tsx";
import { Button, Text, View } from "@/components/ui";
import type { LeadInboxAssignee } from "@/services/lead.types.ts";
import { COLORS, FONT } from "@/theme/design-tokens.ts";

type LeadDetailsProps = {
  assignedTo: LeadInboxAssignee | null;
  createdAtLabel: string;
  onDeleteClick: () => void;
  sourceLabel: string;
};

export const LeadDetails = ({
  assignedTo,
  createdAtLabel,
  onDeleteClick,
  sourceLabel,
}: LeadDetailsProps) => {
  return (
    <LeadDetailCard title="LEAD DETAILS">
      <View backgroundColor="border" height={1} width="100%" />
      <View flexDirection="column" gap="lg">
        <LeadDetailInfoRow label="Source" value={sourceLabel} />
        <LeadDetailInfoRow label="Created" value={createdAtLabel} />
        <LeadDetailInfoRow
          label="Assigned To"
          value={
            assignedTo ? (
              <View alignItems="center" flexDirection="row" gap="sm">
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
              </View>
            ) : (
              <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
                Unassigned
              </Text>
            )
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
