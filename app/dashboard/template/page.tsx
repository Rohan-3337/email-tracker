'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  PlusIcon,
  Edit,
  Copy,
  Trash2,
  Mail,
  Calendar,
  Gift,
  Users,
  MoreHorizontal,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TemplatePreview } from '@/components/template/template-previes';

const iconMap = {
  Onboarding: Users,
  Marketing: Gift,
  Newsletter: Mail,
  Events: Calendar,
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    id: '',
    name: '',
    category: '',
    subject: '',
    content: '',
  });
  const [editing, setEditing] = useState(false);

  const fetchTemplates = async () => {
    const res = await fetch('/api/template');
    const data = await res.json();
    setTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleCreateOrUpdateTemplate = async () => {
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch('/api/template', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate),
    });
    if (res.ok) {
      await fetchTemplates();
      setNewTemplate({ id: '', name: '', category: '', subject: '', content: '' });
      setEditing(false);
      setShowDialog(false);
    }
  };

  const handleEdit = (template: any) => {
    setNewTemplate(template);
    setEditing(true);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/template?id=${id}`, { method: 'DELETE' });
    if (res.ok) await fetchTemplates();
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable email templates for your campaigns.
          </p>
        </div>
        <Button onClick={() => { setEditing(false); setShowDialog(true); setNewTemplate({ id: '', name: '', category: '', subject: '', content: '' }); }}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update your email template.' : 'Design a new email template for your campaigns.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., Introduction Email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="e.g., Onboarding"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder="Subject line"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Write your email content here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant={"outline"} onClick={()=>setShowDialog(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateOrUpdateTemplate}>{editing ? 'Update' : 'Save'} Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email Templates</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon =  Users;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {template.category}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(template)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(template.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.subject}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {showPreview && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          open={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
