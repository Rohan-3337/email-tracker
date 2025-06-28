'use client';

import { Separator } from '@/components/ui/separator';

type EmailPreviewProps = {
  recipient?: string;
  subject: string;
  content: string;
};

export default function EmailPreview({
  recipient,
  subject,
  content,
}: EmailPreviewProps) {
  return (
    <div className="space-y-2 mt-4">
      <Separator className="my-4" />
      <h3 className="font-semibold text-lg">📧 Preview</h3>
      {recipient && (
        <div>
          <strong>To:</strong> {recipient}
        </div>
      )}
      <div>
        <strong>Subject:</strong> {subject}
      </div>
      <div className="border p-3 rounded-md bg-muted text-sm max-h-64 overflow-y-auto whitespace-pre-line">
        {content || 'No content yet.'}
      </div>
    </div>
  );
}
