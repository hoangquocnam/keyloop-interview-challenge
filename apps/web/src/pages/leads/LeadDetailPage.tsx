import { useMutation } from "@tanstack/react-query";
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Empty, notification } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { queryClient } from "@/app/query-client.ts";
import { queryKeys } from "@/app/query-keys.ts";
import { appRoutes } from "@/app/routes.ts";
import { ActivityTimeline } from "@/components/leadsElements/ActivityTimeline.tsx";
import { ConfirmDelete } from "@/components/leadsElements/ConfirmDelete.tsx";
import { ContactInfo } from "@/components/leadsElements/ContactInfo.tsx";
import { CustomerInquiry } from "@/components/leadsElements/CustomerInquiry.tsx";
import { leadDetailCardBorderProps } from "@/components/leadsElements/LeadDetailCard.tsx";
import { LeadDetails } from "@/components/leadsElements/LeadDetails.tsx";
import { LeadStatusBadge } from "@/components/leadsElements/LeadStatusBadge.tsx";
import { LogActivity } from "@/components/leadsElements/LogActivity.tsx";
import { Button, Text, View } from "@/components/ui";
import {
  LeadActivityComposerMode,
  LeadTimelineItemKind,
  type LeadActivityComposerMode as LeadActivityComposerModeValue,
  type LeadTimelineItem,
} from "@/constants/lead-detail.ts";
import {
  LeadStatusValue,
  getLeadSourceDisplayLabel,
  type LeadStatusValue as LeadStatusValueType,
} from "@/enums/lead.enums.ts";
import { useLeadDetailQuery } from "@/hooks/use-lead-detail-query.ts";
import { useUsersQuery } from "@/hooks/use-users-query.ts";
import {
  archiveLead,
  createLeadActivity,
  updateLeadAssignee,
  updateLeadStatus,
} from "@/services/leads.ts";
import {
  LeadPreferredContactMethod,
  LeadTimelineItemType,
  type CreateLeadActivityPayload,
  type LeadDetailResponse,
  type LeadDetailTimelineItem,
  type UpdateLeadAssigneePayload,
} from "@/services/lead.types.ts";
import { useRootStore } from "@/stores/use-root-store.ts";
import { FONT } from "@/theme/design-tokens.ts";
import {
  getQueryFromSearchParams,
  getSearchParamsFromQuery,
} from "@/utils/lead.utils.ts";

const leadDetailPageMaxWidth = 1280;

const formatTimelineTimestamp = (value: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
};

