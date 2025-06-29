'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { EmailType } from '@/app/dashboard/sent/page';

interface EmailDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  emailId?: string | null;
 
}

interface EmailData {
  subject: string;
  to: string;
  body: string;
  sentDate: string;
  opened: boolean;
}

export default function EmailDetailsDialog({
  open,
  onClose,
  emailId,
 
}: EmailDetailsDialogProps) {
  const [email, setEmail] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailId) return;

  
    // Otherwise, fetch from server
    setLoading(true);
    fetch(`/api/email/details?id=${emailId}`)
      .then((res) => res.json())
      .then((res) => {
        setEmail({
          subject: res.subject,
          to: res.to,
          body: res.body,
          sentDate: res.sentDate,
          opened: res.opened,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch email:', err);
        setLoading(false);
      });
  }, [emailId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email Details</DialogTitle>
          <DialogDescription>Full details of your email</DialogDescription>
        </DialogHeader>

        {loading || !email ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-lg">{email.subject}</h4>
                <p className="text-muted-foreground text-sm">
                  To: <span className="font-medium">{email.to}</span>
                </p>
              </div>
              <Badge
                className={
                  email.opened
                    ? 'bg-green-400'
                    : 'bg-yellow-300 text-muted-foreground'
                }
              >
                {email.opened ? 'Opened' : 'Not Opened'}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              Sent on: {email.sentDate}
            </div>

            <div className="border rounded p-4 text-sm whitespace-pre-wrap max-h-[300px] overflow-auto bg-muted/30">
              {email.body}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
