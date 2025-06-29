'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailPreview from './EmailPreview';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  onSubmit: (data: EmailData) => any;
  onOpen: boolean;
  setOpen: (data: boolean) => void;
}) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading,setIsLoading] =useState(false);
  const router = useRouter();


  const detectedVars = useMemo(() => {
    const regex = /\{\{(.*?)\}\}/g;
    const vars = [
      ...Array.from(initialData.subject.matchAll(regex), (m) => m[1]),
      ...Array.from(initialData.content.matchAll(regex), (m) => m[1]),
    ];
    const baseVars = [...new Set(vars)];

   
    if (!initialData.recipientName) {
      baseVars.push('recipient_name');
    }

    return baseVars;
  }, [initialData]);


  useEffect(() => {
    const obj: Record<string, string> = {};
    detectedVars.forEach((v) => {
      obj[v] = '';
    });
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
  const recipientName =
    initialData.recipientName || variables['recipient_name'] || '';

 
  const handleSubmit = async() => {
    for (const [key, value] of Object.entries(variables)) {
      if (!value.trim()) return;
    }

    if (!recipientName.trim()) return;
    setIsLoading(true);
     await onSubmit({
      subject: finalSubject,
      content: finalContent,
      recipientName,
    }).then(()=>{
      setIsLoading(false);
      router.refresh();
      window.location.reload();
    }).catch(()=>{
      setIsLoading(false)
    })
   
    setOpen(false);
  };

  return (
    <Dialog open={onOpen} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Email Details</DialogTitle>
        </DialogHeader>

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

        <EmailPreview
          recipient={recipientName}
          subject={finalSubject}
          content={finalContent}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading &&<Loader2 className=' mr-2 w-4 h-4 animate-spin'/>}
            Send
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
