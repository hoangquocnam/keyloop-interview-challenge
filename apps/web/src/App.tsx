import { BellOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Input } from "antd";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { appRoutes } from "./app/routes.ts";
import { Button } from "./components/Button";
import {
  type ShellNavigationKey,
  shellTopbarContent,
} from "./constants/mocks.ts";
import { Sidebar } from "./components/Sidebar";
import { useRootStore } from "./stores/use-root-store.ts";
import { View } from "./components/View/index.ts";
import { BORDERS, COLORS, FONT, SPACING } from "./theme/design-tokens.ts";

const getSelectedNavigationKey = (pathname: string): ShellNavigationKey => {
  if (pathname.startsWith(appRoutes.dashboard)) {
    return "dashboard";
  }

  return "leads";
};

export const App = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useRootStore();
  const selectedNavigationKey = getSelectedNavigationKey(location.pathname);
  const userInitials =
    auth.currentUser?.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "LS";

  return (
    <View
      backgroundColor={COLORS.pageBg}
      display="flex"
      minHeight="100vh"
      p={SPACING.md}
      width="100%"
    >
      <View
        backgroundColor={COLORS.surface}
        borderColor={COLORS.border}
        borderRadius={BORDERS.radiusLg}
        borderStyle="solid"
        borderWidth={1}
        display="grid"
        flex={1}
        overflow="hidden"
        style={{ gridTemplateColumns: "244px minmax(0, 1fr)" }}
        width="100%"
      >
        <Sidebar
          onNavigate={(path) => {
            void navigate(path);
          }}
          onSignOut={() => {
            auth.logout();
            void navigate(appRoutes.login);
          }}
          selectedNavigationKey={selectedNavigationKey}
          userEmail={auth.currentUser?.email ?? "agent@leadstream.com"}
          userInitials={userInitials}
        />

        <View
          display="grid"
          minWidth={0}
          style={{ gridTemplateRows: "67px minmax(0, 1fr)" }}
          width="100%"
        >
          <View
            alignItems="center"
            backgroundColor={COLORS.surface}
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor={COLORS.border}
            gap={SPACING.md}
            justifyContent="space-between"
            px={SPACING.lg}
            py={SPACING.md}
            style={{ flexWrap: "wrap" }}
            width="100%"
          >
            <Input
              placeholder={shellTopbarContent.searchPlaceholder}
              prefix={
                <SearchOutlined style={{ color: COLORS.textSecondary }} />
              }
              size="large"
              style={{
                borderRadius: BORDERS.radiusXs,
                fontSize: FONT.fontSizeMd,
                height: 34,
                maxWidth: 440,
                width: "100%",
              }}
            />

            <View alignItems="center" flexDirection="row" gap={SPACING.md}>
              <Badge dot offset={[-2, 4]}>
                <Button
                  icon={<BellOutlined style={{ fontSize: 16 }} />}
                  size="large"
                  style={{
                    color: COLORS.textSecondary,
                    height: 34,
                    width: 34,
                  }}
                  variant="link"
                />
              </Badge>

              <View backgroundColor={COLORS.border} height={28} width={1} />

              <Button
                icon={<PlusOutlined />}
                size="large"
                onClick={() => {
                  void navigate(appRoutes.leads);
                }}
                style={{
                  fontSize: FONT.fontSizeMd,
                  fontWeight: FONT.fontWeightBold,
                  height: 34,
                  paddingInline: 16,
                }}
                variant="primary"
              >
                {shellTopbarContent.newLeadLabel}
              </Button>
            </View>
          </View>

          <View
            as="main"
            backgroundColor={COLORS.gray50}
            minWidth={0}
            overflow="auto"
            px={SPACING.lg}
            py={SPACING.lg}
            width="100%"
          >
            <View flexDirection="column" gap={SPACING.lg} width="100%">
              <Outlet />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
