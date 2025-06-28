'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Upload,
  Filter,
  Users,
  UserPlus,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const contacts = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    status: 'Active',
    segments: ['VIP', 'Newsletter'],
    joinDate: '2024-01-15',
    engagement: 'High',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, CA',
    status: 'Active',
    segments: ['Newsletter'],
    joinDate: '2024-01-12',
    engagement: 'Medium',
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    status: 'Inactive',
    segments: ['Promotions'],
    joinDate: '2024-01-10',
    engagement: 'Low',
  },
];

const segments = [
  { name: 'All Contacts', count: 2547, color: 'bg-blue-500' },
  { name: 'Newsletter', count: 1834, color: 'bg-green-500' },
  { name: 'VIP Customers', count: 423, color: 'bg-purple-500' },
  { name: 'Promotions', count: 1156, color: 'bg-orange-500' },
  { name: 'Inactive', count: 234, color: 'bg-gray-500' },
];

export default function ContactsPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and create targeted segments.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Enter the contact information below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Input type="tel" placeholder="Phone Number" />
                <Input placeholder="Location" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="promotions">Promotions</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Contact</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact List</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts..."
                      className="pl-10 w-[300px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Actions */}
              {selectedContacts.length > 0 && (
                <div className="flex items-center space-x-2 mb-4 p-3 bg-accent rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedContacts.length} contact(s) selected
                  </span>
                  <Button variant="outline" size="sm">
                    Add to Segment
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Selected
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{contact.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={contact.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {contact.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Joined {contact.joinDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {contact.segments.map((segment) => (
                            <Badge key={segment} variant="outline" className="text-xs">
                              {segment}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              contact.engagement === 'High'
                                ? 'default'
                                : contact.engagement === 'Medium'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {contact.engagement} Engagement
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>Add to Segment</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <Card key={segment.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                      <CardTitle className="text-base">{segment.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Segment</DropdownMenuItem>
                        <DropdownMenuItem>Export Contacts</DropdownMenuItem>
                        <DropdownMenuItem>Send Campaign</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Segment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{segment.count.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mb-4">contacts</p>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Contacts
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}