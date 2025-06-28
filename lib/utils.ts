import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Resend } from 'resend';

const resend = new Resend('re_Kqy9qU5A_ExKmfRkmTJiW3DgAy2e9WaXA')
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function EmailSend(){
  const res = await resend.emails.send({
  from: 'rohan001813@gmail.com',
  to: ['durgawati7275@gmail.com'],
  subject: 'hello world',
  html: '<p>it works!</p>',
});
  console.log(res);
}
