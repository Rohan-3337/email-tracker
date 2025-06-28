'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function extractVariables(template: string) {
  const regex = /{{(.*?)}}/g;
  const matches = [...template.matchAll(regex)];
  return matches.map((m) => m[1].trim());
}

export function TemplateDialog({ template, onSubmit }: { template: string; onSubmit: (filled: string) => void }) {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const variables = extractVariables(template);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    let finalEmail = template;
    for (const key of variables) {
      finalEmail = finalEmail.replace(`{{${key}}}`, formValues[key] || '');
    }
    onSubmit(finalEmail);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Use Template
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fill Template Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {variables.map((v) => (
              <div key={v} className="space-y-1">
                <Label htmlFor={v}>{v}</Label>
                <Input
                  name={v}
                  id={v}
                  placeholder={`Enter ${v}`}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}