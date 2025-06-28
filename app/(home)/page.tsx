// app/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } =await auth();

  if (!userId) return redirect("/auth/sign-in");

  let existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    }).then((res) => res.json());

    const email = clerkUser?.email_addresses?.[0]?.email_address;

    existingUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
        refreshToken: '', // default value
      },
    });
  }

  // ✅ Safe redirect logic (avoid loops)
  if (!existingUser.refreshToken) {
    return redirect("/setup"); // maybe a setup page for onboarding
  }

  return redirect("/dashboard");
}
