import { LeadStatus, PrismaClient, UserRole } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

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

  const existingLead = await prisma.lead.findFirst({
    where: { email: 'jamie.brooks@example.com' },
  });

  if (existingLead) {
    return;
  }

  const lead = await prisma.lead.create({
    data: {
      firstName: 'Jamie',
      lastName: 'Brooks',
      email: 'jamie.brooks@example.com',
      phone: '+44 7700 900123',
      source: 'website',
      status: LeadStatus.NEW,
      message: 'Interested in booking a test drive for a family SUV.',
      assignedToId: salesUser.id,
      followUpActivities: {
        create: [
          {
            type: 'lead_created',
            note: 'Lead captured from website contact form.',
            happenedAt: new Date(),
            userId: salesUser.id,
          },
        ],
      },
    },
  });

  console.log(`Seeded lead ${lead.id} for ${salesUser.email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
