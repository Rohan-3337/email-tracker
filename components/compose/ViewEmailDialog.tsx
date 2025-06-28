// components/email/ViewEmailDialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ViewEmailDialogProps {
  open: boolean;
  onClose: () => void;
  email: {
    subject: string;
    to: string;
    body: string;
    sentAt: Date;
  };
}

export function ViewEmailDialog({ open, onClose, email }: ViewEmailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email to {email.to}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Sent at: {new Date(email.sentAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Subject:</h3>
            <p>{email.subject}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Body:</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {email.body}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
