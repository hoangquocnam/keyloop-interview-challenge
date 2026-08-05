import { LeadStatus, PrismaClient, UserRole } from '@prisma/client';
import type { LeadSource } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const now = Date.now();
const legacyDemoLeadEmails = ['jamie.brooks@example.com'] as const;

type DemoLeadSeed = {
  readonly activityNote: string;
  readonly activityType: string;
  readonly assignedUserEmail: string | null;
  readonly email: string;
  readonly firstName: string;
  readonly happenedAt: Date;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string | null;
  readonly source: LeadSource;
  readonly status: LeadStatus;
};

const featuredDemoLeads: readonly DemoLeadSeed[] = [
  {
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'm.scott@dundermifflin.com',
    phone: '(555) 123-4567',
    source: 'website_form',
    status: LeadStatus.NEW,
    message: 'Interested in pricing for the latest SUV lineup.',
    assignedUserEmail: 'jim.halpert@leadstream.com',
    activityType: 'lead_created',
    activityNote: 'Lead submitted from the website form.',
    happenedAt: new Date(now - 10 * 60 * 1000),
  },
  {
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 's.connor@sky.net',
    phone: '(555) 987-6543',
    source: 'phone_inbound',
    status: LeadStatus.CONTACTED,
    message: 'Asked about availability for hybrid inventory.',
    assignedUserEmail: 'dwight.schrute@leadstream.com',
    activityType: 'call_logged',
    activityNote: 'Inbound call captured and follow-up scheduled.',
    happenedAt: new Date(now - 2 * 60 * 60 * 1000),
  },
  {
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'b.wayne@wayneent.com',
    phone: null,
    source: 'walk_in',
    status: LeadStatus.QUALIFIED,
    message: 'Requested a quote for a fleet-ready luxury SUV.',
    assignedUserEmail: 'pam.beesly@leadstream.com',
    activityType: 'quote_sent',
    activityNote: 'Quote sent after dealership visit.',
    happenedAt: new Date(now - 24 * 60 * 60 * 1000),
  },
  {
    firstName: 'Arthur',
    lastName: 'Dent',
    email: 'a.dent@hitchhiker.org',
    phone: '(555) 424-2424',
    source: 'website_form',
    status: LeadStatus.NEW,
    message: 'Needs a compact vehicle after an unexpected trip.',
    assignedUserEmail: null,
    activityType: 'lead_created',
    activityNote: 'Lead captured from the website form.',
    happenedAt: new Date(now - 3 * 60 * 60 * 1000),
  },
  {
    firstName: 'Leslie',
    lastName: 'Knope',
    email: 'l.knope@pawnee.gov',
    phone: '(555) 314-1592',
    source: 'website_form',
    status: LeadStatus.NEW,
    message: 'Looking for a reliable hybrid SUV for city travel.',
    assignedUserEmail: 'pam.beesly@leadstream.com',
    activityType: 'lead_created',
    activityNote: 'Lead submitted from the website form.',
    happenedAt: new Date(now - 5 * 60 * 60 * 1000),
  },
  {
    firstName: 'Dana',
    lastName: 'Scully',
    email: 'd.scully@fbi.gov',
    phone: '(555) 246-8101',
    source: 'phone_inbound',
    status: LeadStatus.CONTACTED,
    message: 'Requested a callback about financing options.',
    assignedUserEmail: 'jim.halpert@leadstream.com',
    activityType: 'call_logged',
    activityNote: 'Inbound call captured and pricing follow-up requested.',
    happenedAt: new Date(now - 6 * 60 * 60 * 1000),
  },
  {
    firstName: 'Jean-Luc',
    lastName: 'Picard',
    email: 'j.picard@starfleet.space',
    phone: '(555) 170-1701',
    source: 'walk_in',
    status: LeadStatus.QUALIFIED,
    message: 'Qualified for executive transport package and quote.',
    assignedUserEmail: 'dwight.schrute@leadstream.com',
    activityType: 'quote_sent',
    activityNote: 'Quote sent after premium trim discussion.',
    happenedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
  },
  {
    firstName: 'Ellen',
    lastName: 'Ripley',
    email: 'e.ripley@weylandyutani.com',
    phone: '(555) 777-4269',
    source: 'website_form',
    status: LeadStatus.NEW,
    message: 'Needs cargo space details before scheduling a visit.',
    assignedUserEmail: null,
    activityType: 'lead_created',
    activityNote: 'Lead captured from the website form.',
    happenedAt: new Date(now - 30 * 60 * 1000),
  },
];

const generatedStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
] as const;

const generatedSources = [
  'website_form',
  'phone_inbound',
  'walk_in',
] as const;

const generatedAssignees = [
  'jim.halpert@leadstream.com',
  'dwight.schrute@leadstream.com',
  'pam.beesly@leadstream.com',
  null,
] as const;

const generatedActivityTypes = [
  'lead_created',
  'call_logged',
  'quote_sent',
] as const;

