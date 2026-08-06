import {
  LeadActivityType,
  LeadSource,
  LeadStatus,
  PreferredContactMethod,
  Prisma,
} from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLeadActivityDto,
  LeadLogActivityType,
} from './dto/create-lead-activity.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  LeadDetailDataDto,
  LeadTimelineItemDto,
} from './dto/lead-detail-response.dto';
import { ArchiveLeadResponseDto } from './dto/archive-lead-response.dto';
import { LeadInboxDataDto } from './dto/lead-inbox-response.dto';
import { LeadSortBy, type ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { UpdateLeadStatusResponseDto } from './dto/update-lead-status-response.dto';
import { UpdateLeadAssigneeResponseDto } from './dto/update-lead-assignee-response.dto';
import { UpdateLeadAssigneeDto } from './dto/update-lead-assignee.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';

const statusToneMap: Record<LeadStatus, 'neutral' | 'info' | 'success'> = {
  NEW: 'neutral',
  CONTACTED: 'info',
  QUALIFIED: 'success',
  WON: 'success',
  LOST: 'neutral',
};

const statusLabelMap: Record<LeadStatus, string> = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  WON: 'WON',
  LOST: 'LOST',
};

const activityTitleByType: Record<LeadLogActivityType, string> = {
  [LeadLogActivityType.CALL]: 'Outbound Call',
  [LeadLogActivityType.EMAIL]: 'Email Sent',
  [LeadLogActivityType.NOTE]: 'Note Added',
};

const prismaActivityTypeByLogType: Record<
  LeadLogActivityType,
  LeadActivityType
> = {
  [LeadLogActivityType.CALL]: LeadActivityType.call,
  [LeadLogActivityType.EMAIL]: LeadActivityType.email,
  [LeadLogActivityType.NOTE]: LeadActivityType.note,
};