const formatLeadDetailDate = (value: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getPreferredMethodLabel = (
  value: LeadDetailResponse["contactInfo"]["preferredMethod"],
) => {
  return value === LeadPreferredContactMethod.PHONE ? "Phone" : "Email";
};

const getTimelineItemKind = (
  value: LeadDetailTimelineItem["type"],
): LeadTimelineItemKind => {
  switch (value) {
    case LeadTimelineItemType.CALL:
      return LeadTimelineItemKind.CALL;
    case LeadTimelineItemType.EMAIL:
      return LeadTimelineItemKind.EMAIL;
    case LeadTimelineItemType.NOTE:
      return LeadTimelineItemKind.NOTE;
    default:
      return LeadTimelineItemKind.SYSTEM;
  }
};

const mapLeadTimelineItems = (
  items: LeadDetailTimelineItem[],
): LeadTimelineItem[] => {
  return items.map((item) => ({
    actorName: item.actorName,
    description: item.note,
    id: item.id,
    kind: getTimelineItemKind(item.type),
    occurredAtLabel: formatTimelineTimestamp(item.happenedAt),
    title: item.title,
  }));
};

export const LeadDetailPage = observer(() => {
  const { auth, lead } = useRootStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { leadId } = useParams();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activityMode, setActivityMode] =
    useState<LeadActivityComposerModeValue>(LeadActivityComposerMode.CALL);
  const [activityDraft, setActivityDraft] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryFromUrl = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams],
  );
  const statusMenuItems = useMemo(
    () =>
      Object.values(LeadStatusValue).map((value) => ({
        key: value,
        label: value,
      })),
    [],
  );
  const usersQuery = useUsersQuery({ enabled: auth.isAuthenticated });
  const leadDetailQuery = useLeadDetailQuery({
    enabled: auth.isAuthenticated && !isArchived,
    leadId,
  });
  const currentLead =
    lead.currentLead?.id === leadId ? lead.currentLead : null;
  const timelineItems = useMemo(
    () => mapLeadTimelineItems(currentLead?.timeline ?? []),
    [currentLead?.timeline],
  );

  const invalidateLeadQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.leadDetail(leadId ?? ""),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.leadInboxRoot,
      }),
    ]);
  };

  const createLeadActivityMutation = useMutation({
    mutationFn: async (payload: CreateLeadActivityPayload) => {
      return createLeadActivity(leadId as string, payload);
    },
    onError: (error: Error) => {
      notificationApi.error({
        description: error.message,
        message: "Failed to log activity",
        placement: "bottomRight",
      });
    },
    onSuccess: async (timelineItem) => {
      lead.prependCurrentLeadTimelineItem(timelineItem);
      setActivityDraft("");
      notificationApi.success({
        description: null,
        message: "Activity logged successfully",
        placement: "bottomRight",
      });
      await invalidateLeadQueries();
    },
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: async (status: LeadStatusValueType) => {
      return updateLeadStatus(leadId as string, { status });
    },
    onError: (error: Error) => {
      notificationApi.error({
        description: error.message,
        message: "Failed to update lead status",
        placement: "bottomRight",
      });
    },
    onSuccess: async (response) => {
      lead.updateCurrentLeadStatus(response.status, response.timelineItem);

      if (response.timelineItem) {
        notificationApi.success({
          description: null,
          message: "Lead status updated successfully",
          placement: "bottomRight",
        });
      } else {
        notificationApi.info({
          description: null,
          message: "Lead status is already up to date",
          placement: "bottomRight",
        });
      }

      await invalidateLeadQueries();
    },
  });

  const updateLeadAssigneeMutation = useMutation({
    mutationFn: async (payload: UpdateLeadAssigneePayload) => {
      return updateLeadAssignee(leadId as string, payload);
    },
    onError: (error: Error) => {
      notificationApi.error({
        description: error.message,
        message: "Failed to update assignee",
        placement: "bottomRight",
      });
    },
    onSuccess: async (response) => {
      lead.updateCurrentLeadAssignee(
        response.assignedTo,
        response.timelineItem,
      );

      if (response.timelineItem) {
        notificationApi.success({
          description: null,
          message: "Assignee updated successfully",
          placement: "bottomRight",
        });
      } else {
        notificationApi.info({
          description: null,
          message: "Assignee is already up to date",
          placement: "bottomRight",
        });
      }

      await invalidateLeadQueries();
    },
  });

  const archiveLeadMutation = useMutation({
    onMutate: async () => {
      setIsArchived(true);
      await queryClient.cancelQueries({
        queryKey: queryKeys.leadDetail(leadId ?? ""),
      });
    },
    mutationFn: async () => archiveLead(leadId as string),
    onError: (error: Error) => {
      setIsArchived(false);
      notificationApi.error({
        description: error.message,
        message: "Failed to delete lead",
        placement: "bottomRight",
      });
    },
    onSuccess: async () => {
      setIsDeleteModalOpen(false);
      lead.clearLeadInbox();
      lead.clearCurrentLead();
      await Promise.all([
        queryClient.removeQueries({
          queryKey: queryKeys.leadDetail(leadId ?? ""),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.leadInboxRoot,
        }),
      ]);
      await navigate(`${appRoutes.leads}${location.search}`, { replace: true });
      notification.success({
        description: null,
        message: "Lead deleted successfully",
        placement: "bottomRight",
      });
    },
  });

  useEffect(() => {
    lead.syncQueryFromUrl(queryFromUrl);
  }, [lead, queryFromUrl]);

  useEffect(() => {
    const nextSearchParams = getSearchParamsFromQuery(lead.query);

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [lead.query, searchParams, setSearchParams]);

  useEffect(() => {
    setIsArchived(false);

    if (!leadId) {
      lead.clearCurrentLead();
      return;
    }

    if (lead.currentLead?.id && lead.currentLead.id !== leadId) {
      lead.clearCurrentLead();
    }
  }, [lead, leadId]);

  useEffect(() => {
    if (!leadDetailQuery.data) {
      return;
    }

    lead.applyCurrentLead(leadDetailQuery.data);
    setActivityMode(LeadActivityComposerMode.CALL);
    setActivityDraft("");
  }, [lead, leadDetailQuery.data]);

  if (!leadId) {
    return (
      <>
        {notificationContextHolder}
        <View
          flexDirection="column"
          gap="lg"
          maxWidth={leadDetailPageMaxWidth}
          mx="auto"
          width="100%"
        >
          <View alignItems="flex-start" flexDirection="column" gap="sm">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                void navigate(`${appRoutes.leads}${location.search}`);
              }}
              size="sm"
              textColor="textSecondary"
              variant="link"
            >
              Back to Inbox
            </Button>
            <Text
              as="h1"
              fontSize={FONT.fontSize2Xl}
              m={0}
              weight={FONT.fontWeightBold}
            >
              Lead Detail
            </Text>
          </View>

          <View
            {...leadDetailCardBorderProps}
            alignItems="center"
            flexDirection="column"
            gap="md"
            justifyContent="center"
            minHeight={280}
            p="lg"
          >
            <Empty description="Open a lead from the inbox to preview the detail screen." />
            <Button
              onClick={() => {
                void navigate(`${appRoutes.leads}${location.search}`);
              }}
              size="md"
              variant="outline"
            >
              Return to Inbox
            </Button>
          </View>
        </View>
      </>
    );
  }

  if (leadDetailQuery.isPending && !currentLead) {
    return (
      <>
        {notificationContextHolder}
        <View
          flexDirection="column"
          gap="lg"
          maxWidth={leadDetailPageMaxWidth}
          mx="auto"
          width="100%"
        >
          <View alignItems="flex-start" flexDirection="column" gap="sm">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                void navigate(`${appRoutes.leads}${location.search}`);
              }}
              size="sm"
              textColor="textSecondary"
              variant="link"
            >
              Back to Inbox
            </Button>
            <Text
              as="h1"
              fontSize={FONT.fontSize2Xl}
              m={0}
              weight={FONT.fontWeightBold}
            >
              Loading Lead Detail
            </Text>
          </View>

          <View
            {...leadDetailCardBorderProps}
            alignItems="center"
            flexDirection="column"
            gap="md"
            justifyContent="center"
            minHeight={280}
            p="lg"
          >
            <Text color="textSecondary" fontSize={FONT.fontSizeLg}>
              Loading lead details...
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (leadDetailQuery.isError && !currentLead) {
    return (
      <>
        {notificationContextHolder}
        <View
          flexDirection="column"
          gap="lg"
          maxWidth={leadDetailPageMaxWidth}
          mx="auto"
          width="100%"
        >
          <View alignItems="flex-start" flexDirection="column" gap="sm">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                void navigate(`${appRoutes.leads}${location.search}`);
              }}
              size="sm"
              textColor="textSecondary"
              variant="link"
            >
              Back to Inbox
            </Button>
            <Text
              as="h1"
              fontSize={FONT.fontSize2Xl}
              m={0}
              weight={FONT.fontWeightBold}
            >
              Lead Detail
            </Text>
          </View>

          <View
            {...leadDetailCardBorderProps}
            alignItems="center"
            flexDirection="column"
            gap="md"
            justifyContent="center"
            minHeight={280}
            p="lg"
          >
            <Text color="error_600" fontSize={FONT.fontSizeLg}>
              {leadDetailQuery.error.message}
            </Text>
            <Button
              onClick={() => {
                void leadDetailQuery.refetch();
              }}
              size="md"
              variant="outline"
            >
              Retry
            </Button>
          </View>
        </View>
      </>
    );
  }

  if (!currentLead) {
    return null;
  }

  return (
    <>
      {notificationContextHolder}
      <ConfirmDelete
        isDeleting={archiveLeadMutation.isPending}
        leadName={currentLead.customerName}
        onCancel={() => {
          if (archiveLeadMutation.isPending) {
            return;
          }

          setIsDeleteModalOpen(false);
        }}
        onConfirm={() => {
          void archiveLeadMutation.mutateAsync();
        }}
        open={isDeleteModalOpen}
      />
      <View
        flexDirection="column"
        gap="lg"
        maxWidth={leadDetailPageMaxWidth}
        mx="auto"
        width="100%"
      >
        <View alignItems="flex-start" flexDirection="column" gap="sm">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              void navigate(`${appRoutes.leads}${location.search}`);
            }}
            size="sm"
            textColor="textSecondary"
            variant="link"
          >
            Back to Inbox
          </Button>

          <View flexDirection="column" gap="md" width="100%">
            <View
              alignItems="center"
              flexDirection="row"
              flexWrap="wrap"
              gap="sm"
              justifyContent="space-between"
              width="100%"
            >
              <View
                alignItems="center"
                flexDirection="row"
                flexWrap="wrap"
                gap="sm"
              >
                <Text
                  as="h1"
                  fontSize={FONT.fontSizeDisplay}
                  lineHeight={1}
                  m={0}
                  weight={FONT.fontWeightBold}
                >
                  {currentLead.customerName}
                </Text>
                <LeadStatusBadge
                  label={currentLead.status.label}
                  value={currentLead.status.value}
                />
              </View>

              <Dropdown
                menu={{
                  items: statusMenuItems,
                  onClick: ({ key }) => {
                    void updateLeadStatusMutation.mutateAsync(
                      key as LeadStatusValueType,
                    );
                  },
                }}
                trigger={["click"]}
              >
                <Button
                  icon={<DownOutlined />}
                  iconPosition="end"
                  loading={updateLeadStatusMutation.isPending}
                  px="md"
                  size="lg"
                  variant="outline"
                >
                  Update Status
                </Button>
              </Dropdown>
            </View>

            <View
              display="grid"
              gap="lg"
              gridTemplateColumns="minmax(0, 1fr) 360px"
              width="100%"
            >
              <View flexDirection="column" gap="lg" minWidth={0}>
                <CustomerInquiry inquiry={currentLead.inquiry} />
                <LogActivity
                  activityDraft={activityDraft}
                  activityMode={activityMode}
                  isSubmitting={createLeadActivityMutation.isPending}
                  onActivityDraftChange={setActivityDraft}
                  onActivityModeChange={setActivityMode}
                  onSaveActivity={() => {
                    void createLeadActivityMutation.mutateAsync({
                      note: activityDraft,
                      type: activityMode,
                    });
                  }}
                />
                <ActivityTimeline items={timelineItems} />
              </View>

              <View flexDirection="column" gap="lg" minWidth={320} width={360}>
                <ContactInfo
                  email={currentLead.contactInfo.email}
                  phone={currentLead.contactInfo.phone}
                  preferredMethod={getPreferredMethodLabel(
                    currentLead.contactInfo.preferredMethod,
                  )}
                />
                <LeadDetails
                  assignedTo={currentLead.leadDetails.assignedTo}
                  createdAtLabel={formatLeadDetailDate(
                    currentLead.leadDetails.createdAt,
                  )}
                  isUpdatingAssignee={updateLeadAssigneeMutation.isPending}
                  onDeleteClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                  onSelectAssignee={(assignedToId) => {
                    if (updateLeadAssigneeMutation.isPending) {
                      return;
                    }

                    void updateLeadAssigneeMutation.mutateAsync({
                      assignedToId,
                    });
                  }}
                  sourceLabel={getLeadSourceDisplayLabel(
                    currentLead.leadDetails.source,
                  )}
                  users={usersQuery.data ?? []}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
});
