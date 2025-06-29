import { prisma } from '@/lib/prisma';

export async function getEmailStats(userId: string) {
    const user = await prisma.user.findFirst({
        where:{
            clerkId:userId
        }
    })
  const totalEmails = await prisma.email.count({
    where: { userId:user?.id },
  });

  // Step 1: get all email IDs for the user
  const userEmails = await prisma.email.findMany({
    where: { userId:user?.id },
    select: { id: true },
  });
  const emailIds = userEmails.map(e => e.id);

  // Step 2: count open events where emailId is in the user’s email IDs
  const totalOpens = await prisma.openEvent.count({
    where: {
      emailId: { in: emailIds },
    },
  });

  // Step 3: count unique recipients
  const uniqueRecipients = await prisma.email.findMany({
    where: { userId },
    select: { to: true },
  });
  const uniqueContacts = new Set(uniqueRecipients.map((r) => r.to)).size;

  // Step 4: calculate open rate
  const openRate = totalEmails > 0 ? ((totalOpens / totalEmails) * 100).toFixed(1) : '0.0';

  return {
    totalEmails,
    openRate,
    activeContacts: uniqueContacts,
  };
}
