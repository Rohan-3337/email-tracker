import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  console.log(id)
  const user = await prisma.user.findFirst({
    where:{
        clerkId:userId
    }
  })
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const email = await prisma.email.findUnique({
    where: { id },
    include: { openEvents: true },
  });
  console.log(email);

  if (!email || email.userId !== user?.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: email.id,
    name: email.subject,
    to: email.to,
    body: email.body,
    opened: email.openEvents.length > 0,
    sentDate: email.sentAt?.toDateString() || '—',
  });
}
