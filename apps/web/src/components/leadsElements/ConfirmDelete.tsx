import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import { Button, Text, View } from "@/components/ui";
import { FONT } from "@/theme/design-tokens.ts";

type ConfirmDeleteProps = {
  isDeleting?: boolean;
  leadName: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export const ConfirmDelete = ({
  isDeleting = false,
  leadName,
  onCancel,
  onConfirm,
  open,
}: ConfirmDeleteProps) => {
  return (
    <Modal
      closable={!isDeleting}
      footer={null}
      onCancel={onCancel}
      open={open}
      title={null}
      width={460}
    >
      <View flexDirection="column" gap="lg" pt="sm">
        <View flexDirection="column" gap="xs">
          <Text
            as="h3"
            fontSize={FONT.fontSizeXl}
            m={0}
            weight={FONT.fontWeightBold}
          >
            Delete lead
          </Text>
          <Text color="textSecondary" fontSize={FONT.fontSizeMd}>
            {`This will archive ${leadName} and remove it from the inbox. This action cannot be undone from the UI.`}
          </Text>
        </View>

        <View justifyContent="flex-end" flexDirection="row" gap="sm" width="100%">
          <Button
            disabled={isDeleting}
            onClick={onCancel}
            size="md"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            backgroundColor="error_500"
            borderColor="error_500"
            icon={<DeleteOutlined />}
            loading={isDeleting}
            onClick={onConfirm}
            size="md"
            textColor="white"
            variant="primary"
          >
            Delete Lead
          </Button>
        </View>
      </View>
    </Modal>
  );
};
