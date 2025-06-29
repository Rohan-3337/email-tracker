import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const emails = await prisma.email.findMany({
      where: { userId: user.id },
      include: {
        openEvents: {
          select: {
            openedAt: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    });

    return NextResponse.json(emails);
  } catch (error) {
    console.error('[EMAIL_SENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
