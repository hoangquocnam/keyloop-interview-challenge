import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Input, Radio, Select, notification } from "antd";
import type { RadioChangeEvent } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { queryClient } from "@/app/query-client.ts";
import { queryKeys } from "@/app/query-keys.ts";
import { appRoutes } from "@/app/routes.ts";
import { ConfirmCancelLead } from "@/components/leadsElements/ConfirmCancelLead.tsx";
import { leadDetailCardBorderProps } from "@/components/leadsElements/LeadDetailCard.tsx";
import { Button, Text, View } from "@/components/ui";
import { FormInput } from "@/components/ui/Input";
import {
  LEAD_SOURCE_LABELS,
  LEAD_SOURCE_OPTIONS,
  type LeadSource,
} from "@/enums/lead.enums.ts";
import { useUsersQuery } from "@/hooks/use-users-query.ts";
import { useRootStore } from "@/stores/use-root-store.ts";
import { createLead } from "@/services/leads.ts";
import { LeadPreferredContactMethod } from "@/services/lead.types.ts";
import type { CreateLeadPayload } from "@/services/lead.types.ts";
import { BORDERS, FONT } from "@/theme/design-tokens.ts";
import {
  createLeadSchema,
  type CreateLeadFormValues,
} from "@/validations/lead.ts";

const createLeadPageMaxWidth = 960;

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

export const CreateLeadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, lead } = useRootStore();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const usersQuery = useUsersQuery({ enabled: auth.isAuthenticated });

  const methods = useForm<CreateLeadFormValues>({
    defaultValues: {
      assignedToId: "",
      customerName: "",
      email: "",
      inquiry: "",
      phone: "",
      preferredContactMethod: LeadPreferredContactMethod.EMAIL,
      source: "",
    },
    mode: "all",
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLeadSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    lead.clearCurrentLead();
  }, [lead]);

  const assigneeOptions = useMemo(() => {
    const userOptions =
      usersQuery.data?.map((user) => ({
        label: user.fullName,
        value: user.id,
      })) ?? [];

    return [
      {
        label: "Unassigned (Queue)",
        value: "",
      },
      ...userOptions,
    ];
  }, [usersQuery.data]);

  const navigateToInbox = async () => {
    await navigate(`${appRoutes.leads}${location.search}`);
  };

  const createLeadMutation = useMutation({
    mutationFn: async (payload: CreateLeadPayload) => createLead(payload),
    onError: (error: Error) => {
      notification.error({
        description: error.message,
        message: "Failed to create lead",
        placement: "bottomRight",
      });
    },
    onSuccess: async (createdLead) => {
      lead.applyCurrentLead(createdLead);
      lead.selectLead(createdLead.id);
      queryClient.setQueryData(queryKeys.leadDetail(createdLead.id), createdLead);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.leadInboxRoot,
      });
      await navigate(`${appRoutes.leadDetail(createdLead.id)}${location.search}`);
      notification.success({
        description: null,
        message: "Lead created successfully",
        placement: "bottomRight",
      });
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createLeadMutation.mutateAsync({
      assignedToId: values.assignedToId || null,
      customerName: values.customerName.trim(),
      email: values.email.trim(),
      inquiry: values.inquiry.trim() || null,
      phone: values.phone.trim() || null,
      preferredContactMethod: values.preferredContactMethod,
      source: values.source as LeadSource,
    });
  });

  return (
    <>
      <ConfirmCancelLead
        onCancel={() => {
          setIsCancelModalOpen(false);
        }}
        onConfirm={() => {
          setIsCancelModalOpen(false);
          void navigateToInbox();
        }}
        open={isCancelModalOpen}
      />

      <FormProvider {...methods}>
        <View
          flexDirection="column"
          gap="lg"
          maxWidth={createLeadPageMaxWidth}
          mx="auto"
          width="100%"
        >
          <View alignItems="flex-start" flexDirection="column" gap="sm">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setIsCancelModalOpen(true);
              }}
              size="sm"
              textColor="textSecondary"
              variant="link"
            >
              Back to Inbox
            </Button>

            <View flexDirection="column" gap="xs" width="100%">
              <Text
                as="h1"
                fontSize={FONT.fontSizeDisplay}
                lineHeight={FONT.lineHeightHeading}
                m={0}
                weight={FONT.fontWeightBold}
              >
                Add New Lead
              </Text>
              <Text color="textSecondary" fontSize={FONT.fontSizeXl}>
                Enter the details for the new prospective customer to begin tracking.
              </Text>
            </View>
          </View>

          <View
            {...leadDetailCardBorderProps}
            as="form"
            flexDirection="column"
            gap="lg"
            onSubmit={onSubmit}
            p="lg"
          >
            <View flexDirection="column" gap="md" width="100%">
              <Text
                as="h2"
                fontSize={FONT.fontSize2Xl}
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
                <FormInput<CreateLeadFormValues>
                  id="create-lead-customer-name"
                  name="customerName"
                  placeholder="e.g. Jane Doe"
                  text="Customer Name *"
                />

                <FormInput<CreateLeadFormValues>
                  id="create-lead-email"
                  name="email"
                  placeholder="jane@example.com"
                  text="Email Address"
                />

                <FormInput<CreateLeadFormValues>
                  id="create-lead-phone"
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
                      optionType="default"
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
                as="h2"
                fontSize={FONT.fontSize2Xl}
                m={0}
                weight={FONT.fontWeightBold}
              >
                Lead Details
              </Text>
              <View backgroundColor="border" height={1} width="100%" />

              <View
                display="grid"
                gap="lg"
                gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
                width="100%"
              >
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
                        placeholder="Select a source..."
                        size="large"
                        status={fieldState.error ? "error" : undefined}
                        style={{
                          width: "100%",
                        }}
                        styles={{
                          popup: {
                            root: {
                              borderRadius: BORDERS.radiusSm,
                              backgroundColor: "white",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  errorMessage={
                    errors.assignedToId?.message ||
                    (usersQuery.isError ? usersQuery.error.message : undefined)
                  }
                  label="Assigned To"
                >
                  <Controller
                    control={control}
                    name="assignedToId"
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        loading={usersQuery.isPending}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        options={assigneeOptions}
                        placeholder="Select assignee"
                        size="large"
                        status={fieldState.error ? "error" : undefined}
                        style={{
                          width: "100%",
                        }}
                        styles={{
                          popup: {
                            root: {
                              borderRadius: BORDERS.radiusSm,
                              backgroundColor: "white",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </FormField>
              </View>

              <FormField errorMessage={errors.inquiry?.message} label="Initial Inquiry / Notes">
                <Controller
                  control={control}
                  name="inquiry"
                  render={({ field, fieldState }) => (
                    <Input.TextArea
                      {...field}
                      autoSize={false}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      placeholder="Enter any initial questions, interests, or context provided by the lead..."
                      rows={6}
                      status={fieldState.error ? "error" : undefined}
                      style={{
                        borderRadius: BORDERS.radiusSm,
                        resize: "none",
                      }}
                    />
                  )}
                />
              </FormField>
            </View>

            <View backgroundColor="border" height={1} width="100%" />

            <View flexDirection="row" gap="sm" justifyContent="flex-end" width="100%">
              <Button
                disabled={isSubmitting || createLeadMutation.isPending}
                onClick={() => {
                  setIsCancelModalOpen(true);
                }}
                size="lg"
                textColor="textSecondary"
                variant="link"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={isSubmitting || createLeadMutation.isPending}
                size="lg"
                variant="primary"
              >
                Create Lead
              </Button>
            </View>
          </View>
        </View>
      </FormProvider>
    </>
  );
};