@Injectable()
export class LeadsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLead(
    userId: string,
    createLeadDto: CreateLeadDto,
  ): Promise<LeadDetailDataDto> {
    const customerName = this.normalizeWhitespace(createLeadDto.customerName);
    const email = createLeadDto.email.trim().toLowerCase();
    const phone = createLeadDto.phone?.trim() || null;
    const inquiry = createLeadDto.inquiry?.trim() || null;
    const assignedToId = await this.resolveAssignedToId(
      createLeadDto.assignedToId,
    );

    if (!customerName) {
      throw new BadRequestException('Customer name is required.');
    }

    if (
      createLeadDto.preferredContactMethod !== PreferredContactMethod.email &&
      !phone
    ) {
      throw new BadRequestException(
        'Phone number is required for the selected preferred contact method.',
      );
    }

    const { firstName, lastName } = this.toLeadNameParts(customerName);

    const createdLead = await this.prismaService.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        message: inquiry,
        source: createLeadDto.source,
        status: LeadStatus.NEW,
        preferredContactMethod: createLeadDto.preferredContactMethod,
        assignedToId,
        followUpActivities: {
          create: {
            userId,
            type: LeadActivityType.system,
            title: 'Lead Received',
            note: this.toLeadReceivedNote(createLeadDto.source),
            happenedAt: new Date(),
          },
        },
      },
      select: {
        id: true,
      },
    });

    return this.getLeadDetail(createdLead.id);
  }

  async listLeads(query: ListLeadsQueryDto): Promise<LeadInboxDataDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const orderBy = this.buildOrderBy(query);
    const where = this.buildWhereClause(query);

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              fullName: true,
            },
          },
          followUpActivities: {
            take: 1,
            orderBy: [{ happenedAt: 'desc' }, { createdAt: 'desc' }],
            select: {
              title: true,
              type: true,
              happenedAt: true,
            },
          },
        },
      }),
      this.prismaService.lead.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items: items.map((item) => {
        const latestActivity = item.followUpActivities[0];

        return {
          id: item.id,
          customerName: `${item.firstName} ${item.lastName}`.trim(),
          contactEmail: item.email,
          phone: item.phone?.trim() || '--',
          source: item.source,
          status: {
            value: item.status,
            label: statusLabelMap[item.status],
            tone: statusToneMap[item.status],
          },
          assignedTo: item.assignedTo
            ? this.toAssigneeDto(item.assignedTo)
            : null,
          lastActivity: this.toLastActivityLabel(
            latestActivity?.type,
            latestActivity?.title,
            latestActivity?.happenedAt,
          ),
          hasUnreadIndicator: item.status === LeadStatus.NEW,
        };
      }),
      totalPage: totalPages,
      totalCount: total,
    };
  }

  async getLeadDetail(leadId: string): Promise<LeadDetailDataDto> {
    const lead = await this.prismaService.lead.findFirst({
      where: {
        id: leadId,
        archivedAt: null,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
          },
        },
        followUpActivities: {
          orderBy: [{ happenedAt: 'desc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            type: true,
            title: true,
            note: true,
            happenedAt: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }

    return {
      id: lead.id,
      customerName: this.toCustomerName(lead.firstName, lead.lastName),
      inquiry: lead.message,
      status: this.toStatusDto(lead.status),
      contactInfo: {
        email: lead.email,
        phone: lead.phone,
        preferredMethod: lead.preferredContactMethod,
      },
      leadDetails: {
        source: lead.source,
        createdAt: lead.createdAt,
        assignedTo: lead.assignedTo
          ? this.toAssigneeDto(lead.assignedTo)
          : null,
      },
      timeline: lead.followUpActivities.map((activity) =>
        this.toTimelineItem(activity),
      ),
    };
  }

  async createLeadActivity(
    leadId: string,
    userId: string,
    createLeadActivityDto: CreateLeadActivityDto,
  ): Promise<LeadTimelineItemDto> {
    await this.ensureLeadExists(leadId);

    const activity = await this.prismaService.leadActivity.create({
      data: {
        leadId,
        userId,
        type: prismaActivityTypeByLogType[createLeadActivityDto.type],
        title: activityTitleByType[createLeadActivityDto.type],
        note: createLeadActivityDto.note.trim(),
        happenedAt: new Date(),
      },
      select: {
        id: true,
        type: true,
        title: true,
        note: true,
        happenedAt: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return this.toTimelineItem(activity);
  }

  async updateLead(
    leadId: string,
    updateLeadDto: UpdateLeadDto,
  ): Promise<LeadDetailDataDto> {
    const lead = await this.findActiveLeadById(leadId, {
      email: true,
      firstName: true,
      id: true,
      lastName: true,
      message: true,
      phone: true,
      preferredContactMethod: true,
      source: true,
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }

    const nextCustomerName =
      updateLeadDto.customerName !== undefined
        ? this.normalizeWhitespace(updateLeadDto.customerName)
        : this.toCustomerName(lead.firstName, lead.lastName);

    if (!nextCustomerName) {
      throw new BadRequestException('Customer name is required.');
    }

    const { firstName, lastName } = this.toLeadNameParts(nextCustomerName);
    const nextEmail =
      updateLeadDto.email !== undefined
        ? updateLeadDto.email.trim().toLowerCase()
        : lead.email;
    const nextPhone =
      updateLeadDto.phone !== undefined
        ? updateLeadDto.phone?.trim() || null
        : lead.phone;
    const nextInquiry =
      updateLeadDto.inquiry !== undefined
        ? updateLeadDto.inquiry?.trim() || null
        : lead.message;
    const nextPreferredMethod =
      updateLeadDto.preferredContactMethod ?? lead.preferredContactMethod;
    const nextSource = updateLeadDto.source ?? lead.source;

    if (nextPreferredMethod !== PreferredContactMethod.email && !nextPhone) {
      throw new BadRequestException(
        'Phone number is required for the selected preferred contact method.',
      );
    }

    await this.prismaService.lead.update({
      where: { id: leadId },
      data: {
        email: nextEmail,
        firstName,
        lastName,
        message: nextInquiry,
        phone: nextPhone,
        preferredContactMethod: nextPreferredMethod,
        source: nextSource,
      },
      select: {
        id: true,
      },
    });

    return this.getLeadDetail(leadId);
  }

  async archiveLead(leadId: string): Promise<ArchiveLeadResponseDto> {
    const lead = await this.findActiveLeadById(leadId, {
      id: true,
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }

    const archivedLead = await this.prismaService.lead.update({
      where: { id: leadId },
      data: {
        archivedAt: new Date(),
      },
      select: {
        id: true,
        archivedAt: true,
      },
    });

    return {
      id: archivedLead.id,
      archivedAt: archivedLead.archivedAt as Date,
    };
  }

  async updateLeadStatus(
    leadId: string,
    userId: string,
    updateLeadStatusDto: UpdateLeadStatusDto,
  ): Promise<UpdateLeadStatusResponseDto> {
    const lead = await this.findActiveLeadById(leadId, {
      id: true,
      status: true,
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }

    if (lead.status === updateLeadStatusDto.status) {
      return {
        status: this.toStatusDto(lead.status),
        timelineItem: null,
      };
    }

    const happenedAt = new Date();
    const nextStatusLabel = statusLabelMap[updateLeadStatusDto.status];

    const [, activity] = await this.prismaService.$transaction([
      this.prismaService.lead.update({
        where: { id: leadId },
        data: {
          status: updateLeadStatusDto.status,
        },
      }),
      this.prismaService.leadActivity.create({
        data: {
          leadId,
          userId,
          type: LeadActivityType.system,
          title: 'Status Updated',
          note: `Lead status updated to ${nextStatusLabel}.`,
          happenedAt,
        },
        select: {
          id: true,
          type: true,
          title: true,
          note: true,
          happenedAt: true,
          user: {
            select: {
              fullName: true,
            },
          },
        },
      }),
    ]);

    return {
      status: this.toStatusDto(updateLeadStatusDto.status),
      timelineItem: this.toTimelineItem(activity),
    };
  }

  async updateLeadAssignee(
    leadId: string,
    userId: string,
    updateLeadAssigneeDto: UpdateLeadAssigneeDto,
  ): Promise<UpdateLeadAssigneeResponseDto> {
    const lead = await this.findActiveLeadById(leadId, {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
        },
      },
      assignedToId: true,
      id: true,
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }

    const nextAssignedToId = await this.resolveAssignedToId(
      updateLeadAssigneeDto.assignedToId,
    );

    if (lead.assignedToId === nextAssignedToId) {
      return {
        assignedTo: lead.assignedTo
          ? this.toAssigneeDto(lead.assignedTo)
          : null,
        timelineItem: null,
      };
    }

    const happenedAt = new Date();
    const nextAssignedUser = nextAssignedToId
      ? await this.prismaService.user.findUnique({
          where: { id: nextAssignedToId },
          select: { fullName: true },
        })
      : null;
    const note = nextAssignedToId
      ? `Lead assigned to ${nextAssignedUser?.fullName ?? 'the selected salesperson'}.`
      : 'Lead moved to the unassigned queue.';

    const [updatedLead, activity] = await this.prismaService.$transaction([
      this.prismaService.lead.update({
        where: { id: leadId },
        data: {
          assignedToId: nextAssignedToId,
        },
        select: {
          assignedTo: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      this.prismaService.leadActivity.create({
        data: {
          leadId,
          userId,
          type: LeadActivityType.system,
          title: 'Assignee Updated',
          note,
          happenedAt,
        },
        select: {
          id: true,
          type: true,
          title: true,
          note: true,
          happenedAt: true,
          user: {
            select: {
              fullName: true,
            },
          },
        },
      }),
    ]);

    return {
      assignedTo: updatedLead.assignedTo
        ? this.toAssigneeDto(updatedLead.assignedTo)
        : null,
      timelineItem: this.toTimelineItem(activity),
    };
  }

  private buildWhereClause(query: ListLeadsQueryDto): Prisma.LeadWhereInput {
    const search = query.search?.trim();

    return {
      archivedAt: null,
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),
      ...(query.source
        ? {
            source: query.source,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                email: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                phone: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
  }

  private buildOrderBy(
    query: ListLeadsQueryDto,
  ): Prisma.LeadOrderByWithRelationInput[] {
    switch (query.sortBy) {
      case LeadSortBy.CUSTOMER_NAME:
        return [
          { firstName: query.sort },
          { lastName: query.sort },
          { createdAt: 'desc' },
        ];
      case LeadSortBy.SOURCE:
        return [{ source: query.sort }, { createdAt: 'desc' }];
      case LeadSortBy.STATUS:
        return [{ status: query.sort }, { createdAt: 'desc' }];
      case LeadSortBy.CREATED_AT:
      default:
        return [{ createdAt: query.sort }, { updatedAt: query.sort }];
    }
  }

  private toInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private toStatusDto(status: LeadStatus) {
    return {
      value: status,
      label: statusLabelMap[status],
      tone: statusToneMap[status],
    };
  }

  private toAssigneeDto(assignee: { id: string; fullName: string }) {
    return {
      id: assignee.id,
      fullName: assignee.fullName,
      initials: this.toInitials(assignee.fullName),
    };
  }

  private toCustomerName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`.trim();
  }

  private normalizeWhitespace(value: string) {
    return value.trim().replace(/\s+/g, ' ');
  }

  private toLeadNameParts(customerName: string) {
    const nameParts = customerName.split(' ');

    if (nameParts.length === 1) {
      return {
        firstName: customerName,
        lastName: '',
      };
    }

    return {
      firstName: nameParts.slice(0, -1).join(' '),
      lastName: nameParts[nameParts.length - 1] ?? '',
    };
  }

  private toLeadReceivedNote(source: LeadSource) {
    switch (source) {
      case LeadSource.phone_inbound:
        return 'New lead was created manually in the sales portal from a phone inbound conversation.';
      case LeadSource.walk_in:
        return 'New lead was created manually in the sales portal after an in-person dealership visit.';
      case LeadSource.website_form:
      default:
        return 'New lead was created manually in the sales portal from a website inquiry.';
    }
  }

  private async resolveAssignedToId(assignedToId?: string | null) {
    if (!assignedToId) {
      return null;
    }

    const assignedUser = await this.prismaService.user.findUnique({
      where: { id: assignedToId },
      select: { id: true },
    });

    if (!assignedUser) {
      throw new NotFoundException('Assigned user was not found.');
    }

    return assignedUser.id;
  }

  private toTimelineItem(activity: {
    id: string;
    type: LeadActivityType;
    title: string;
    note: string;
    happenedAt: Date;
    user: {
      fullName: string;
    };
  }): LeadTimelineItemDto {
    return {
      id: activity.id,
      type: activity.type,
      title: activity.title,
      note: activity.note,
      actorName:
        activity.type === LeadActivityType.system
          ? 'System'
          : activity.user.fullName,
      happenedAt: activity.happenedAt,
    };
  }

  private toLastActivityLabel(
    type?: LeadActivityType,
    title?: string,
    happenedAt?: Date,
  ): string {
    if (!type || !title || !happenedAt) {
      return 'No activity yet';
    }

    const diffInMinutes = Math.max(
      1,
      Math.floor((Date.now() - happenedAt.getTime()) / 60000),
    );

    const relativeTime =
      diffInMinutes < 60
        ? `${diffInMinutes}m ago`
        : diffInMinutes < 1440
          ? `${Math.floor(diffInMinutes / 60)}h ago`
          : `${Math.floor(diffInMinutes / 1440)}d ago`;

    if (type === LeadActivityType.system && title === 'Lead Received') {
      return `Submitted ${relativeTime}`;
    }

    return `${title} ${relativeTime}`;
  }

  private async ensureLeadExists(leadId: string) {
    const lead = await this.findActiveLeadById(leadId, {
      id: true,
    });

    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }
  }

  private findActiveLeadById<TSelect extends Prisma.LeadSelect>(
    leadId: string,
    select: TSelect,
  ) {
    return this.prismaService.lead.findFirst({
      where: {
        id: leadId,
        archivedAt: null,
      },
      select,
    });
  }
}
