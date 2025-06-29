'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Resend } from '@/lib/actions/Resend';
import EmailDetailsDialog from '@/components/ui/EmailDetailsDialog';
import { DeleteEmailModal } from '@/components/DeleteDialog';

interface EmailAnalyticsEntry {
  id: string;
  subject: string;
  recipientEmail: string;
  sentAt: string;
  status:string;
  openCount:number;
  lastOpenedAt: string | null;
}

export default function EmailAnalyticsPage() {
  const [emails, setEmails] = useState<EmailAnalyticsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'opened' | 'not_opened'>('all');
  const [search, setSearch] = useState('');
  const [open,setOpen] =useState(false);
  const [id,setId] =useState<string|null>("");

  useEffect(() => {
    fetch('/api/email/analytics')
      .then((res) => res.json())
      .then((data) => setEmails(data))
      .catch((err) => console.error('Error fetching analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(search.toLowerCase()) ||
      email.recipientEmail.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'opened' && email.openCount > 0) ||
      (filter === 'not_opened' && email.openCount === 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Analytics</h1>
          <p className="text-muted-foreground">Overview of email performance.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by subject or recipient..."
          className="w-[300px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filter}
          onValueChange={(val) => setFilter(val as 'all' | 'opened' | 'not_opened')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="not_opened">Not Opened</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Subject</th>
                  <th className="py-2 px-4 text-left">To</th>
                  <th className="py-2 px-4 text-left">Sent</th>
                  <th className="py-2 px-4 text-left">Opens</th>
                  <th className="py-2 px-4 text-left">Last Open</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{email.subject}</td>
                    <td className="py-3 px-4">{email.recipientEmail}</td>
                    <td className="py-3 px-4">{format(new Date(email.sentAt), 'yyyy-MM-dd HH:mm')}</td>
                    <td className="py-3 px-4">
                      <Badge variant={email.openCount > 0 ? 'default' : 'secondary'}>
                        {email.openCount} {email.openCount === 1 ? 'open' : 'opens'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {email.lastOpenedAt ? format(new Date(email.lastOpenedAt), 'yyyy-MM-dd HH:mm') : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={email.openCount > 0 ? 'bg-green-500' : 'bg-yellow-400 text-black'}>
                        {email.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => alert(`Viewing ${email.subject}`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async()=>Resend(email.id)}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Resend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              setOpen(true);
                              setId(email?.id);
                            //   setEmails((prev) => prev.filter((e) => e.id !== email.id));
                            }}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      <DeleteEmailModal 
      isOpen={open}
      onClose={()=>{
        // setEmails((prev) => prev.filter((e) => e.id !== email.id));
        setOpen(false);
      }}
      id={id!}
      />
    </div>
  );
}
