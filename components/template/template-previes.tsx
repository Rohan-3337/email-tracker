"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    category: string;
    subject: string;
    content: string;
  };
  open: boolean;
  onClose: () => void;
}

export function TemplatePreview({ template, open, onClose }: TemplatePreviewProps) {
  const templateContent = {
    subject: `Subject: ${template.subject}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">${template.name}</h2>
        <p style="color: #555; line-height: 1.5;">
          Hello {{recipient_name}},
        </p>
        <p style="color: #555; line-height: 1.5;">
          ${template.content}
        </p>
        <p style="color: #555; line-height: 1.5;">
          Best regards,<br>
          {{sender_name}}<br>
          {{sender_company}}
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
          <p>
            {{company_address}}<br>
            <a href="{{unsubscribe_link}}" style="color: #999;">Unsubscribe</a>
          </p>
          <img src="{{tracking_pixel}}" width="1" height="1" style="display: none;" alt="" />
        </div>
      </div>
    `,
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              This is how your email will appear to recipients.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium">Subject Line</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {templateContent.subject}
            </p>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Email Body</h3>
            <div
              className="email-preview"
              dangerouslySetInnerHTML={{ __html: templateContent.body }}
            />
          </div>

          <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 p-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Template Tags</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              The following tags will be replaced with actual data when the email is sent:
            </p>
            <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 space-y-1 list-disc pl-5">
              <li><code>{`{{recipient_name}}`}</code>: The recipient's name</li>
              <li><code>{`{{sender_name}}`}</code>: Your name</li>
              <li><code>{`{{sender_company}}`}</code>: Your company name</li>
              <li><code>{`{{company_address}}`}</code>: Your company address</li>
              <li><code>{`{{unsubscribe_link}}`}</code>: Required unsubscribe link</li>
              <li><code>{`{{tracking_pixel}}`}</code>: Open tracking pixel (automatically included)</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
