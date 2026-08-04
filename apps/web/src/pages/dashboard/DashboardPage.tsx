import { Empty } from 'antd'
import { dashboardPageContent } from '../../constants/mocks.ts'
import { Text } from '../../components/Text/index.ts'
import { View } from '../../components/View/index.ts'
import {
  BORDERS,
  COLORS,
  FONT,
  SHADOW,
  SPACING,
} from '../../theme/design-tokens.ts'

export const DashboardPage = () => {
  return (
    <View flexDirection="column" gap={SPACING.lg}>
      <View flexDirection="column" gap={SPACING.xs}>
        <Text
          as="h1"
          fontSize={FONT.fontSize2Xl}
          m={0}
          style={{ lineHeight: FONT.lineHeightHeading }}
          weight={FONT.fontWeightBold}
        >
          {dashboardPageContent.title}
        </Text>
        <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeLg}>
          {dashboardPageContent.description}
        </Text>
      </View>

      <View
        alignItems="center"
        backgroundColor={COLORS.surface}
        borderColor={COLORS.borderSecondary}
        borderRadius={BORDERS.radiusMd}
        borderStyle="solid"
        borderWidth={1}
        boxShadow={SHADOW.card}
        justifyContent="center"
        minHeight={260}
        p={SPACING.lg}
      >
        <Empty description="Dashboard widgets have not been designed yet." />
      </View>
    </View>
  )
}
