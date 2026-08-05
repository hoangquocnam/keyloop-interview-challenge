import { LeadStatus, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadInboxDataDto } from './dto/lead-inbox-response.dto';
import { LeadSortBy, type ListLeadsQueryDto } from './dto/list-leads-query.dto';

const inboxStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
];

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

@Injectable()
export class LeadsService {
  constructor(private readonly prismaService: PrismaService) {}

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
            ? {
                id: item.assignedTo.id,
                fullName: item.assignedTo.fullName,
                initials: this.toInitials(item.assignedTo.fullName),
              }
            : null,
          lastActivity: this.toLastActivityLabel(
            latestActivity?.type,
            latestActivity?.happenedAt,
          ),
          hasUnreadIndicator: item.status === LeadStatus.NEW,
        };
      }),
      totalPage: totalPages,
      totalCount: total,
    };
  }

  private buildWhereClause(query: ListLeadsQueryDto): Prisma.LeadWhereInput {
    const search = query.search?.trim();

    return {
      status: query.status ? query.status : { in: inboxStatuses },
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

  private toLastActivityLabel(type?: string, happenedAt?: Date): string {
    if (!type || !happenedAt) {
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

    if (type === 'lead_created') {
      return `Submitted ${relativeTime}`;
    }

    if (type === 'call_logged') {
      return `Call logged ${relativeTime}`;
    }

    if (type === 'quote_sent') {
      return `Quote sent ${relativeTime}`;
    }

    return `${this.toSentenceLabel(type)} ${relativeTime}`;
  }

  private toSentenceLabel(value: string): string {
    return value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
