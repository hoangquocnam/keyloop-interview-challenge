import { Card, Space, Typography, theme } from 'antd'
import { designTokens } from '../../theme/design-tokens.ts'

export const LoginPage = () => {
  const { token } = theme.useToken()

  return (
    <main className="app-page">
      <div className="app-page__content app-page__content--narrow">
        <Card>
          <Space direction="vertical" size={token.marginMD} style={{ display: 'flex' }}>
            <Typography.Title
              level={1}
              style={{
                margin: 0,
                lineHeight: designTokens.typography.lineHeightHeading,
              }}
            >
              Login
            </Typography.Title>
            <Typography.Paragraph
              style={{
                margin: 0,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeLG,
              }}
            >
              Placeholder page for the login route. We can build the actual login
              form in a separate task.
            </Typography.Paragraph>
          </Space>
        </Card>
      </div>
    </main>
  )
}
