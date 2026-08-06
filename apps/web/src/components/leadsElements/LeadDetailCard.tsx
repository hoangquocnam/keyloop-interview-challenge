import type { ReactNode } from "react";

import { Text, View } from "@/components/ui";
import { BORDERS, FONT, SHADOW } from "@/theme/design-tokens.ts";

type LeadDetailCardProps = {
  action?: ReactNode;
  children: ReactNode;
  title: string;
  titleIcon?: ReactNode;
};

export const leadDetailCardBorderProps = {
  backgroundColor: "surface" as const,
  borderColor: "border" as const,
  borderRadius: BORDERS.radiusMd,
  borderStyle: "solid" as const,
  borderWidth: 1,
  boxShadow: SHADOW.card,
};

export const LeadDetailCard = ({
  action,
  children,
  title,
  titleIcon,
}: LeadDetailCardProps) => {
  return (
    <View {...leadDetailCardBorderProps} flexDirection="column" gap="md" p="lg">
      <View alignItems="center" justifyContent="space-between">
        <View alignItems="center" flexDirection="row" gap="sm">
          {titleIcon ?? null}
          <Text
            fontSize={FONT.fontSize2Xl}
            lineHeight={FONT.lineHeightHeading}
            weight={FONT.fontWeightBold}
          >
            {title}
          </Text>
        </View>
        {action}
      </View>
      {children}
    </View>
  );
};
