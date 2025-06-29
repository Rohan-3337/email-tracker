'use client';

import { useEffect, useState } from 'react';
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
import { Search, Filter, Eye, MoreHorizontal, Mail, Trash, EyeIcon, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import EmailDetailsDialog from '@/components/ui/EmailDetailsDialog';
import { Resend } from '@/lib/actions/Resend';
import { DeleteEmailModal } from '@/components/DeleteDialog';

export interface EmailType {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  openEvents: { openedAt: string }[];
}

export default function SentEmailsPage() {
  const [emails, setEmails] = useState<EmailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'opened' | 'not_opened'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    fetch('/api/email/sent')
      .then((res) => res.json())
      .then((data) => setEmails(data))
      .catch((err) => console.error('Error fetching emails:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEmails = emails.filter((email) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'opened' && email.openEvents.length > 0) ||
      (filter === 'not_opened' && email.openEvents.length === 0);

    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.to.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sent Emails</h1>
          <p className="text-muted-foreground">
            Track performance of individual sent emails.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Emails</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  className="pl-10 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filter}
                onValueChange={(val) =>
                  setFilter(val as 'all' | 'opened' | 'not_opened')
                }
              >
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
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 border rounded-lg space-y-2 animate-pulse"
                >
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                </div>
              ))

              : filteredEmails.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No emails found matching.
                </div>
              ) :
                filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{email.subject}</h3>
                          <Badge
                            className={email.openEvents.length>0 ?" bg-green-400":" bg-yellow-200 text-muted-foreground"}
                          >
                            {email.openEvents.length > 0
                              ? 'Opened'
                              : 'Not Opened'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          To: {email.to} <br />
                          <span>
                            Sent: {format(new Date(email.sentAt), 'yyyy-MM-dd HH:mm')}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {email.body}
                        </div>

                        <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-green-500" />
                            <span>
                              {email.openEvents.length} open
                              {email.openEvents.length !== 1 && 's'}
                            </span>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmail(email);
                              setDialogOpen(true);
                            }}
                          >
                            <EyeIcon className=' h-4 w-4 mr-2'/>
                            View Full
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async()=>await Resend(email?.id)}>
                            <RefreshCw className=' mr-2 h-4 w-4'/>
                            Resend
                            </DropdownMenuItem>
                          <DropdownMenuItem variant='destructive' className="text-destructive"
                          onClick={()=>{
                            setDeleteDialogOpen(true);
                            setDeleteId(email?.id);
                          }}>
                            <Trash className=' mr-2 h-4 w-4  text-red-400'/>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      {selectedEmail && (
        <EmailDetailsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          emailId={selectedEmail.id}

        />
      )}
      <DeleteEmailModal
      isOpen={deleteDialogOpen}
      onClose={()=>{
        setDeleteDialogOpen(false);
      }}
      id={deleteId}
      />
    </div>
  );
}

