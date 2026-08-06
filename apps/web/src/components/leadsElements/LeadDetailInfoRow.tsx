import type { ReactNode } from "react";

import { Text, View } from "@/components/ui";
import { FONT } from "@/theme/design-tokens.ts";

type LeadDetailInfoRowProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
};

export const LeadDetailInfoRow = ({
  icon,
  label,
  value,
}: LeadDetailInfoRowProps) => {
  return (
    <View alignItems="flex-start" flexDirection="row" gap="sm">
      {icon ? (
        <View alignItems="center" justifyContent="center" minWidth={24} pt={2}>
          {icon}
        </View>
      ) : null}
      <View flexDirection="column" gap="xxs">
        <Text
          color="textSecondary"
          fontSize={FONT.fontSizeSm}
          letterSpacing={0.32}
          weight={FONT.fontWeightBold}
        >
          {label}
        </Text>
        {typeof value === "string" ? (
          <Text fontSize={FONT.fontSizeLg} weight={FONT.fontWeightMedium}>
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
};
