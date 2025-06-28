'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailPreview from './EmailPreview'; // Import preview component

type EmailData = {
  subject: string;
  content: string;
  recipientName?: string;
};

export function SmartEmailDialog({
  initialData,
  onSubmit,
  onOpen,
  setOpen,
}: {
  initialData: EmailData;
  onSubmit: (data: EmailData) => void;
  onOpen: boolean;
  setOpen:(data:boolean)=>void;
}) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  const detectedVars = useMemo(() => {
    const regex = /\{\{(.*?)\}\}/g;
    const vars = [
      ...Array.from(initialData.subject.matchAll(regex), (m) => m[1]),
      ...Array.from(initialData.content.matchAll(regex), (m) => m[1]),
    ];
    const baseVars = [...new Set(vars)];
    if (initialData.recipientName?.includes('{{')) {
      baseVars.push('recipient_name');
    }
    return baseVars;
  }, [initialData]);

  useEffect(() => {
    const obj: Record<string, string> = {};
    detectedVars.forEach((v) => (obj[v] = ''));
    setVariables(obj);
  }, [detectedVars]);

  const replaceVars = (text: string) =>
    Object.entries(variables).reduce(
      (acc, [key, val]) =>
        acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val),
      text
    );

  const finalSubject = replaceVars(initialData.subject);
  const finalContent = replaceVars(initialData.content);
  const recipientName = variables['recipient_name'] || initialData.recipientName;

  const handleSubmit = () => {
    for (const [key, value] of Object.entries(variables)) {
      if (!value.trim()) return;
    }

    onSubmit({
      subject: finalSubject,
      content: finalContent,
      recipientName,
    });

    setOpen(false);
  };

  return (
    <Dialog open={onOpen} onOpenChange={()=>setOpen(false)} >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Send Email</Button>
      </DialogTrigger>

        <DialogHeader>
          <DialogTitle>Complete Email Details</DialogTitle>
        </DialogHeader>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" > {/* wider dialog */}

        <div className="flex flex-col gap-4 mt-2">
          {Object.keys(variables).map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/_/g, ' ')}
              </Label>
              <Input
                id={key}
                value={variables[key]}
                onChange={(e) =>
                  setVariables({ ...variables, [key]: e.target.value })
                }
                placeholder={`Enter ${key.replace(/_/g, ' ')}`}
              />
            </div>
          ))}
        </div>

        {/* ✅ Preview Section */}
        <EmailPreview
          recipient={recipientName}
          subject={finalSubject}
          content={finalContent}
        />

       
       <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
