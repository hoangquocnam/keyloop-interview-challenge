import { useParams } from "react-router-dom";
import { Text, View } from "@/components/ui";
import {
  BORDERS,
  COLORS,
  FONT,
  SHADOW,
  SPACING,
} from "@/theme/design-tokens.ts";

export const LeadDetailPage = () => {
  const { leadId } = useParams();

  return (
    <View flexDirection="column" gap={SPACING.lg} maxWidth={680}>
      <View flexDirection="column" gap={SPACING.xs}>
        <Text
          as="h1"
          fontSize={48}
          m={0}
          style={{ lineHeight: FONT.lineHeightHeading }}
          weight={FONT.fontWeightBold}
        >
          Lead Detail
        </Text>
        <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeXl}>
          Placeholder page for lead detail route
          {leadId ? `: ${leadId}` : ""}. We can implement this screen when you
          give the next command.
        </Text>
      </View>

      <View
        backgroundColor={COLORS.surface}
        borderColor={COLORS.borderSecondary}
        borderRadius={BORDERS.radiusMd}
        borderStyle="solid"
        borderWidth={1}
        boxShadow={SHADOW.card}
        p={SPACING.xl}
      >
        <Text color={COLORS.textSecondary} fontSize={FONT.fontSizeLg}>
          The master-detail route is already wired. This page is intentionally
          kept as a placeholder until you give the detail-screen command.
        </Text>
      </View>
    </View>
  );
};
