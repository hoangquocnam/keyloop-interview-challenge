import { Card, Space, Typography, theme } from 'antd'
import { FONT } from '../../theme/design-tokens.ts'

export const LeadInboxPage = () => {
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
                lineHeight: FONT.lineHeightHeading,
              }}
            >
              Lead Inbox
            </Typography.Title>
            <Typography.Paragraph
              style={{
                margin: 0,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeLG,
              }}
            >
              Placeholder page for the lead inbox route. We can implement this
              screen separately in the next step.
            </Typography.Paragraph>
          </Space>
        </Card>
      </div>
    </main>
  )
}
