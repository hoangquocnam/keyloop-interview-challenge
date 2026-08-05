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
import { queryClient } from "./app/query-client.ts";
import { queryKeys } from "./app/query-keys.ts";
import { BORDERS, COLORS, FONT } from "./theme/design-tokens.ts";

const getSelectedNavigationKey = (pathname: string): ShellNavigationKey => {
  if (pathname.startsWith(appRoutes.dashboard)) {
    return "dashboard";
  }

  return "leads";
};

export const App = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const rootStore = useRootStore();
  const { auth, lead } = rootStore;
  const selectedNavigationKey = getSelectedNavigationKey(location.pathname);
  const isLeadsRoute = selectedNavigationKey === "leads";
  const userInitials =
    auth.currentUser?.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "LS";

  return (
    <View
      backgroundColor="pageBg"
      display="flex"
      minHeight="100vh"
      p="md"
      width="100%"
    >
      <View
        backgroundColor="surface"
        borderColor="border"
        borderRadius={BORDERS.radiusLg}
        borderStyle="solid"
        borderWidth={1}
        display="grid"
        flex={1}
        gridTemplateColumns="244px minmax(0, 1fr)"
        overflow="hidden"
        width="100%"
      >
        <Sidebar
          onNavigate={(path) => {
            void navigate(path);
          }}
          onSignOut={() => {
            queryClient.removeQueries({ queryKey: queryKeys.leadInbox(lead.query) });
            rootStore.logOut();
            void navigate(appRoutes.login);
          }}
          selectedNavigationKey={selectedNavigationKey}
          userEmail={auth.currentUser?.email ?? "agent@leadstream.com"}
          userInitials={userInitials}
        />

        <View
          display="grid"
          gridTemplateRows="67px minmax(0, 1fr)"
          minWidth={0}
          width="100%"
        >
          <View
            alignItems="center"
            backgroundColor="surface"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="border"
            flexWrap="wrap"
            gap="md"
            justifyContent="space-between"
            px="lg"
            py="md"
            width="100%"
          >
            <Input
              allowClear
              disabled={!isLeadsRoute}
              onChange={(event) => {
                if (isLeadsRoute) {
                  lead.setSearchInput(event.target.value);
                }
              }}
              placeholder={shellTopbarContent.searchPlaceholder}
              prefix={
                <SearchOutlined style={{ color: COLORS.textSecondary }} />
              }
              size="large"
              style={{
                borderRadius: 2,
                fontSize: FONT.fontSizeMd,
                height: 40,
                maxWidth: 440,
                width: "100%",
              }}
              value={isLeadsRoute ? lead.searchInput : ""}
            />

            <View alignItems="center" flexDirection="row" gap="md">
              <Badge dot offset={[-2, 4]}>
                <Button
                  icon={<BellOutlined style={{ fontSize: 16 }} />}
                  textColor="textSecondary"
                  size="sm"
                  width={34}
                  variant="link"
                />
              </Badge>

              <View backgroundColor="border" height={28} width={1} />

              <Button
                borderRadius={2}
                fontWeight={FONT.fontWeightBold}
                icon={<PlusOutlined />}
                onClick={() => {
                  void navigate(appRoutes.leads);
                }}
                px="md"
                size="md"
                variant="primary"
              >
                {shellTopbarContent.newLeadLabel}
              </Button>
            </View>
          </View>

          <View
            as="main"
            backgroundColor="gray50"
            minWidth={0}
            overflow="auto"
            px="lg"
            py="lg"
            width="100%"
          >
            <View flexDirection="column" gap="lg" width="100%">
              <Outlet />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
