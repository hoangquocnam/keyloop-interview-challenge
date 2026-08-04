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
import { BORDERS, COLORS, FONT, SPACING } from "../../theme/design-tokens.ts";
import { Text } from "../Text/index.ts";
import { View } from "../View/index.ts";

const navigationIconMap: Record<ShellNavigationKey, JSX.Element> = {
  dashboard: <AppstoreOutlined style={{ fontSize: 18 }} />,
  leads: <TeamOutlined style={{ fontSize: 18 }} />,
};

const footerIconMap = {
  settings: <SettingOutlined style={{ fontSize: 18 }} />,
  support: <QuestionCircleOutlined style={{ fontSize: 18 }} />,
} as const;

type SidebarProps = {
  readonly onNavigate: (path: string) => void;
  readonly onSignOut: () => void;
  readonly selectedNavigationKey: ShellNavigationKey;
  readonly userEmail: string;
  readonly userInitials: string;
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
      backgroundColor={COLORS.surface}
      borderColor={COLORS.border}
      borderRightStyle="solid"
      borderRightWidth={1}
      flexDirection="column"
      justifyContent="space-between"
      width={244}
    >
      <View flexDirection="column">
        <View px={SPACING.md} py={SPACING.lg}>
          <View alignItems="center" flexDirection="row" gap={SPACING.sm}>
            <View
              alignItems="center"
              backgroundColor={COLORS.black}
              borderRadius={BORDERS.radiusMd}
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
              <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
                Sales Portal
              </Text>
            </View>
          </View>
        </View>

        <View flexDirection="column" py={SPACING.sm}>
          {shellNavigationItems.map((item) => {
            const isActive = item.key === selectedNavigationKey;

            return (
              <Button
                key={item.key}
                onClick={() => {
                  onNavigate(item.path);
                }}
                style={{
                  alignItems: "center",
                  backgroundColor: isActive ? COLORS.gray100 : "transparent",
                  borderInlineStart: isActive
                    ? `4px solid ${COLORS.black}`
                    : "4px solid transparent",
                  borderRadius: 0,
                  color: COLORS.text,
                  display: "flex",
                  fontSize: FONT.fontSizeLg,
                  fontWeight: isActive
                    ? FONT.fontWeightBold
                    : FONT.fontWeightMedium,
                  height: 42,
                  justifyContent: "flex-start",
                  paddingInline: SPACING.md,
                }}
                variant="link"
              >
                <View alignItems="center" flexDirection="row" gap={SPACING.sm}>
                  {navigationIconMap[item.key]}
                  <span>{item.label}</span>
                </View>
              </Button>
            );
          })}
        </View>
      </View>

      <View
        borderColor={COLORS.border}
        borderTopStyle="solid"
        borderTopWidth={1}
        flexDirection="column"
        gap={SPACING.xs}
        px={SPACING.md}
        py={SPACING.md}
      >
        {shellFooterLinks.map((item) => (
          <Button
            key={item.key}
            style={{
              alignItems: "center",
              color: COLORS.textSecondary,
              display: "flex",
              fontSize: FONT.fontSizeMd,
              fontWeight: FONT.fontWeightMedium,
              height: 38,
              justifyContent: "flex-start",
              paddingInline: 0,
            }}
            variant="link"
          >
            <View alignItems="center" flexDirection="row" gap={SPACING.sm}>
              {footerIconMap[item.key]}
              <span>{item.label}</span>
            </View>
          </Button>
        ))}

        <Button
          onClick={onSignOut}
          style={{
            alignItems: "center",
            display: "flex",
            height: 52,
            justifyContent: "flex-start",
            paddingInline: 0,
          }}
          variant="link"
        >
          <View alignItems="center" flexDirection="row" gap={SPACING.sm}>
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
                color={COLORS.text}
                fontSize={FONT.fontSizeMd}
                weight={FONT.fontWeightMedium}
              >
                Sign Out
              </Text>
              <Text color={COLORS.textTertiary} fontSize={FONT.fontSizeSm}>
                {userEmail}
              </Text>
            </View>
          </View>
        </Button>
      </View>
    </View>
  );
};