const generatedFirstNames = [
  'Alex',
  'Taylor',
  'Jordan',
  'Morgan',
  'Casey',
  'Sam',
  'Riley',
  'Jamie',
  'Avery',
  'Quinn',
] as const;

const generatedLastNames = [
  'Nguyen',
  'Tran',
  'Le',
  'Pham',
  'Hoang',
  'Vo',
  'Bui',
  'Do',
  'Huynh',
  'Dang',
] as const;

const bulkDemoLeads: readonly DemoLeadSeed[] = new Array(50)
  .fill(null)
  .map((_, index) => {
    const firstName = generatedFirstNames[index % generatedFirstNames.length];
    const lastName =
      generatedLastNames[Math.floor(index / generatedFirstNames.length) % generatedLastNames.length];
    const status = generatedStatuses[index % generatedStatuses.length];
    const source = generatedSources[index % generatedSources.length];
    const assignedUserEmail = generatedAssignees[index % generatedAssignees.length];
    const activityType =
      generatedActivityTypes[index % generatedActivityTypes.length];
    const minutesAgo = (index + 1) * 37;

    return {
      firstName,
      lastName,
      email: `lead${index + 1}@leadstream.demo`,
      phone: `(555) ${String(1000000 + index).slice(0, 3)}-${String(1000 + index).slice(-4)}`,
      source,
      status,
      message: `Demo lead ${index + 1} requesting more information about available vehicles and financing options.`,
      assignedUserEmail,
      activityType,
      activityNote: `Auto-generated demo activity ${index + 1}.`,
      happenedAt: new Date(now - minutesAgo * 60 * 1000),
    };
  });

const demoLeads: readonly DemoLeadSeed[] = [
  ...featuredDemoLeads,
  ...bulkDemoLeads,
];

async function main() {
  const salesUser = await prisma.user.upsert({
    where: { email: 'admin@leadstream.com' },
    update: {
      fullName: 'LeadStream Admin',
      passwordHash: hashSync('Password123!', 10),
      role: UserRole.SALES,
    },
    create: {
      email: 'admin@leadstream.com',
      fullName: 'LeadStream Admin',
      passwordHash: hashSync('Password123!', 10),
      role: UserRole.SALES,
    },
  });

  const jimHalpert = await prisma.user.upsert({
    where: { email: 'jim.halpert@leadstream.com' },
    update: {
      fullName: 'Jim Halpert',
      role: UserRole.SALES,
    },
    create: {
      email: 'jim.halpert@leadstream.com',
      fullName: 'Jim Halpert',
      passwordHash: hashSync('Password123!', 10),
      role: UserRole.SALES,
    },
  });

  const dwightSchrute = await prisma.user.upsert({
    where: { email: 'dwight.schrute@leadstream.com' },
    update: {
      fullName: 'Dwight Schrute',
      role: UserRole.SALES,
    },
    create: {
      email: 'dwight.schrute@leadstream.com',
      fullName: 'Dwight Schrute',
      passwordHash: hashSync('Password123!', 10),
      role: UserRole.SALES,
    },
  });

  const pamBeesly = await prisma.user.upsert({
    where: { email: 'pam.beesly@leadstream.com' },
    update: {
      fullName: 'Pam Beesly',
      role: UserRole.SALES,
    },
    create: {
      email: 'pam.beesly@leadstream.com',
      fullName: 'Pam Beesly',
      passwordHash: hashSync('Password123!', 10),
      role: UserRole.SALES,
    },
  });

  const assignedUserByEmail = new Map([
    [salesUser.email, salesUser],
    [jimHalpert.email, jimHalpert],
    [dwightSchrute.email, dwightSchrute],
    [pamBeesly.email, pamBeesly],
  ]);

  await prisma.leadActivity.deleteMany({
    where: {
      lead: {
        email: {
          in: [...demoLeads.map((lead) => lead.email), ...legacyDemoLeadEmails],
        },
      },
    },
  });

  await prisma.lead.deleteMany({
    where: {
      email: {
        in: [...demoLeads.map((lead) => lead.email), ...legacyDemoLeadEmails],
      },
    },
  });

  const createdLeads = await Promise.all(
    demoLeads.map((lead) => {
      const assignedUser = lead.assignedUserEmail
        ? assignedUserByEmail.get(lead.assignedUserEmail)
        : null;

      const activityAuthor = assignedUser ?? salesUser;

      return prisma.lead.create({
        data: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
          message: lead.message,
          assignedToId: assignedUser?.id ?? null,
          followUpActivities: {
            create: [
              {
                type: lead.activityType,
                note: lead.activityNote,
                happenedAt: lead.happenedAt,
                userId: activityAuthor.id,
              },
            ],
          },
        },
      });
    }),
  );

  console.log(
    `Seeded ${createdLeads.length} demo leads for ${salesUser.email}`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
