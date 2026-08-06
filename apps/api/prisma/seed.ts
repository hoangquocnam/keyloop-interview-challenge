import { LeadStatus, PrismaClient, UserRole } from '@prisma/client';
import type {
  LeadActivityType,
  LeadSource,
  PreferredContactMethod,
} from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const now = Date.now();
const legacyDemoLeadEmails = ['jamie.brooks@example.com'] as const;

type DemoLeadActivitySeed = {
  readonly actorUserEmail: string | null;
  readonly happenedAt: Date;
  readonly note: string;
  readonly title: string;
  readonly type: LeadActivityType;
};

type DemoLeadSeed = {
  readonly assignedUserEmail: string | null;
  readonly activities: readonly DemoLeadActivitySeed[];
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly message: string;
  readonly phone: string | null;
  readonly preferredContactMethod: PreferredContactMethod;
  readonly source: LeadSource;
  readonly status: LeadStatus;
};

const featuredDemoLeads: readonly DemoLeadSeed[] = [
  {
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'm.scott@dundermifflin.com',
    phone: '(555) 123-4567',
    preferredContactMethod: 'email',
    source: 'website_form',
    status: LeadStatus.NEW,
    message:
      "Hello, I am highly interested in the new 2024 SUV model in midnight blue. I'd like to schedule a test drive for this coming Saturday if possible. Do you have financing options available for this specific trim?",
    assignedUserEmail: 'jim.halpert@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 26 * 60 * 60 * 1000),
        note: 'New lead entered the system from dealership website form.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'jim.halpert@leadstream.com',
        happenedAt: new Date(now - 20 * 60 * 60 * 1000),
        note: 'Left a voicemail to confirm Saturday test drive availability.',
        title: 'Outbound Call',
        type: 'call',
      },
      {
        actorUserEmail: 'jim.halpert@leadstream.com',
        happenedAt: new Date(now - 16 * 60 * 60 * 1000),
        note: 'Sent follow-up email regarding financing options for the 2024 SUV.',
        title: 'Email Sent',
        type: 'email',
      },
    ],
  },
  {
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 's.connor@sky.net',
    phone: '(555) 987-6543',
    preferredContactMethod: 'phone',
    source: 'phone_inbound',
    status: LeadStatus.CONTACTED,
    message:
      'I called today to ask about current hybrid inventory and the soonest pickup timeline. Please confirm which trims are available this week and whether you can hold one for a scheduled visit tomorrow afternoon.',
    assignedUserEmail: 'dwight.schrute@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 29 * 60 * 60 * 1000),
        note: 'Inbound call lead was captured and routed to Dwight Schrute.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'dwight.schrute@leadstream.com',
        happenedAt: new Date(now - 24 * 60 * 60 * 1000),
        note: 'Confirmed stock availability and arranged a follow-up showroom visit.',
        title: 'Outbound Call',
        type: 'call',
      },
    ],
  },
  {
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'b.wayne@wayneent.com',
    phone: null,
    preferredContactMethod: 'email',
    source: 'walk_in',
    status: LeadStatus.QUALIFIED,
    message:
      'I am interested in a premium SUV with fleet-ready options and would like a quote that includes concierge delivery. Please share the best trim levels for executive transport and any protection packages you recommend.',
    assignedUserEmail: 'pam.beesly@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 48 * 60 * 60 * 1000),
        note: 'Met the customer during a dealership visit and collected vehicle preferences.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'pam.beesly@leadstream.com',
        happenedAt: new Date(now - 36 * 60 * 60 * 1000),
        note: 'Sent quote with premium trim comparison and fleet options.',
        title: 'Quote Sent',
        type: 'email',
      },
    ],
  },
  {
    firstName: 'Arthur',
    lastName: 'Dent',
    email: 'a.dent@hitchhiker.org',
    phone: '(555) 424-2424',
    preferredContactMethod: 'email',
    source: 'website_form',
    status: LeadStatus.NEW,
    message:
      'Hello, my current plans changed unexpectedly and I need a compact vehicle for reliable daily travel. I would love a walkthrough of your entry-level SUV options and whether a quick test drive is available this week.',
    assignedUserEmail: null,
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 27 * 60 * 60 * 1000),
        note: 'New lead entered the system from the dealership website form.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'admin@leadstream.com',
        happenedAt: new Date(now - 23 * 60 * 60 * 1000),
        note: 'Queued first-response email with compact SUV recommendations.',
        title: 'Email Sent',
        type: 'email',
      },
    ],
  },
  {
    firstName: 'Leslie',
    lastName: 'Knope',
    email: 'l.knope@pawnee.gov',
    phone: '(555) 314-1592',
    preferredContactMethod: 'email',
    source: 'website_form',
    status: LeadStatus.NEW,
    message:
      'I am looking for a dependable hybrid SUV for city travel and community events. Please send available models, estimated delivery timelines, and whether you have any public-sector incentive programs.',
    assignedUserEmail: 'pam.beesly@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 18 * 60 * 60 * 1000),
        note: 'Lead submitted from the website form and assigned to Pam Beesly.',
        title: 'Lead Received',
        type: 'system',
      },
    ],
  },
  {
    firstName: 'Dana',
    lastName: 'Scully',
    email: 'd.scully@fbi.gov',
    phone: '(555) 246-8101',
    preferredContactMethod: 'phone',
    source: 'phone_inbound',
    status: LeadStatus.CONTACTED,
    message:
      'I called in earlier about financing options and I am evaluating a mid-size SUV for weekend travel. Please send over payment estimates and let me know the soonest available callback window.',
    assignedUserEmail: 'jim.halpert@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 30 * 60 * 60 * 1000),
        note: 'Inbound call lead was captured and assigned to Jim Halpert.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'jim.halpert@leadstream.com',
        happenedAt: new Date(now - 25 * 60 * 60 * 1000),
        note: 'Returned the call and reviewed financing ranges for two trim levels.',
        title: 'Outbound Call',
        type: 'call',
      },
    ],
  },
  {
    firstName: 'Jean-Luc',
    lastName: 'Picard',
    email: 'j.picard@starfleet.space',
    phone: '(555) 170-1701',
    preferredContactMethod: 'email',
    source: 'walk_in',
    status: LeadStatus.QUALIFIED,
    message:
      'I visited the showroom and would like a final quote for the executive transport package. Please include the premium interior bundle and any driver-assistance options suitable for long-distance travel.',
    assignedUserEmail: 'dwight.schrute@leadstream.com',
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 52 * 60 * 60 * 1000),
        note: 'Discussed premium trim options during the showroom visit.',
        title: 'Lead Received',
        type: 'system',
      },
      {
        actorUserEmail: 'dwight.schrute@leadstream.com',
        happenedAt: new Date(now - 44 * 60 * 60 * 1000),
        note: 'Shared final quote for the executive transport package.',
        title: 'Quote Sent',
        type: 'email',
      },
    ],
  },
  {
    firstName: 'Ellen',
    lastName: 'Ripley',
    email: 'e.ripley@weylandyutani.com',
    phone: '(555) 777-4269',
    preferredContactMethod: 'email',
    source: 'website_form',
    status: LeadStatus.NEW,
    message:
      'I need more details on cargo capacity before I schedule a visit. Please send the dimensions, rear-seat fold-flat options, and anything else that would help me evaluate whether the vehicle fits heavier field equipment.',
    assignedUserEmail: null,
    activities: [
      {
        actorUserEmail: null,
        happenedAt: new Date(now - 12 * 60 * 60 * 1000),
        note: 'Lead captured from the website form and left unassigned for triage.',
        title: 'Lead Received',
        type: 'system',
      },
    ],
  },
];

const generatedStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
] as const;

const generatedSources = ['website_form', 'phone_inbound', 'walk_in'] as const;

const generatedAssignees = [
  'jim.halpert@leadstream.com',
  'dwight.schrute@leadstream.com',
  'pam.beesly@leadstream.com',
  null,
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
      generatedLastNames[
        Math.floor(index / generatedFirstNames.length) %
          generatedLastNames.length
      ];
    const status = generatedStatuses[index % generatedStatuses.length];
    const source = generatedSources[index % generatedSources.length];
    const assignedUserEmail =
      generatedAssignees[index % generatedAssignees.length];
    const minutesAgo = (index + 1) * 37;
    const happenedAt = new Date(now - minutesAgo * 60 * 1000);
    const preferredContactMethod =
      source === 'phone_inbound' ? 'phone' : 'email';
    const activities: readonly DemoLeadActivitySeed[] =
      status === LeadStatus.NEW
        ? [
            {
              actorUserEmail: null,
              happenedAt,
              note: `New lead entered the system from the ${source.replaceAll('_', ' ')} channel.`,
              title: 'Lead Received',
              type: 'system',
            },
          ]
        : status === LeadStatus.CONTACTED
          ? [
              {
                actorUserEmail: assignedUserEmail,
                happenedAt,
                note: `Completed first outreach for demo lead ${index + 1}.`,
                title: 'Outbound Call',
                type: 'call',
              },
            ]
          : [
              {
                actorUserEmail: assignedUserEmail,
                happenedAt,
                note: `Shared pricing details for demo lead ${index + 1}.`,
                title: 'Quote Sent',
                type: 'email',
              },
            ];

    return {
      firstName,
      lastName,
      email: `lead${index + 1}@leadstream.demo`,
      phone: `(555) ${String(1000000 + index).slice(0, 3)}-${String(1000 + index).slice(-4)}`,
      preferredContactMethod,
      source,
      status,
      message: `Demo lead ${index + 1} requesting more information about available vehicles and financing options.`,
      assignedUserEmail,
      activities,
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

      return prisma.lead.create({
        data: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
          message: lead.message,
          preferredContactMethod: lead.preferredContactMethod,
          assignedToId: assignedUser?.id ?? null,
          followUpActivities: {
            create: lead.activities.map((activity) => {
              const activityAuthor = activity.actorUserEmail
                ? (assignedUserByEmail.get(activity.actorUserEmail) ??
                  salesUser)
                : salesUser;

              return {
                type: activity.type,
                title: activity.title,
                note: activity.note,
                happenedAt: activity.happenedAt,
                userId: activityAuthor.id,
              };
            }),
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
