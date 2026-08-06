import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import {
  shellFooterLinks,
  shellNavigationItems,
  type ShellNavigationKey,
} from "../../constants/mocks.ts";
import type { ReactNode } from "react";
import { COLORS, FONT } from "@/theme/design-tokens.ts";
import { Text, View, Button } from "@/components/ui";

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
      backgroundColor="gray100"
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
              borderRadius={8}
              height={40}
              justifyContent="center"
              width={40}
            >
              <HomeOutlined style={{ color: COLORS.white, fontSize: 16 }} />
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
                backgroundColor={isActive ? "gray300" : "transparent"}
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
                  <Text
                    fontSize={FONT.fontSizeLg}
                    weight={
                      isActive ? FONT.fontWeightBold : FONT.fontWeightMedium
                    }
                  >
                    {item.label}
                  </Text>
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
              <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightSemibold}>
                {item.label}
              </Text>
            </View>
          </Button>
        ))}

        <Button
          alignItems="center"
          textColor="textSecondary"
          display="flex"
          fontSize={FONT.fontSizeMd}
          fontWeight={FONT.fontWeightMedium}
          height={38}
          justifyContent="flex-start"
          onClick={onSignOut}
          px={0}
          variant="link"
        >
          <View alignItems="center" flexDirection="row" gap="sm">
            <LogoutOutlined style={{ fontSize: 18, color: COLORS.error }} />
            <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightSemibold} color="error">
              Sign Out
            </Text>
          </View>
        </Button>

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
            <Text color="textTertiary" fontSize={FONT.fontSizeMd}>
              {userEmail}
            </Text>

            <View alignItems="center" flexDirection="row" gap="xs"></View>
          </View>
        </View>
      </View>
    </View>
  );
};
