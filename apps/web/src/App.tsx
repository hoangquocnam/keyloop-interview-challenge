import { Layout, Menu, Space, Tag, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { appRoutes } from './app/routes.ts'

const navigationItems = [
  {
    key: 'login',
    label: 'Login',
    path: appRoutes.login,
  },
  {
    key: 'leads',
    label: 'Lead inbox',
    path: appRoutes.leads,
  },
] as const

const getSelectedNavigationKey = (pathname: string) => {
  if (pathname.startsWith(appRoutes.login)) {
    return 'login'
  }

  return 'leads'
}

export const App = () => {
  const location = useLocation()
  const navigate = useNavigate()

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

          <div className="app-shell__actions">
            <Menu
              mode="horizontal"
              selectable
              selectedKeys={[getSelectedNavigationKey(location.pathname)]}
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
          </div>
        </div>
      </Layout.Header>

      <Layout.Content className="app-shell__content">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
