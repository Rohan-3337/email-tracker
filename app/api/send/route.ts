import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { subject, html, to } = await req.json();
  const { userId } = await auth();
  console.log(subject,html,to);
  // 1. Ensure user is authenticated
  const user = await prisma.user.findUnique({ where: { clerkId: userId! } });
  if (!user?.refreshToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 2. Create Email record in DB (needed to track opens)
  const email = await prisma.email.create({
    data: {
      userId: user.id,
      to,
      subject,
      body: html,
    },
  });

  // 3. Inject Open Tracking Pixel with correct emailId
  const emailId = email.id;
  const trackingPixel = `<img src="${process.env.NEXT_DOMAIN_URL}api/track/open?emailId=${emailId}" width="1" height="1" style="display:none;" />`;
  console.log(trackingPixel);
  const trackedHtml = html + trackingPixel;

  // 4. Send the actual email with tracking pixel
  await sendEmail(to, subject, trackedHtml, user.refreshToken);

  return NextResponse.json({ success: true });
}