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
  Loader2,
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
import { Skeleton } from '@/components/ui/skeleton';
import { Template } from '@/lib/generated/prisma';
import { DeleteTemplateModal } from '@/components/DeleteTemplateDialog';
import { SmartEmailDialog } from '@/components/SmartEmailDialog';
import { SmartFormSubmit } from '@/lib/actions/SmartFormSubmit';

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
  const [templates, setTemplates] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [smartFormDialog, setSmartFormDialog] = useState(false);
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
    const url = editing ? `/api/template/${newTemplate?.id}` : '/api/template';
    try {


      setIsLoading(true)
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });
      if (res.ok) {
        setIsLoading(false)
        await fetchTemplates();
        setNewTemplate({ id: '', name: '', category: '', subject: '', content: '' });
        setEditing(false);
        setShowDialog(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (template: any) => {
    setNewTemplate(template);
    setEditing(true);
    setShowDialog(true);
  };

  const handleDelete = async (template: Template) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };
  const handleUseTemplate = (template: Template) => {
    setSmartFormDialog(true);
    setShowPreview(false);
    setSelectedTemplate(template);
  }

  const filteredTemplates = (templates ?? []).filter((template) =>
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
            <Button type='button' variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateOrUpdateTemplate}>
              {isLoading && <Loader2 className=' mr-2 w-4 h-4 animate-spin' />}
              {editing ? 'Update' : 'Save'} Template
            </Button>
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
          {templates === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground text-sm py-12">
                  No templates found.
                </div>
              )}
              {filteredTemplates.map((template) => {
                const Icon = Users;
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
                            
                            <DropdownMenuItem variant={"destructive"} className="text-destructive" onClick={() => handleDelete(template)}>
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
                        <Button size="sm" className="flex-1" onClick={() => {
                          handleUseTemplate(template)

                        }}>
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
          )}
        </CardContent>
      </Card>
      {showPreview && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          open={showPreview}
          onClose={() => setShowPreview(false)}
          useTemplate={handleUseTemplate}
        />
      )}

      <DeleteTemplateModal isOpen={deleteDialogOpen} onClose={() => {
        setDeleteDialogOpen(false);

      }}
        id={selectedTemplate?.id!}
        data={selectedTemplate!}
      />
      <SmartEmailDialog setOpen={setSmartFormDialog} onOpen={smartFormDialog} initialData={{
        content: selectedTemplate?.content || "",
        subject: selectedTemplate?.subject || "",
      }}
        onSubmit={SmartFormSubmit} />
    </div>
  );
}
