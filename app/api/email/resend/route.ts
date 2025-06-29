import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
    try {
       const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { emailId } = await req.json();
    const user = await prisma.user.findFirst({
        where: {
            clerkId: userId
        }
    })
    const email = await prisma.email.findFirst({
        where: { id: emailId, user: { clerkId: userId } }
    });

    if (!email) return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    console.log('Resending email to:', email.to);
    await sendEmail(email.to, email.subject, email.body, user?.refreshToken)

    return NextResponse.json({ message: 'Resend Succesfully' });
 
    } catch (error) {
        console.log("ERROR_RESEND",error);
        return NextResponse.json({ error: 'Server issue' }, { status: 404 });
    }
}
