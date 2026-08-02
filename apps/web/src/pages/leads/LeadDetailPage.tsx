import { Card, Space, Typography, theme } from 'antd'
import { useParams } from 'react-router-dom'
import { designTokens } from '../../theme/design-tokens.ts'

export const LeadDetailPage = () => {
  const { leadId } = useParams()
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
              Lead Detail
            </Typography.Title>
            <Typography.Paragraph
              style={{
                margin: 0,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeLG,
              }}
            >
              Placeholder page for lead detail route
              {leadId ? `: ${leadId}` : ''}. We can implement this screen when
              you give the next command.
            </Typography.Paragraph>
          </Space>
        </Card>
      </div>
    </main>
  )
}
