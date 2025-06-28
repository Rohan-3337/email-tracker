'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Eye, MoreHorizontal, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { ViewEmailDialog } from '@/components/compose/ViewEmailDialog';

const emails = [
  {
    id: 'email_1',
    to: 'john@example.com',
    subject: 'Welcome to our platform!',
    body: 'Hi John, we’re excited to have you on board.',
    sentAt: '2024-06-20T10:30:00.000Z',
    openEvents: [{ openedAt: '2024-06-20T11:00:00.000Z' }, { openedAt: '2024-06-21T09:45:00.000Z' }],
  },
  {
    id: 'email_2',
    to: 'jane@example.com',
    subject: 'Your weekly update',
    body: 'Here’s what’s new this week...',
    sentAt: '2024-06-18T14:15:00.000Z',
    openEvents: [],
  },
];

export default function SentEmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sent Emails</h1>
          <p className="text-muted-foreground">Track performance of individual sent emails.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Emails</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search emails..." className="pl-10 w-[300px]" />
              </div>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="not_opened">Not Opened</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{email.subject}</h3>
                      <Badge variant={email.openEvents.length > 0 ? 'default' : 'secondary'}>
                        {email.openEvents.length > 0 ? 'Opened' : 'Not Opened'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      To: {email.to} <br />
                      <span>Sent: {format(new Date(email.sentAt), 'yyyy-MM-dd HH:mm')}</span>

                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{email.body}</div>

                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span>{email.openEvents.length} open{email.openEvents.length !== 1 && 's'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>Email ID: {email.id.slice(0, 8)}…</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => { setSelectedEmail(email); setDialogOpen(true); }}>
                        View Full
                        </DropdownMenuItem>
                      <DropdownMenuItem>Resend</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedEmail && (
        <ViewEmailDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          email={selectedEmail}
        />
      )}
      
    </div>
  );
}
