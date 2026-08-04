import { Avatar, Checkbox } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from '../Button'
import type { LeadInboxRow } from '../../constants/mocks.ts'
import { Text } from '../Text/index.ts'
import { View } from '../View/index.ts'
import {
  BORDERS,
  COLORS,
  FONT,
  SHADOW,
  SPACING,
} from '../../theme/design-tokens.ts'
import { LeadStatusBadge } from './LeadStatusBadge.tsx'

const tableTemplateColumns =
  '40px minmax(138px, 1.2fr) minmax(170px, 1.3fr) minmax(112px, 0.9fr) minmax(108px, 0.9fr) minmax(130px, 1fr) minmax(126px, 1fr)'

const columnLabels = [
  '',
  'CUSTOMER NAME',
  'CONTACT INFO',
  'SOURCE',
  'STATUS',
  'ASSIGNED TO',
  'LAST ACTIVITY',
] as const

type LeadInboxTableProps = {
  readonly currentPage: number
  readonly pages: readonly number[]
  readonly rows: readonly LeadInboxRow[]
  readonly summaryLabel: string
}

export const LeadInboxTable = ({
  currentPage,
  pages,
  rows,
  summaryLabel,
}: LeadInboxTableProps) => {
  return (
    <View
      backgroundColor={COLORS.surface}
      borderColor={COLORS.borderSecondary}
      borderRadius={BORDERS.radiusMd}
      borderStyle="solid"
      borderWidth={1}
      boxShadow={SHADOW.card}
      overflow="hidden"
      width="100%"
    >
      <View overflow="auto">
        <View minWidth={860}>
          <View
            alignItems="center"
            backgroundColor={COLORS.gray50}
            borderBottom={`1px solid ${COLORS.borderSecondary}`}
            display="grid"
            px={SPACING.sm}
            py={SPACING.xs}
            style={{ gridTemplateColumns: tableTemplateColumns }}
          >
            {columnLabels.map((label, index) => (
              <View key={label || `col-${index}`} px={6}>
                {index === 0 ? (
                  <Checkbox checked={false} />
                ) : (
                  <Text
                    color={COLORS.textSecondary}
                    fontSize={11}
                    style={{ letterSpacing: 0.4 }}
                    weight={FONT.fontWeightBold}
                  >
                    {label}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {rows.map((row) => (
            <View
              key={row.id}
              alignItems="center"
              backgroundColor={row.isSelected ? COLORS.gray50 : COLORS.white}
              borderBottom={`1px solid ${COLORS.borderSecondary}`}
              display="grid"
              px={SPACING.sm}
              py={SPACING.sm}
              style={{
                borderLeft: row.isSelected
                  ? `3px solid ${COLORS.info}`
                  : '3px solid transparent',
                gridTemplateColumns: tableTemplateColumns,
              }}
            >
              <View px={6}>
                <Checkbox checked={row.isSelected} />
              </View>

              <View alignItems="center" flexDirection="row" gap={6} px={6}>
                <View
                  backgroundColor={row.hasUnreadIndicator ? '#3b82f6' : 'transparent'}
                  borderRadius={BORDERS.radiusPill}
                  height={8}
                  width={8}
                />
                <Text fontSize={FONT.fontSizeMd} weight={FONT.fontWeightSemibold}>
                  {row.customerName}
                </Text>
              </View>

              <View flexDirection="column" px={6}>
                <Text fontSize={FONT.fontSizeMd} weight={FONT.fontWeightMedium}>
                  {row.contactEmail}
                </Text>
                <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
                  {row.phone}
                </Text>
              </View>

              <View px={6}>
                <Text fontSize={FONT.fontSizeMd}>{row.source}</Text>
              </View>

              <View px={6}>
                <LeadStatusBadge label={row.statusLabel} tone={row.statusTone} />
              </View>

              <View alignItems="center" flexDirection="row" gap={SPACING.xs} px={6}>
                {row.assignedTo ? (
                  <>
                    <Avatar
                      size={28}
                      style={{
                        backgroundColor: '#5b6474',
                        color: COLORS.white,
                        fontSize: FONT.fontSizeXs,
                        fontWeight: FONT.fontWeightBold,
                      }}
                    >
                      {row.assignedTo.initials}
                    </Avatar>
                    <Text
                      fontSize={FONT.fontSizeMd}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {row.assignedTo.fullName}
                    </Text>
                  </>
                ) : (
                  <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
                    Unassigned
                  </Text>
                )}
              </View>

              <View px={6}>
                <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
                  {row.lastActivity}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        alignItems="center"
        justifyContent="space-between"
        px={SPACING.sm}
        py={SPACING.sm}
      >
        <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeMd}>
          {summaryLabel}
        </Text>

        <View alignItems="center" flexDirection="row" gap={6}>
          <Button icon={<LeftOutlined />} size="middle" variant="outline" />
          {pages.map((page) => (
            <Button
              key={page}
              size="middle"
              style={{
                borderColor: COLORS.border,
                minWidth: 34,
              }}
              variant={page === currentPage ? 'primary' : 'outline'}
            >
              {page}
            </Button>
          ))}
          <Button disabled size="middle" variant="outline">
            ...
          </Button>
          <Button icon={<RightOutlined />} size="middle" variant="outline" />
        </View>
      </View>
    </View>
  )
}
