import type { LeadStatusTone } from '../../enums/lead.enums.ts'
import { Text, View } from "@/components/ui"
import { FONT } from '@/theme/design-tokens.ts'

const toneStyles: Record<
  LeadStatusTone,
  {
    backgroundColor: string
    borderColor: string
    color: string
  }
> = {
  info: {
    backgroundColor: 'info_50',
    borderColor: 'info_100',
    color: 'info',
  },
  neutral: {
    backgroundColor: 'gray100',
    borderColor: 'gray200',
    color: 'gray700',
  },
  success: {
    backgroundColor: 'success_50',
    borderColor: 'success_200',
    color: 'success',
  },
}

type LeadStatusBadgeProps = {
  label: string
  tone: LeadStatusTone
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
      borderRadius={2}
      borderStyle="solid"
      borderWidth={1}
      justifyContent="center"
      minWidth={62}
      px="xs"
      py={4}
      width="fit-content"
    >
      <Text
        color={toneStyle.color}
        fontSize={FONT.fontSizeSm}
        letterSpacing={0.6}
        weight={FONT.fontWeightBold}
      >
        {label}
      </Text>
    </View>
  )
}
