import { DownOutlined } from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import { observer } from "mobx-react-lite";

import { View, Button } from "@/components/ui";
import {
  type LeadSourceFilterValue,
  type LeadStatusFilterValue,
} from "@/enums/lead.enums";
import { useRootStore } from "@/stores/use-root-store.ts";

type Props = {
  statusMenuItems: MenuProps["items"];
  sourceMenuItems: MenuProps["items"];
};

const FilterSortTableControls = ({
  statusMenuItems,
  sourceMenuItems,
}: Props) => {
  const { lead } = useRootStore();
  return (
    <View
      backgroundColor="surface"
      borderColor="border"
      borderRadius={2}
      borderStyle="solid"
      borderWidth={1}
      flexDirection="row"
      flexShrink={0}
      gap="sm"
      p="sm"
      width="100%"
    >
      <Dropdown
        menu={{
          items: statusMenuItems,
          onClick: ({ key }) => {
            lead.setStatusFilter(key as LeadStatusFilterValue);
          },
        }}
        trigger={["click"]}
      >
        <Button
          borderRadius={2}
          textColor="text"
          icon={<DownOutlined />}
          iconPosition="end"
          size="lg"
          variant="outline"
        >
          {`Status: ${lead.statusFilterLabel}`}
        </Button>
      </Dropdown>

      <Dropdown
        menu={{
          items: sourceMenuItems,
          onClick: ({ key }) => {
            lead.setSourceFilter(key as LeadSourceFilterValue);
          },
        }}
        trigger={["click"]}
      >
        <Button
          borderRadius={2}
          textColor="text"
          icon={<DownOutlined />}
          iconPosition="end"
          size="lg"
          variant="outline"
        >
          {lead.sourceFilterLabel}
        </Button>
      </Dropdown>
    </View>
  );
};

export default observer(FilterSortTableControls);
