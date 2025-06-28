import { EmailList } from '@/components/inbox/email-list';

export default function InboxPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Manage your incoming emails and replies.
          </p>
        </div>
      </div>

      <EmailList />
    </div>
  );
}