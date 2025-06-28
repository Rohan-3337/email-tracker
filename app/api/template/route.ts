// app/api/templates/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId:clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { clerkId} });
  const templates = await prisma.template.findMany({ where: { userId:user?.id } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { name, category, subject, content } = await req.json();

    const template = await prisma.template.create({
      data: {
        userId: user.id, 
        name,
        category,
        subject,
        content,
      },
    });

    return NextResponse.json(template);
  } catch (err) {
    console.error('POST /api/templates error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

