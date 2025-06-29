import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emails = await prisma.email.findMany({
      where: {
        user: { clerkId: userId },
      },
      include: {
        openEvents: true,
      },
      orderBy: {
        sentAt: 'desc',
      },
    });

    const result = emails.map((email) => {
      const opens = email.openEvents.length;
      const lastOpened =
        opens > 0
          ? email.openEvents
              .map((e) => new Date(e.openedAt))
              .sort((a, b) => b.getTime() - a.getTime())[0]
          : null;

      return {
        id: email.id,
        subject: email.subject,
        recipientEmail: email.to,
        sentAt: email.sentAt,
        openCount: opens,
        lastOpenedAt: lastOpened,
        status: opens > 0 ? 'Opened' : 'Not Opened',
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('ANALYTICS ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
