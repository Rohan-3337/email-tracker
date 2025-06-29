import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { emailId } = await req.json();

        await prisma.openEvent.deleteMany({ where: { emailId } }); 
        await prisma.email.delete({ where: { id: emailId } });

        return NextResponse.json({ message: 'Email deleted.' });
    } catch (error) {
        console.log("Error_DELETE",error);
        return NextResponse.json({ error:"Server issue" },{status:500});
    }

}
