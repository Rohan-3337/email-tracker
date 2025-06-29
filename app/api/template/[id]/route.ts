import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try{
      const  params  = await context;
    const {id} = await params?.params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const { name, category, subject, content } = await req.json();

    const updated = await prisma.template.update({
      where: { id },
      data: {
        userId: user.id,
        name,
        category,
        subject,
        content,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[TEMPLATE_PUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const  params  = await context;
    const {id} = await params?.params;

    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('[TEMPLATE_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Template deletion failed' }, { status: 500 });
  }
}
