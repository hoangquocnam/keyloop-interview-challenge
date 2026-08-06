import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LeadActivityType,
  LeadSource,
  PreferredContactMethod,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LeadsService } from './leads.service';

type PrismaOperationResult =
  | { id: string }
  | {
      assignedTo: {
        fullName: string;
        id: string;
      } | null;
    }
  | {
      happenedAt: Date;
      id: string;
      note: string;
      title: string;
      type: LeadActivityType;
      user: {
        fullName: string;
      };
    };

type MockPrismaService = {
  $transaction: jest.Mock;
  lead: {
    update: jest.Mock;
  };
  leadActivity: {
    create: jest.Mock;
  };
  user: {
    findUnique: jest.Mock;
  };
};

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    prismaService = {
      $transaction: jest.fn(
        async (operations: Promise<PrismaOperationResult>[]) =>
          Promise.all(operations),
      ),
      lead: {
        update: jest.fn(),
      },
      leadActivity: {
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  describe('updateLead', () => {
    it('should normalize and persist editable lead fields', async () => {
      jest
        .spyOn(service as never, 'findActiveLeadById' as never)
        .mockResolvedValue({
          email: 'old@leadstream.demo',
          firstName: 'Old',
          id: 'lead-1',
          lastName: 'Name',
          message: 'Old inquiry',
          phone: '(555) 000-0000',
          preferredContactMethod: PreferredContactMethod.email,
          source: LeadSource.website_form,
        } as never);

      prismaService.lead.update.mockResolvedValue({ id: 'lead-1' });

      const refreshedLead = {
        contactInfo: {
          email: 'jamie@leadstream.demo',
          phone: '(555) 100-1035',
          preferredMethod: PreferredContactMethod.phone,
        },
        customerName: 'Jamie Le',
        id: 'lead-1',
        inquiry: 'Interested in a walk-in appointment.',
        leadDetails: {
          assignedTo: null,
          createdAt: '2026-08-06T00:00:00.000Z',
          source: LeadSource.walk_in,
        },
        status: {
          label: 'NEW',
          tone: 'neutral' as const,
          value: 'NEW' as const,
        },
        timeline: [],
      };

      jest.spyOn(service, 'getLeadDetail').mockResolvedValue(refreshedLead);

      const result = await service.updateLead('lead-1', {
        customerName: '  Jamie   Le  ',
        email: '  JAMIE@LeadStream.demo ',
        inquiry: '  Interested in a walk-in appointment.  ',
        phone: '  (555) 100-1035  ',
        preferredContactMethod: PreferredContactMethod.phone,
        source: LeadSource.walk_in,
      });

      expect(prismaService.lead.update).toHaveBeenCalledWith({
        data: {
          email: 'jamie@leadstream.demo',
          firstName: 'Jamie',
          lastName: 'Le',
          message: 'Interested in a walk-in appointment.',
          phone: '(555) 100-1035',
          preferredContactMethod: PreferredContactMethod.phone,
          source: LeadSource.walk_in,
        },
        select: {
          id: true,
        },
        where: { id: 'lead-1' },
      });
      expect(result).toBe(refreshedLead);
    });

    it('should reject phone contact method when phone is missing', async () => {
      jest
        .spyOn(service as never, 'findActiveLeadById' as never)
        .mockResolvedValue({
          email: 'lead36@leadstream.demo',
          firstName: 'Jamie',
          id: 'lead-1',
          lastName: 'Le',
          message: null,
          phone: null,
          preferredContactMethod: PreferredContactMethod.email,
          source: LeadSource.website_form,
        } as never);

      await expect(
        service.updateLead('lead-1', {
          phone: '   ',
          preferredContactMethod: PreferredContactMethod.phone,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prismaService.lead.update).not.toHaveBeenCalled();
    });
  });

  describe('updateLeadAssignee', () => {
    it('should return early when assignee is unchanged', async () => {
      jest
        .spyOn(service as never, 'findActiveLeadById' as never)
        .mockResolvedValue({
          assignedTo: {
            fullName: 'Pam Beesly',
            id: 'user-1',
          },
          assignedToId: 'user-1',
          id: 'lead-1',
        } as never);

      jest
        .spyOn(service as never, 'resolveAssignedToId' as never)
        .mockResolvedValue('user-1' as never);

      const result = await service.updateLeadAssignee('lead-1', 'actor-1', {
        assignedToId: 'user-1',
      });

      expect(prismaService.$transaction).not.toHaveBeenCalled();
      expect(result).toEqual({
        assignedTo: {
          fullName: 'Pam Beesly',
          id: 'user-1',
          initials: 'PB',
        },
        timelineItem: null,
      });
    });

    it('should update assignee and create a timeline item', async () => {
      jest
        .spyOn(service as never, 'findActiveLeadById' as never)
        .mockResolvedValue({
          assignedTo: null,
          assignedToId: null,
          id: 'lead-1',
        } as never);

      jest
        .spyOn(service as never, 'resolveAssignedToId' as never)
        .mockResolvedValue('user-2' as never);

      prismaService.user.findUnique.mockResolvedValue({
        fullName: 'Jim Halpert',
      });

      prismaService.lead.update.mockResolvedValue({
        assignedTo: {
          fullName: 'Jim Halpert',
          id: 'user-2',
        },
      });

      prismaService.leadActivity.create.mockResolvedValue({
        happenedAt: new Date('2026-08-06T10:00:00.000Z'),
        id: 'activity-1',
        note: 'Lead assigned to Jim Halpert.',
        title: 'Assignee Updated',
        type: LeadActivityType.system,
        user: {
          fullName: 'LeadStream Admin',
        },
      });

      const result = await service.updateLeadAssignee('lead-1', 'actor-1', {
        assignedToId: 'user-2',
      });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        select: { fullName: true },
        where: { id: 'user-2' },
      });
      expect(prismaService.lead.update).toHaveBeenCalledWith({
        data: {
          assignedToId: 'user-2',
        },
        select: {
          assignedTo: {
            select: {
              fullName: true,
              id: true,
            },
          },
        },
        where: { id: 'lead-1' },
      });
      const [[leadActivityCreateArgs]] = prismaService.leadActivity.create.mock
        .calls as [
        [
          {
            data: {
              leadId: string;
              note: string;
              title: string;
              type: LeadActivityType;
              userId: string;
            };
          },
        ],
      ];

      expect(leadActivityCreateArgs.data).toMatchObject({
        leadId: 'lead-1',
        note: 'Lead assigned to Jim Halpert.',
        title: 'Assignee Updated',
        type: LeadActivityType.system,
        userId: 'actor-1',
      });
      expect(result).toEqual({
        assignedTo: {
          fullName: 'Jim Halpert',
          id: 'user-2',
          initials: 'JH',
        },
        timelineItem: {
          actorName: 'System',
          happenedAt: new Date('2026-08-06T10:00:00.000Z'),
          id: 'activity-1',
          note: 'Lead assigned to Jim Halpert.',
          title: 'Assignee Updated',
          type: LeadActivityType.system,
        },
      });
    });
  });
});
