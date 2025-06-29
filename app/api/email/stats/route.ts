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
            where: {
                clerkId: userId
            }
        })
        const totalEmails = await prisma.email.count({
            where: { userId: user?.id },
        });

        const allRecipients = await prisma.email.findMany({
            where: { userId: user?.id },
            select: { to: true },
        });

        const openEvents = await prisma.openEvent.findMany({
            where: {
                email: {
                    userId: user?.id,
                },
            },
            select: {
                emailId: true,
            },
            distinct: ['emailId'],
        });

        const openRate =
            totalEmails > 0 ? ((openEvents.length / totalEmails) * 100).toFixed(1) : '0.0';

        const uniqueContacts = new Set(allRecipients.map((r) => r.to)).size;

        return NextResponse.json({
            totalEmails,
            openRate,
            activeContacts: uniqueContacts,
        });
    } catch (error) {
        console.error('Error fetching email stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
