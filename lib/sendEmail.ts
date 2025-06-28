import { getGmailClient } from '@/lib/google';

export async function sendEmail(to: string, subject: string, html: string, refreshToken: string) {
  const gmail = await getGmailClient(refreshToken);
  const encodedMessage = Buffer.from(
    `To: ${to}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${html}`
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  console.log(await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  }));
}