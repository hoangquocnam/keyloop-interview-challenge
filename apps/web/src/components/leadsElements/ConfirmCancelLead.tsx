import { Modal } from "antd";

import { Button, Text, View } from "@/components/ui";
import { FONT } from "@/theme/design-tokens.ts";

type ConfirmCancelLeadProps = {
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export const ConfirmCancelLead = ({
  onCancel,
  onConfirm,
  open,
}: ConfirmCancelLeadProps) => {
  return (
    <Modal footer={null} onCancel={onCancel} open={open} title={null} width={460}>
      <View flexDirection="column" gap="lg" pt="sm">
        <View flexDirection="column" gap="xs">
          <Text
            as="h3"
            fontSize={FONT.fontSizeXl}
            m={0}
            weight={FONT.fontWeightBold}
          >
            Discard lead draft?
          </Text>
          <Text color="textSecondary" fontSize={FONT.fontSizeMd}>
            Your current changes have not been submitted yet.
          </Text>
        </View>

        <View flexDirection="row" gap="sm" justifyContent="flex-end" width="100%">
          <Button onClick={onCancel} size="md" variant="outline">
            Continue Editing
          </Button>
          <Button onClick={onConfirm} size="md" variant="primary">
            Discard Draft
          </Button>
        </View>
      </View>
    </Modal>
  );
};
