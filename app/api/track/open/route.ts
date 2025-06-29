import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const emailId = new URL(req.url).searchParams.get('emailId'); 
  console.log(emailId);
  if (emailId) {
    try {
      const emailExists = await prisma.email.findUnique({
        where: { id: emailId },
        select: { id: true },
      });
      console.log(emailExists);
      if (emailExists) {
      
        const alreadyOpened = await prisma.openEvent.findFirst({
          where: { emailId },
        });
        console.log(alreadyOpened);

        if (!alreadyOpened) {
          await prisma.openEvent.create({ data: { emailId } });
          console.log('Open tracked for email ID:', emailId);
        } else {
          console.log('Open already tracked for email ID:', emailId);
        }
      } else {
        console.warn('Email ID not found:', emailId);
      }
    } catch (error) {
      console.error('Error tracking open:', error);
    }
  }

  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    'base64'
  );

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store',
    },
  });
}
