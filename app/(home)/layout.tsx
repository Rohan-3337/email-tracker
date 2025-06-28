
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const HomeLayout = async({children}:{children:React.ReactNode}) => {
//       const {userId} =await auth();
    
//     console.log(userId);
//   if(!userId){
//     return redirect("/auth/sign-in");

//   }

//    const existingUser = await prisma.user.findUnique({
//     where: {
//       clerkId: userId! as string,
//     },
//   });
//   if(userId && !existingUser?.refreshToken){
//       return redirect("/")
//   }
//   if(!existingUser?.refreshToken){
//     return redirect("/dashboard")
//   }
//    if (!existingUser) {
//     // Fetch more info from Clerk if needed
//     const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
//       },
//     }).then((res) => res.json());

//     const email = clerkUser?.email_addresses?.[0]?.email_address;

//     await prisma.user.create({
//       data: {
//         clerkId: userId!,
//         email: email,
//         refreshToken: '',
//       },
//     });
//   }
  return (
    <div>
        {children}

    </div>
  )
}

export default HomeLayout