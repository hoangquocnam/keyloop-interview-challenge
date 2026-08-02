import {
  Alert,
  Card,
  Descriptions,
  List,
  Space,
  Tag,
  Typography,
  theme,
} from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchApiHealth } from '../../services/health.ts'
import { designTokens } from '../../theme/design-tokens.ts'

const leadChecklist = [
  'Lead inbox with website submissions',
  'Lead detail page with contact history',
  'Follow-up activity logging flow',
]

const componentReasons = [
  'Ant Design gives us mature Table, Form, Badge, Drawer, and Notification primitives for internal tooling.',
  'The token system is enough to centralize typography, colors, spacing, and border rules early.',
  'It keeps delivery fast for the interview without forcing us to hand-build every input and data display pattern.',
]

const themePreview = [
  { label: 'Font family', value: designTokens.typography.fontFamily },
  { label: 'Base font size', value: `${designTokens.typography.fontSizeMd}px` },
  {
    label: 'Spacing scale',
    value: `8 / 12 / 16 / 24 / 32 / 40`,
  },
  {
    label: 'Border radius',
    value: `${designTokens.border.radiusSm}px / ${designTokens.border.radiusMd}px / ${designTokens.border.radiusLg}px`,
  },
]

export const LeadInboxPage = () => {
  const { token } = theme.useToken()
  const healthQuery = useQuery({
    queryKey: ['api-health'],
    queryFn: fetchApiHealth,
  })

  const healthAlertType = healthQuery.isError
    ? 'error'
    : healthQuery.data?.status === 'ok'
      ? 'success'
      : 'info'

  const healthMessage = healthQuery.isError
    ? 'API is not reachable yet.'
    : healthQuery.isLoading
      ? 'Checking API connection...'
      : `Connected to ${healthQuery.data?.service}`

  return (
    <main className="app-page">
      <div className="app-page__content app-stack">
        <Card
          styles={{
            body: {
              padding: token.paddingXL,
            },
          }}
        >
          <Space direction="vertical" size={token.marginMD} style={{ display: 'flex' }}>
            <div className="app-inline-tags">
              <Tag>Scenario C</Tag>
              <Tag color="success">Success</Tag>
              <Tag color="error">Error</Tag>
              <Tag color="warning">Warning</Tag>
              <Tag color="processing">Info</Tag>
            </div>

            <Space direction="vertical" size={token.marginXS} style={{ display: 'flex' }}>
              <Typography.Title
                level={1}
                style={{
                  margin: 0,
                  lineHeight: designTokens.typography.lineHeightHeading,
                }}
              >
                Sales Lead Management Tool
              </Typography.Title>
              <Typography.Paragraph
                style={{
                  maxWidth: 760,
                  margin: 0,
                  color: token.colorTextSecondary,
                  fontSize: token.fontSizeLG,
                }}
              >
                Ant Design is now wired into the frontend as the primary UI
                library. The starter screen below previews the typography,
                semantic colors, spacing scale, and card/list patterns that the
                app will use as we build the inbox and lead detail workflows.
              </Typography.Paragraph>
            </Space>
          </Space>
        </Card>

        <section className="app-grid">
          <Card title="Frontend direction">
            <List
              dataSource={leadChecklist}
              renderItem={(item) => (
                <List.Item style={{ paddingInline: 0 }}>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Why Ant Design for this challenge">
            <List
              dataSource={componentReasons}
              renderItem={(item) => (
                <List.Item style={{ paddingInline: 0 }}>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Theme preview">
            <Descriptions
              column={1}
              items={themePreview.map((item) => ({
                key: item.label,
                label: item.label,
                children: item.value,
              }))}
            />
          </Card>

          <Card title="Backend wiring">
            <Space direction="vertical" size={token.marginMD} style={{ display: 'flex' }}>
              <dl className="app-kv-list">
                <div>
                  <dt>API base URL</dt>
                  <dd>{import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}</dd>
                </div>
                <div>
                  <dt>Swagger</dt>
                  <dd>http://localhost:3000/docs</dd>
                </div>
                <div>
                  <dt>Theme surface</dt>
                  <dd>{token.colorBgContainer}</dd>
                </div>
              </dl>

              <Alert
                showIcon
                type={healthAlertType}
                message={healthMessage}
                description={
                  healthQuery.data?.timestamp
                    ? `Latest response at ${healthQuery.data.timestamp}`
                    : 'Start the API locally to see live health feedback here.'
                }
              />
            </Space>
          </Card>
        </section>
      </div>
    </main>
  )
}
