import type { LeadStatusTone } from '../../constants/mocks.ts'
import { Text } from '../Text/index.ts'
import { View } from '../View/index.ts'
import { BORDERS, COLORS, FONT, SPACING } from '../../theme/design-tokens.ts'

const toneStyles: Record<
  LeadStatusTone,
  {
    readonly backgroundColor: string
    readonly borderColor: string
    readonly color: string
  }
> = {
  info: {
    backgroundColor: '#eef4ff',
    borderColor: '#cfe0ff',
    color: COLORS.info,
  },
  neutral: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray200,
    color: COLORS.gray700,
  },
  success: {
    backgroundColor: '#ecfdf3',
    borderColor: '#b7efd0',
    color: '#0d8a55',
  },
}

type LeadStatusBadgeProps = {
  readonly label: string
  readonly tone: LeadStatusTone
}

export const LeadStatusBadge = ({
  label,
  tone,
}: LeadStatusBadgeProps) => {
  const toneStyle = toneStyles[tone]

  return (
    <View
      alignItems="center"
      backgroundColor={toneStyle.backgroundColor}
      borderColor={toneStyle.borderColor}
      borderRadius={BORDERS.radiusXs}
      borderStyle="solid"
      borderWidth={1}
      justifyContent="center"
      minWidth={62}
      px={SPACING.xs}
      py={4}
      width="fit-content"
    >
      <Text
        color={toneStyle.color}
        fontSize={FONT.fontSizeSm}
        style={{ letterSpacing: 0.6 }}
        weight={FONT.fontWeightBold}
      >
        {label}
      </Text>
    </View>
  )
}
