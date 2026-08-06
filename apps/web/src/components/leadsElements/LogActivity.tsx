import {
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import type { ReactNode } from "react";

import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { Button, View } from "@/components/ui";
import {
  LeadActivityComposerMode,
  type LeadActivityComposerMode as LeadActivityComposerModeValue,
} from "@/constants/lead-detail.ts";
import { BORDERS, COLORS, FONT } from "@/theme/design-tokens.ts";

const { TextArea } = Input;

type LogActivityProps = {
  activityDraft: string;
  activityMode: LeadActivityComposerModeValue;
  isSubmitting?: boolean;
  onActivityDraftChange: (value: string) => void;
  onActivityModeChange: (value: LeadActivityComposerModeValue) => void;
  onSaveActivity: () => void;
};

const activityComposerModeMeta: Record<
  LeadActivityComposerModeValue,
  { label: string; icon: ReactNode }
> = {
  [LeadActivityComposerMode.CALL]: {
    icon: <PhoneOutlined />,
    label: "Call",
  },
  [LeadActivityComposerMode.EMAIL]: {
    icon: <MailOutlined />,
    label: "Email",
  },
  [LeadActivityComposerMode.NOTE]: {
    icon: <FileTextOutlined />,
    label: "Note",
  },
};

export const LogActivity = ({
  activityDraft,
  activityMode,
  isSubmitting = false,
  onActivityDraftChange,
  onActivityModeChange,
  onSaveActivity,
}: LogActivityProps) => {
  return (
    <LeadDetailCard
      title="Log Activity"
      titleIcon={
        <FileTextOutlined style={{ color: COLORS.textSecondary, fontSize: 24 }} />
      }
    >
      <View flexDirection="column" gap="md">
        <View flexWrap="wrap" gap="sm">
          {(
            Object.values(
              LeadActivityComposerMode,
            ) as LeadActivityComposerModeValue[]
          ).map((mode) => {
            const isSelected = activityMode === mode;

            return (
              <Button
                key={mode}
                disabled={isSubmitting}
                icon={activityComposerModeMeta[mode].icon}
                onClick={() => {
                  onActivityModeChange(mode);
                }}
                size="md"
                variant={isSelected ? "primary" : "outline"}
              >
                {activityComposerModeMeta[mode].label}
              </Button>
            );
          })}
        </View>

        <TextArea
          autoSize={{ maxRows: 6, minRows: 4 }}
          disabled={isSubmitting}
          onChange={(event) => {
            onActivityDraftChange(event.target.value);
          }}
          placeholder="Enter activity details or call notes here..."
          style={{
            borderRadius: BORDERS.radiusSm,
            fontFamily: FONT.fontFamily,
            fontSize: FONT.fontSizeLg,
            lineHeight: `${FONT.lineHeight}`,
            resize: "none",
          }}
          value={activityDraft}
        />

        <View justifyContent="flex-end">
          <Button
            disabled={activityDraft.trim().length === 0 || isSubmitting}
            loading={isSubmitting}
            onClick={onSaveActivity}
            size="md"
            variant="primary"
          >
            Save Activity
          </Button>
        </View>
      </View>
    </LeadDetailCard>
  );
};
