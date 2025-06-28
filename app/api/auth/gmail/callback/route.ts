import { getOAuthClient } from '@/lib/google';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code');

  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code!);

  const userInfo = google.oauth2('v2').userinfo;
  oauth2Client.setCredentials(tokens);
  const { data } = await userInfo.get({ auth: oauth2Client });

  const { userId } = await auth();
  console.log(data,userId,tokens)

  await prisma.user.upsert({
    where: { clerkId: userId! },
    update: { email: data.email!, refreshToken: tokens.refresh_token! },
    create: { clerkId: userId!, email: data.email!, refreshToken: tokens.refresh_token! },
  });

  return NextResponse.redirect(new URL('/dashboard', req.url));

}