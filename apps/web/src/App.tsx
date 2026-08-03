import { Button, Layout, Menu, Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet, useNavigate } from 'react-router-dom'
import { appRoutes } from './app/routes.ts'
import { useRootStore } from './stores/use-root-store.ts'

const navigationItems = [
  {
    key: 'leads',
    label: 'Lead inbox',
    path: appRoutes.leads,
  },
] as const

const getSelectedNavigationKey = () => {
  return 'leads'
}

export const App = observer(() => {
  const navigate = useNavigate()
  const { auth } = useRootStore()

  return (
    <Layout className="app-shell">
      <Layout.Header className="app-shell__header">
        <div className="app-shell__header-content">
          <Space direction="vertical" size={4}>
            <div className="app-shell__brand">
              <Typography.Text strong>Sales Lead Management Tool</Typography.Text>
              <Tag>Scenario C</Tag>
            </div>
            <Typography.Text type="secondary">
              Frontend page routing scaffold only.
            </Typography.Text>
          </Space>

          <Space align="center" size="middle">
            <Menu
              mode="horizontal"
              selectable
              selectedKeys={[getSelectedNavigationKey()]}
              items={navigationItems.map((item) => ({
                key: item.key,
                label: item.label,
              }))}
              onClick={({ key }) => {
                const targetItem = navigationItems.find((item) => item.key === key)

                if (targetItem) {
                  void navigate(targetItem.path)
                }
              }}
            />
            <Space align="center" size={8}>
              <Space direction="vertical" size={0}>
                <Typography.Text strong>
                  {auth.currentUser?.fullName ?? 'Authenticated User'}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {auth.currentUser?.email}
                </Typography.Text>
              </Space>
              <Button
                onClick={() => {
                  auth.logout()
                  void navigate(appRoutes.login)
                }}
              >
                Sign Out
              </Button>
            </Space>
          </Space>
        </div>
      </Layout.Header>

      <Layout.Content className="app-shell__content">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
})
