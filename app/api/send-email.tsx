import { NextRequest, NextResponse } from "next/server";


export default async function handler(req:NextRequest, res:NextResponse) {
  if (req.method !== 'POST') return new Response("Method not Allowed",{
  status:405
  });

  const { to, subject, html } = await req.json();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'your_email@example.com',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(error,{
        status:response.status
      })
    }

    const data = await response.json();
    return new Response(data,{
        status:200
      })
  } catch (error) {
    return new Response("Server Error ",{
        status:500
      })
  }
}
