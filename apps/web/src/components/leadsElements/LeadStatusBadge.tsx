import type { LeadStatusValue } from "../../enums/lead.enums.ts";
import { Text, View } from "@/components/ui";
import { FONT } from "@/theme/design-tokens.ts";

const statusStyles: Record<
  LeadStatusValue,
  {
    backgroundColor: string;
    borderColor: string;
    color: string;
  }
> = {
  CONTACTED: {
    backgroundColor: "warning_50",
    borderColor: "warning_200",
    color: "warning_700",
  },
  LOST: {
    backgroundColor: "error_50",
    borderColor: "error_200",
    color: "error_700",
  },
  NEW: {
    backgroundColor: "gray100",
    borderColor: "gray200",
    color: "gray700",
  },
  QUALIFIED: {
    backgroundColor: "info_50",
    borderColor: "info_200",
    color: "info_700",
  },
  WON: {
    backgroundColor: "success_50",
    borderColor: "success_200",
    color: "success_500",
  },
};

type LeadStatusBadgeProps = {
  label: string;
  value: LeadStatusValue;
};

export const LeadStatusBadge = ({ label, value }: LeadStatusBadgeProps) => {
  const toneStyle = statusStyles[value];

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
  );
};
