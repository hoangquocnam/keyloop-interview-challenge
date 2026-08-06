import {
  ClockCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { Text, View } from "@/components/ui";
import {
  LeadTimelineItemKind,
  type LeadTimelineItem,
} from "@/constants/lead-detail.ts";
import { COLORS, FONT } from "@/theme/design-tokens.ts";

type ActivityTimelineProps = {
  items: LeadTimelineItem[];
};

const timelineItemKindMeta: Record<
  LeadTimelineItem["kind"],
  { backgroundColor: string; icon: ReactNode }
> = {
  [LeadTimelineItemKind.CALL]: {
    backgroundColor: "gray100",
    icon: <PhoneOutlined style={{ color: COLORS.textSecondary, fontSize: 16 }} />,
  },
  [LeadTimelineItemKind.EMAIL]: {
    backgroundColor: "gray100",
    icon: <MailOutlined style={{ color: COLORS.textSecondary, fontSize: 16 }} />,
  },
  [LeadTimelineItemKind.NOTE]: {
    backgroundColor: "warning_50",
    icon: <FileTextOutlined style={{ color: COLORS.warning_700, fontSize: 16 }} />,
  },
  [LeadTimelineItemKind.SYSTEM]: {
    backgroundColor: "black",
    icon: <UserOutlined style={{ color: COLORS.white, fontSize: 16 }} />,
  },
};

export const ActivityTimeline = ({ items }: ActivityTimelineProps) => {
  return (
    <LeadDetailCard
      title="Activity Timeline"
      titleIcon={
        <ClockCircleOutlined style={{ color: COLORS.textSecondary, fontSize: 24 }} />
      }
    >
      <View flexDirection="column" gap="lg">
        {items.map((item, index) => {
          const itemMeta = timelineItemKindMeta[item.kind];
          const isLastItem = index === items.length - 1;

          return (
            <View key={item.id} minHeight={88} pl={52} position="relative">
              {!isLastItem ? (
                <View
                  backgroundColor="border"
                  bottom={-24}
                  left={18}
                  position="absolute"
                  top={36}
                  width={1}
                />
              ) : null}

              <View
                alignItems="center"
                backgroundColor={itemMeta.backgroundColor}
                borderColor="border"
                borderRadius={999}
                borderStyle="solid"
                borderWidth={1}
                height={36}
                justifyContent="center"
                left={0}
                position="absolute"
                top={0}
                width={36}
              >
                {itemMeta.icon}
              </View>

              <View flexDirection="column" gap="xs">
                <View
                  alignItems="flex-start"
                  flexDirection="row"
                  flexWrap="wrap"
                  gap="sm"
                  justifyContent="space-between"
                >
                  <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightSemibold}>
                    {item.title}{" "}
                    <Text
                      as="span"
                      color="textSecondary"
                      fontSize={FONT.fontSizeLg}
                      weight={FONT.fontWeightRegular}
                    >
                      by {item.actorName}
                    </Text>
                  </Text>
                  <Text
                    color="textSecondary"
                    fontSize={FONT.fontSizeMd}
                    weight={FONT.fontWeightSemibold}
                  >
                    {item.occurredAtLabel}
                  </Text>
                </View>

                <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </LeadDetailCard>
  );
};
