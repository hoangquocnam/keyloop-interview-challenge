import { zodResolver } from "@hookform/resolvers/zod";
import { EditOutlined } from "@ant-design/icons";
import { Input, Modal, Radio, Select } from "antd";
import type { RadioChangeEvent } from "antd";
import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button, Text, View } from "@/components/ui";
import { FormInput } from "@/components/ui/Input";
import {
  LEAD_SOURCE_OPTIONS,
  type LeadSource,
} from "@/enums/lead.enums.ts";
import { LeadPreferredContactMethod } from "@/services/lead.types.ts";
import type {
  LeadDetailResponse,
  UpdateLeadInfoFormValues,
} from "@/services/lead.types.ts";
import { BORDERS, FONT } from "@/theme/design-tokens.ts";
import {
  updateLeadInfoSchema,
} from "@/validations/lead.ts";

const sourceOptions = LEAD_SOURCE_OPTIONS.filter((option) => option.value !== "ALL").map(
  (option) => ({
    label: option.label,
    value: option.value,
  }),
);

type FormFieldProps = {
  children: React.ReactNode;
  errorMessage?: string;
  label: string;
};

const FormField = ({ children, errorMessage, label }: FormFieldProps) => {
  return (
    <View flexDirection="column" gap="xs" width="100%">
      <Text
        as="span"
        color="textSecondary"
        fontSize={FONT.fontSizeSm}
        letterSpacing={0.4}
        style={{ textTransform: "uppercase" }}
        weight={FONT.fontWeightBold}
      >
        {label}
      </Text>
      {children}
      {errorMessage ? (
        <Text as="span" color="error_600" fontSize={FONT.fontSizeSm}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

type EditLeadInfoModalProps = {
  isSubmitting?: boolean;
  lead: LeadDetailResponse;
  onCancel: () => void;
  onSubmit: (values: UpdateLeadInfoFormValues) => void;
  open: boolean;
};

export const EditLeadInfoModal = ({
  isSubmitting = false,
  lead,
  onCancel,
  onSubmit,
  open,
}: EditLeadInfoModalProps) => {
  const methods = useForm<UpdateLeadInfoFormValues>({
    defaultValues: {
      email: lead.contactInfo.email,
      phone: lead.contactInfo.phone ?? "",
      preferredContactMethod: lead.contactInfo.preferredMethod,
      source: lead.leadDetails.source,
    },
    mode: "all",
    resolver: zodResolver(updateLeadInfoSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      email: lead.contactInfo.email,
      phone: lead.contactInfo.phone ?? "",
      preferredContactMethod: lead.contactInfo.preferredMethod,
      source: lead.leadDetails.source,
    });
  }, [lead, open, reset]);

  const isBusy = isSubmitting || isFormSubmitting;

  const modalTitle = useMemo(
    () => (
      <View alignItems="center" flexDirection="row" gap="xs">
        <EditOutlined />
        <Text fontSize={FONT.fontSizeXl} weight={FONT.fontWeightBold}>
          Edit Lead Info
        </Text>
      </View>
    ),
    [],
  );

  return (
    <Modal
      footer={null}
      onCancel={onCancel}
      open={open}
      title={modalTitle}
      width={720}
    >
      <FormProvider {...methods}>
        <View
          as="form"
          flexDirection="column"
          gap="lg"
          onSubmit={handleSubmit(onSubmit)}
          pt="sm"
          width="100%"
        >
          <View flexDirection="column" gap="md" width="100%">
            <Text
              as="h3"
              fontSize={FONT.fontSizeXl}
              m={0}
              weight={FONT.fontWeightBold}
            >
              Contact Information
            </Text>
            <View backgroundColor="border" height={1} width="100%" />

            <View
              display="grid"
              gap="lg"
              gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
              width="100%"
            >
              <FormInput<UpdateLeadInfoFormValues>
                id="edit-lead-email"
                name="email"
                placeholder="jane@example.com"
                text="Email Address"
              />

              <FormInput<UpdateLeadInfoFormValues>
                id="edit-lead-phone"
                name="phone"
                placeholder="(555) 123-4567"
                text="Phone Number"
              />
            </View>

            <FormField
              errorMessage={errors.preferredContactMethod?.message}
              label="Preferred Contact Method"
            >
              <Controller
                control={control}
                name="preferredContactMethod"
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    onChange={(event: RadioChangeEvent) => {
                      field.onChange(event.target.value);
                    }}
                  >
                    <View alignItems="center" flexDirection="row" gap="lg">
                      <Radio value={LeadPreferredContactMethod.EMAIL}>Email</Radio>
                      <Radio value={LeadPreferredContactMethod.PHONE}>Phone</Radio>
                    </View>
                  </Radio.Group>
                )}
              />
            </FormField>
          </View>

          <View flexDirection="column" gap="md" width="100%">
            <Text
              as="h3"
              fontSize={FONT.fontSizeXl}
              m={0}
              weight={FONT.fontWeightBold}
            >
              Lead Details
            </Text>
            <View backgroundColor="border" height={1} width="100%" />

            <FormField errorMessage={errors.source?.message} label="Lead Source">
              <Controller
                control={control}
                name="source"
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    options={sourceOptions}
                    size="large"
                    status={fieldState.error ? "error" : undefined}
                    style={{ width: "100%" }}
                    styles={{
                      popup: {
                        root: {
                          backgroundColor: "white",
                          borderRadius: BORDERS.radiusSm,
                        },
                      },
                    }}
                  />
                )}
              />
            </FormField>

            <View flexDirection="column" gap="xs" width="100%">
              <Text
                as="span"
                color="textSecondary"
                fontSize={FONT.fontSizeSm}
                letterSpacing={0.4}
                style={{ textTransform: "uppercase" }}
                weight={FONT.fontWeightBold}
              >
                Assigned To
              </Text>
              <Input
                disabled
                size="large"
                style={{ borderRadius: BORDERS.radiusSm, height: 48 }}
                value={lead.leadDetails.assignedTo?.fullName ?? "Unassigned (Queue)"}
              />
            </View>
          </View>

          <View backgroundColor="border" height={1} width="100%" />

          <View flexDirection="row" gap="sm" justifyContent="flex-end" width="100%">
            <Button
              disabled={isBusy}
              onClick={onCancel}
              size="lg"
              textColor="textSecondary"
              variant="link"
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              loading={isBusy}
              size="lg"
              variant="primary"
            >
              Save Changes
            </Button>
          </View>
        </View>
      </FormProvider>
    </Modal>
  );
};
