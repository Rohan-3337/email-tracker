import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({
        where:{
            clerkId:userId
        }
    })
  const months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const label = date.toLocaleString('default', { month: 'short' });
    return {
      label,
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  });

  const results = await Promise.all(
    months.map(async (m) => {
      const emails = await prisma.email.findMany({
        where: {
          userId:user?.id,
          sentAt: { gte: m.start, lte: m.end },
        },
        select: { id: true },
      });

      const emailIds = emails.map((e) => e.id);

      const opens = await prisma.openEvent.count({
        where: { emailId: { in: emailIds } },
      });

      return {
        name: m.label,
        opens,
      };
    })
  );

  return NextResponse.json(results);
}
