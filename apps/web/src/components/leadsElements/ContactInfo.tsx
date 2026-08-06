import {
  EditOutlined,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import { LeadDetailCard } from "@/components/leadsElements/LeadDetailCard.tsx";
import { LeadDetailInfoRow } from "@/components/leadsElements/LeadDetailInfoRow.tsx";
import { Button, Text, View } from "@/components/ui";
import { COLORS } from "@/theme/design-tokens.ts";

type ContactInfoProps = {
  email: string;
  onEditClick: () => void;
  phone: string | null;
  preferredMethod: "Email" | "Phone";
};

export const ContactInfo = ({
  email,
  onEditClick,
  phone,
  preferredMethod,
}: ContactInfoProps) => {
  return (
    <LeadDetailCard
      action={
        <Button
          icon={<EditOutlined />}
          onClick={onEditClick}
          size="sm"
          variant="link"
        >
          Edit
        </Button>
      }
      title="CONTACT INFO"
    >
      <View backgroundColor="border" height={1} width="100%" />
      <View flexDirection="column" gap="lg">
        <LeadDetailInfoRow
          icon={
            <MailOutlined style={{ color: COLORS.textSecondary, fontSize: 20 }} />
          }
          label="Email"
          value={email}
        />
        <LeadDetailInfoRow
          icon={
            <PhoneOutlined style={{ color: COLORS.textSecondary, fontSize: 20 }} />
          }
          label="Phone"
          value={
            phone ?? (
              <Text color="textSecondary">
                Not provided
              </Text>
            )
          }
        />
        <LeadDetailInfoRow
          icon={
            <HeartOutlined style={{ color: COLORS.textSecondary, fontSize: 20 }} />
          }
          label="Pref. Method"
          value={preferredMethod}
        />
      </View>
    </LeadDetailCard>
  );
};
