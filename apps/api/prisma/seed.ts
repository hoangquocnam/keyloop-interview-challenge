import { LeadStatus, PrismaClient, UserRole } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const now = Date.now();
const legacyDemoLeadEmails = ['jamie.brooks@example.com'] as const;

const demoLeads = [
  {
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'm.scott@dundermifflin.com',
    phone: '(555) 123-4567',
    source: 'Website Form',
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
    source: 'Phone Inbound',
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
    source: 'Walk-in',
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
    source: 'Website Form',
    status: LeadStatus.NEW,
    message: 'Needs a compact vehicle after an unexpected trip.',
    assignedUserEmail: null,
    activityType: 'lead_created',
    activityNote: 'Lead captured from the website form.',
    happenedAt: new Date(now - 3 * 60 * 60 * 1000),
  },
] as const;

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
