import { EmailEditor } from '@/components/compose/email-editor';

export default function ComposePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compose Email</h1>
          <p className="text-muted-foreground">
            Create and send emails with AI-powered assistance.
          </p>
        </div>
      </div>

      <EmailEditor />
    </div>
  );
}
