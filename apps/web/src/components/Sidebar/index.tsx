import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { Button } from "../Button";
import {
  shellFooterLinks,
  shellNavigationItems,
  type ShellNavigationKey,
} from "../../constants/mocks.ts";
import type { ReactNode } from "react";
import { COLORS, FONT } from "../../theme/design-tokens.ts";
import { Text } from "../Text/index.ts";
import { View } from "../View/index.ts";

const navigationIconMap: Record<ShellNavigationKey, ReactNode> = {
  dashboard: <AppstoreOutlined style={{ fontSize: 18 }} />,
  leads: <TeamOutlined style={{ fontSize: 18 }} />,
};

const footerIconMap = {
  settings: <SettingOutlined style={{ fontSize: 18 }} />,
  support: <QuestionCircleOutlined style={{ fontSize: 18 }} />,
} as const;

type SidebarProps = {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  selectedNavigationKey: ShellNavigationKey;
  userEmail: string;
  userInitials: string;
};

export const Sidebar = ({
  onNavigate,
  onSignOut,
  selectedNavigationKey,
  userEmail,
  userInitials,
}: SidebarProps) => {
  return (
    <View
      backgroundColor="surface"
      border="1px solid #e5e7eb"
      flexDirection="column"
      justifyContent="space-between"
      width={244}
    >
      <View flexDirection="column">
        <View px="md" py="lg">
          <View alignItems="center" flexDirection="row" gap="sm">
            <View
              alignItems="center"
              backgroundColor="black"
              borderRadius={2}
              height={34}
              justifyContent="center"
              width={34}
            >
              <AppstoreOutlined style={{ color: COLORS.white, fontSize: 16 }} />
            </View>

            <View flexDirection="column" gap={2}>
              <Text fontSize={FONT.fontSizeXl} weight={FONT.fontWeightBold}>
                LeadStream
              </Text>
              <Text color="textSecondary" fontSize={FONT.fontSizeMd}>
                Sales Portal
              </Text>
            </View>
          </View>
        </View>

        <View flexDirection="column" py="sm">
          {shellNavigationItems.map((item) => {
            const isActive = item.key === selectedNavigationKey;

            return (
              <Button
                alignItems="center"
                backgroundColor={isActive ? "gray100" : "transparent"}
                borderRadius={0}
                textColor="text"
                display="flex"
                fontSize={FONT.fontSizeLg}
                fontWeight={
                  isActive ? FONT.fontWeightBold : FONT.fontWeightMedium
                }
                height={42}
                justifyContent="flex-start"
                key={item.key}
                onClick={() => {
                  onNavigate(item.path);
                }}
                px="md"
                style={{
                  borderInlineStart: isActive
                    ? `4px solid ${COLORS.black}`
                    : "4px solid transparent",
                }}
                variant="link"
              >
                <View alignItems="center" flexDirection="row" gap="sm">
                  {navigationIconMap[item.key]}
                  <span>{item.label}</span>
                </View>
              </Button>
            );
          })}
        </View>
      </View>

      <View
        borderColor="border"
        borderTopStyle="solid"
        borderTopWidth={1}
        flexDirection="column"
        gap="xs"
        px="md"
        py="md"
      >
        {shellFooterLinks.map((item) => (
          <Button
            alignItems="center"
            textColor="textSecondary"
            display="flex"
            fontSize={FONT.fontSizeMd}
            fontWeight={FONT.fontWeightMedium}
            height={38}
            justifyContent="flex-start"
            key={item.key}
            px={0}
            variant="link"
          >
            <View alignItems="center" flexDirection="row" gap="sm">
              {footerIconMap[item.key]}
              <span>{item.label}</span>
            </View>
          </Button>
        ))}

        <Button
          alignItems="center"
          display="flex"
          height={52}
          justifyContent="flex-start"
          onClick={onSignOut}
          px={0}
          variant="link"
        >
          <View alignItems="center" flexDirection="row" gap="sm">
            <Avatar
              size={30}
              style={{
                backgroundColor: "#dbeafe",
                color: COLORS.black,
                fontSize: FONT.fontSizeXs,
                fontWeight: FONT.fontWeightBold,
              }}
            >
              {userInitials}
            </Avatar>
            <View flexDirection="column" gap={2}>
              <Text
                color="text"
                fontSize={FONT.fontSizeMd}
                weight={FONT.fontWeightMedium}
              >
                Sign Out
              </Text>
              <Text color="textTertiary" fontSize={FONT.fontSizeSm}>
                {userEmail}
              </Text>
            </View>
          </View>
        </Button>
      </View>
    </View>
  );
};
