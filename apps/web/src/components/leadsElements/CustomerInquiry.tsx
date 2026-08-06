import { MessageOutlined } from "@ant-design/icons";

import { Text, View } from "@/components/ui";
import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { BORDERS, COLORS, FONT } from "@/theme/design-tokens.ts";

type CustomerInquiryProps = {
  inquiry: string | null;
};

export const CustomerInquiry = ({ inquiry }: CustomerInquiryProps) => {
  const hasInquiry = inquiry != null && inquiry.trim().length > 0;

  return (
    <LeadDetailCard
      title="Customer Inquiry"
      titleIcon={
        <MessageOutlined style={{ color: COLORS.textSecondary, fontSize: 24 }} />
      }
    >
      <View
        backgroundColor="surfaceMuted"
        borderColor="border"
        borderRadius={BORDERS.radiusSm}
        borderStyle="solid"
        borderWidth={1}
        maxWidth={920}
        p="md"
        width="100%"
      >
        <Text
          as="p"
          color="textSecondary"
          fontSize={FONT.fontSizeLg}
          lineHeight={1.7}
          m={0}
          style={{
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {hasInquiry
            ? `"${inquiry}"`
            : "No customer inquiry was provided for this lead."}
        </Text>
      </View>
    </LeadDetailCard>
  );
};
