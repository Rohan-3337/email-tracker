'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const emails = [
  {
    id: 1,
    sender: 'Sarah Johnson',
    email: 'sarah@company.com',
    subject: 'Re: Project Update - Q1 Review',
    preview: 'Thank you for the comprehensive update. I have a few questions about the metrics...',
    time: '2 hours ago',
    read: false,
    starred: true,
    tags: ['Important', 'Work'],
  },
  {
    id: 2,
    sender: 'Marketing Team',
    email: 'marketing@newsletter.com',
    subject: 'Weekly Newsletter - Latest Updates',
    preview: 'Check out our latest product features and company news...',
    time: '5 hours ago',
    read: true,
    starred: false,
    tags: ['Newsletter'],
  },
  {
    id: 3,
    sender: 'John Smith',
    email: 'john@partner.com',
    subject: 'Partnership Proposal Discussion',
    preview: 'Following up on our conversation yesterday about the potential partnership...',
    time: '1 day ago',
    read: false,
    starred: false,
    tags: ['Business', 'Important'],
  },
];

export function EmailList() {
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedEmails(
      selectedEmails.length === emails.length ? [] : emails.map((e) => e.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inbox</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="starred">Starred</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          {selectedEmails.length > 0 && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-accent rounded-lg">
              <span className="text-sm font-medium">
                {selectedEmails.length} email(s) selected
              </span>
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}

          {/* Email List */}
          <div className="space-y-2">
            {/* Select All */}
            <div className="flex items-center space-x-3 pb-2 border-b">
              <Checkbox
                checked={selectedEmails.length === emails.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {emails.length} emails
              </span>
            </div>

            {/* Email Items */}
            {emails.map((email) => (
              <div
                key={email.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors ${
                  !email.read ? 'bg-accent/20 border-primary/20' : ''
                }`}
              >
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => toggleEmailSelection(email.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-5 h-5 ${email.starred ? 'text-yellow-500' : ''}`}
                >
                  <Star className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-medium ${!email.read ? 'font-semibold' : ''}`}>
                        {email.sender}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {email.email}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {email.time}
                    </span>
                  </div>
                  <div className={`mt-1 ${!email.read ? 'font-medium' : ''}`}>
                    {email.subject}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    {email.preview}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {email.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon">
                    <Reply className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Forward className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Mark as read</DropdownMenuItem>
                      <DropdownMenuItem>Add to folder</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}