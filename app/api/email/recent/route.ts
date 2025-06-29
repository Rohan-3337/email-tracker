import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (!user) return NextResponse.json([], { status: 200 });

  const emails = await prisma.email.findMany({
    where: { userId: user.id },
    include: { openEvents: true },
    orderBy: { sentAt: 'desc' },
  });

  const seen = new Set<string>();
  let result:any = [];

  for (const email of emails) {
    const key = `${email.to}|${email.subject}|${email.body}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        id: email.id,
        name: email.subject,
        to: email.to,
        sentDate: email.sentAt ? email.sentAt.toDateString() : '—',
        opened: email.openEvents.length > 0,
        totalSent: 1,
      });
      console.log(email?.openEvents?.length)
    } else {
      const existing = result.find((r:any) => `${r?.to}|${r?.name}|${email?.body}` === key);
      if (existing) existing.totalSent += 1;
    }

    if (result.length >= 5) break; 
  }

  return NextResponse.json(result);
}
