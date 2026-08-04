import { DownOutlined, FilterOutlined } from '@ant-design/icons'
import { Button } from '../../components/Button'
import { LeadInboxTable } from '../../components/LeadInbox/index.ts'
import { Text } from '../../components/Text/index.ts'
import { View } from '../../components/View/index.ts'
import { leadInboxContent, leadInboxRows } from '../../constants/mocks.ts'
import {
  BORDERS,
  COLORS,
  FONT,
  SHADOW,
  SPACING,
} from '../../theme/design-tokens.ts'

export const LeadInboxPage = () => {
  return (
    <View flexDirection="column" gap={SPACING.md} >
      <View flexDirection="column" gap={SPACING.xs}>
        <Text
          as="h1"
          fontSize={24}
          m={0}
          style={{ lineHeight: FONT.lineHeightHeading }}
          weight={FONT.fontWeightBold}
        >
          {leadInboxContent.title}
        </Text>
        <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
          {leadInboxContent.summary}
        </Text>
      </View>

      <View
        backgroundColor={COLORS.surface}
        borderColor={COLORS.borderSecondary}
        borderRadius={BORDERS.radiusMd}
        borderStyle="solid"
        borderWidth={1}
        boxShadow={SHADOW.card}
        flexDirection="row"
        gap={SPACING.sm}
        p={SPACING.sm}
        style={{ flexWrap: 'wrap' }}
        width="100%"
      >
        {leadInboxContent.filters.map((filter) => {
          const icon =
            filter.key === 'more-filters' ? (
              <FilterOutlined />
            ) : (
              <DownOutlined style={{ fontSize: 12 }} />
            )

          return (
            <Button
              key={filter.key}
              icon={icon}
              iconPosition={filter.key === 'more-filters' ? 'start' : 'end'}
              size="large"
              style={{
                color: COLORS.text,
                fontSize: FONT.fontSizeSm,
                height: 30,
                paddingInline: 12,
              }}
              variant="outline"
            >
              {filter.label}
            </Button>
          )
        })}
      </View>

      <LeadInboxTable
        currentPage={leadInboxContent.pagination.currentPage}
        pages={leadInboxContent.pagination.pages}
        rows={leadInboxRows}
        summaryLabel={leadInboxContent.pagination.summaryLabel}
      />
    </View>
  )
}
