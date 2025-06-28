// app/api/templates/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  const id = params.id;
if(userId){

    const template = await prisma.template.findFirst({
        where: { id, userId },
    });
    
    if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    return NextResponse.json(template);
}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  const id = params.id;
  const { name, category, subject, content } = await req.json();

  const template = await prisma.template.update({
    where: { id },
    data: { name, category, subject, content },
  });

  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  const id = params.id;

  await prisma.template.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
