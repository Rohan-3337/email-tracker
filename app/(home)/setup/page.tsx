'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/api/auth/gmail');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted">
      <Card className=" max-w-md p-6 w-[40vw] m-4 flex justify-center items-center">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Connect Your Gmail</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in with your Gmail account to start sending and tracking emails.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleLogin} className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Sign in with Gmail
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

